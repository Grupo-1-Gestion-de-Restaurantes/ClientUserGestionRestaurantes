import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  Clock,
  Info,
  MapPin,
  MessageSquare,
  Phone,
  ShoppingBag,
  Star,
  Store,
  Tag,
  Users,
} from 'lucide-react';
import { StarRating } from '../../../shared/components/ui/StarRating';
import { getRestaurantById } from '../../../shared/api/restaurants';
import { useReviewsStore } from '../store/useReviewsStore';
import { useRestaurantsStore } from '../store/useRestaurantsStore';
import { showSuccess } from '../../../shared/utils/toast';

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const initials = (name) => {
  if (!name) return '?';
  return String(name).split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
};

export const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const byRestaurant = useReviewsStore((s) => s.byRestaurant);
  const fetchRestaurantComments = useReviewsStore((s) => s.fetchRestaurantComments);

  const setSelected = useRestaurantsStore((s) => s.setSelectedRestaurant);
  const selectedRestaurantId = useRestaurantsStore((s) => s.selectedRestaurantId);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getRestaurantById(id);
        if (!cancelled) {
          setRestaurant(data?.data || data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'No se pudo cargar el restaurante');
          setLoading(false);
        }
      }
    }
    if (id) load();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchRestaurantComments(id);
    }
  }, [id, fetchRestaurantComments]);

  const reviews = byRestaurant[id] || [];

  const stats = useMemo(() => {
    if (!reviews.length) return { avg: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
    const distribution = [0, 0, 0, 0, 0];
    let total = 0;
    reviews.forEach((c) => {
      const r = Math.round(Number(c.review) || 0);
      if (r >= 1 && r <= 5) distribution[r - 1] += 1;
      total += Number(c.review) || 0;
    });
    return { avg: total / reviews.length, count: reviews.length, distribution };
  }, [reviews]);

  const handleSelect = () => {
    setSelected(id);
    showSuccess(`${restaurant?.name || 'Restaurante'} seleccionado`);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong h-64 animate-pulse" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          to="/dashboard/restaurants"
          className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-on-base-muted hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft size={14} /> Volver a restaurantes
        </Link>
        <div className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-10 text-center">
          <Store className="mx-auto text-on-base-muted" size={28} />
          <div className="mt-3 font-bangers text-xl text-on-base">RESTAURANTE NO ENCONTRADO</div>
          <p className="text-xs text-on-base-muted mt-1">{error || 'No existe el restaurante solicitado.'}</p>
        </div>
      </div>
    );
  }

  const photo = restaurant.photo || restaurant.image;
  const isSelected = String(selectedRestaurantId) === String(id);
  const maxCount = Math.max(...stats.distribution, 1);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <Link
        to="/dashboard/restaurants"
        className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-on-base-muted hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft size={14} /> Volver a restaurantes
      </Link>

      <section className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong overflow-hidden shadow-brutal-sm">
        <div className="relative h-48 md:h-64 bg-surface-3 flex items-center justify-center">
          {photo ? (
            <img src={photo} alt={restaurant.name} className="w-full h-full object-cover" />
          ) : (
            <Store className="text-on-base-muted" size={64} />
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {restaurant.categories && (
              <span className="text-[10px] font-black tracking-widest uppercase bg-primary/90 text-on-primary border-[2px] border-stroke-strong rounded-full px-3 py-1">
                {restaurant.categories}
              </span>
            )}
            {restaurant.status && (
              <span className={`text-[10px] font-black tracking-widest uppercase border-[2px] border-stroke-strong rounded-full px-3 py-1 ${restaurant.status === 'Abierto' ? 'bg-secondary text-on-secondary' : 'bg-surface-3 text-on-base-muted'}`}>
                {restaurant.status}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0 flex-1">
              <h1 className="font-bangers tracking-wider text-3xl md:text-5xl text-on-base">
                {restaurant.name}
              </h1>
              {restaurant.description && (
                <p className="mt-2 text-sm text-on-base-muted">{restaurant.description}</p>
              )}
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5">
                <StarRating value={restaurant.rating || 0} readonly size={18} />
              </div>
              <div className="text-xs text-on-base-muted mt-1">
                {stats.count} reseña{stats.count === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow icon={MapPin} label="Dirección" value={`${restaurant.address || '—'}, ${restaurant.city || ''}`} />
            <InfoRow icon={Phone} label="Teléfono" value={restaurant.phone || '—'} />
            <InfoRow icon={Clock} label="Horario" value={restaurant.openingTime && restaurant.closingTime ? `${restaurant.openingTime} – ${restaurant.closingTime}` : '—'} />
            <InfoRow icon={Users} label="Capacidad" value={restaurant.capacity ? `${restaurant.capacity} personas` : '—'} />
            {restaurant.averagePrice !== undefined && restaurant.averagePrice !== null && restaurant.averagePrice !== '' && (
              <InfoRow icon={Tag} label="Precio promedio" value={`Q${Number(restaurant.averagePrice).toFixed(2)}`} />
            )}
            <InfoRow icon={Calendar} label="Antigüedad" value={restaurant.createdAt ? formatDate(restaurant.createdAt) : '—'} />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSelect}
              disabled={isSelected}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border-[3px] border-stroke-strong font-bangers tracking-widest shadow-brutal-sm ${isSelected ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all'}`}
            >
              <ShoppingBag size={16} />
              {isSelected ? 'RESTAURANTE ACTIVO' : 'COMENZAR PEDIDO'}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-6 md:p-8 shadow-brutal-sm">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <div className="text-xs text-on-base-muted font-black tracking-widest uppercase">Opiniones</div>
            <h2 className="font-bangers tracking-wider text-2xl text-on-base">
              Reseñas de clientes
            </h2>
          </div>
        </div>

        <div className="mb-5 flex items-start gap-3 rounded-2xl bg-secondary/10 border-[3px] border-secondary/40 px-4 py-3">
          <Info size={18} className="text-secondary shrink-0 mt-0.5" />
          <p className="text-sm text-on-base">
            Para calificar un restaurante, realiza un pedido y ve a tu{' '}
            <Link to="/dashboard/history" className="font-semibold text-secondary hover:underline">
              Historial
            </Link>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-1 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong p-4 flex flex-col items-center text-center">
            <div className="font-bangers text-6xl text-on-base leading-none">
              {stats.avg ? stats.avg.toFixed(1) : '—'}
            </div>
            <div className="mt-1">
              <StarRating value={stats.avg} readonly size={16} />
            </div>
            <div className="text-[10px] font-black tracking-widest uppercase text-on-base-muted mt-1">
              {stats.count} reseña{stats.count === 1 ? '' : 's'}
            </div>
            <div className="w-full mt-4 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.distribution[star - 1] || 0;
                const pct = (count / maxCount) * 100;
                return (
                  <div key={star} className="flex items-center gap-2 text-[10px] font-bold text-on-base-muted">
                    <span className="w-6 text-right">{star}</span>
                    <Star size={10} className="text-primary" fill="currentColor" />
                    <div className="flex-1 h-2 rounded-full bg-surface-2 overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-left">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-2">
            {stats.count === 0 ? (
              <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong p-8 text-center">
                <MessageSquare className="mx-auto text-on-base-muted" size={28} />
                <div className="mt-3 font-bangers text-xl text-on-base">SIN RESEÑAS AÚN</div>
                <p className="text-xs text-on-base-muted mt-1">
                  Aún no hay opiniones de otros clientes.
                </p>
              </div>
            ) : (
              <ul className="space-y-3 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
                {reviews.map((c) => (
                  <li
                    key={c._id || c.id}
                    className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bangers text-sm border-[2px] border-stroke-strong shrink-0">
                        {initials(c.clientId?.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-on-base truncate">
                          {c.clientId?.name || 'Cliente'}
                        </div>
                        <div className="text-[10px] text-on-base-muted">
                          {formatDate(c.createdAt)}
                        </div>
                      </div>
                      <StarRating value={c.review} readonly size={14} />
                    </div>
                    <p className="mt-3 text-sm text-on-base whitespace-pre-wrap break-words">
                      {c.comment}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-3">
    <Icon size={16} className="text-on-base-muted shrink-0" />
    <div className="min-w-0 flex-1">
      <div className="text-[11px] tracking-widest uppercase text-on-base-muted">{label}</div>
      <div className="text-sm text-on-base font-semibold truncate">{value || '—'}</div>
    </div>
  </div>
);
