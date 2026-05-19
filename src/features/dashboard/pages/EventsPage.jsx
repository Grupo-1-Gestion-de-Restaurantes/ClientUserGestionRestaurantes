import { useEffect } from 'react';
import { Calendar, MapPin, Users, Ticket, Bell } from 'lucide-react';
import { useEventsStore } from '../store/useEventsStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

export const EventsPage = () => {
  const { events, loading, fetchEvents, subscribeToEvent } = useEventsStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSubscribe = async (id) => {
    const res = await subscribeToEvent(id);
    if (res.success) {
      toast.success('¡Suscripción exitosa!');
    } else {
      toast.error(res.message || 'Error al suscribirse');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bangers tracking-wider text-on-base">
          Eventos <span className="text-secondary">Exclusivos</span>
        </h1>
        <p className="text-on-base-muted mt-1">Descubre experiencias únicas en tus restaurantes favoritos.</p>
      </div>

      {loading && events.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="h-64 rounded-3xl bg-surface-2 animate-pulse border-[3px] border-stroke-soft" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-2/50 rounded-3xl border-[3px] border-dashed border-stroke-soft">
          <Bell size={64} className="text-on-base-faint mb-4" />
          <p className="text-xl font-bangers tracking-widest text-on-base-muted">No hay eventos próximos</p>
          <p className="text-sm text-on-base-muted mt-2">Vuelve pronto para ver nuevas experiencias.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <div 
              key={event._id || event.id} 
              className="bg-surface-2 border-[3px] border-stroke-strong rounded-3xl overflow-hidden shadow-brutal-sm hover:shadow-brutal transition-all flex flex-col group"
            >
              {/* Header with Type */}
              <div className="px-6 pt-6 flex justify-between items-center">
                <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {event.typeEvent?.replace('_', ' ')}
                </span>
                <Ticket size={24} className="text-on-base-faint" />
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-bangers text-3xl text-on-base tracking-wide leading-none">
                    {event.name}
                  </h3>
                </div>
                
                <p className="text-on-base-muted text-sm line-clamp-2">
                  {event.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-on-base">
                    <Calendar size={14} className="text-primary" />
                    {event.dateTime ? format(new Date(event.dateTime), 'dd MMM, yyyy', { locale: es }) : '—'}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-on-base">
                    <MapPin size={14} className="text-primary" />
                    {event.restaurant?.name || 'Restaurante'}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-on-base">
                    <Users size={14} className="text-primary" />
                    {event.capacity - (event.attendees?.length || 0)} cupos libres
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-on-base">
                    <Ticket size={14} className="text-primary" />
                    Q{event.price?.toFixed(2) || '0.00'}
                    </div>                </div>

                <div className="mt-auto pt-6 flex items-center gap-4">
                  <button
                    onClick={() => handleSubscribe(event._id || event.id)}
                    disabled={event.capacity <= (event.attendees?.length || 0)}
                    className="flex-1 bg-primary text-on-primary px-6 py-3 rounded-2xl border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:grayscale transition-all font-bangers tracking-widest text-lg"
                  >
                    {event.capacity <= (event.attendees?.length || 0) ? 'AGOTADO' : 'SUSCRIBIRME'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
