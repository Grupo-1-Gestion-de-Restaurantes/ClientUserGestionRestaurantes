import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, Plus, CheckCircle2, XCircle, Clock4 } from 'lucide-react';
import { useReservationsStore } from '../store/useReservationsStore';
import { useRestaurantsStore } from '../store/useRestaurantsStore';
import { tablesApi } from '../../../shared/api/tables';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

import 'react-day-picker/dist/style.css';

export const ReservationsPage = () => {
  const { reservations, loading, fetchMyReservations, createReservation } = useReservationsStore();
  const { restaurants, fetchRestaurants } = useRestaurantsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [tables, setTables] = useState([]);
  const [time, setTime] = useState('12:00');
  const [people, setPeople] = useState(2);

  useEffect(() => {
    fetchMyReservations();
    fetchRestaurants();
  }, [fetchMyReservations, fetchRestaurants]);

  useEffect(() => {
    if (selectedRestaurant) {
      console.log('Fetching tables for restaurant:', selectedRestaurant);
      setSelectedTable('');
      tablesApi.getByRestaurant(selectedRestaurant).then(res => {
        console.log('API Response for tables:', res);
        if (res?.success && Array.isArray(res.data)) {
          setTables(res.data);
        } else if (Array.isArray(res)) {
          setTables(res);
        } else {
          setTables([]);
        }
      }).catch(err => {
        console.error('Error in useEffect tables:', err);
        setTables([]);
      });
    } else {
      setTables([]);
    }
  }, [selectedRestaurant]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedRestaurant || !selectedTable) {
      toast.error('Por favor selecciona restaurante y mesa');
      return;
    }

    const res = await createReservation({
      restaurantId: selectedRestaurant,
      tableId: selectedTable,
      reservationDate: format(selectedDate, 'yyyy-MM-dd'),
      time,
      numberOfPeople: people
    });

    if (res.success) {
      toast.success('Reserva creada con éxito');
      setIsModalOpen(false);
      resetForm();
      fetchMyReservations(); // Refresh list
    } else {
      toast.error(res.message || 'Error al crear reserva');
    }
  };

  const resetForm = () => {
    setSelectedRestaurant('');
    setSelectedTable('');
    setTables([]);
    setSelectedDate(new Date());
    setTime('12:00');
    setPeople(2);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMADA': return <CheckCircle2 className="text-green-500" size={18} />;
      case 'CANCELADA': return <XCircle className="text-red-500" size={18} />;
      default: return <Clock4 className="text-amber-500" size={18} />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bangers tracking-wider text-on-base">
            Mis <span className="text-primary">Reservas</span>
          </h1>
          <p className="text-on-base-muted mt-1">Gestiona tus visitas a nuestros restaurantes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-secondary text-on-secondary px-6 py-3 rounded-2xl border-[3px] border-stroke-strong shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bangers tracking-widest"
        >
          <Plus size={20} /> NUEVA RESERVA
        </button>
      </div>

      {loading && reservations.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-3xl bg-surface-2 animate-pulse border-[3px] border-stroke-soft" />
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-2/50 rounded-3xl border-[3px] border-dashed border-stroke-soft">
          <CalendarIcon size={64} className="text-on-base-faint mb-4" />
          <p className="text-xl font-bangers tracking-widest text-on-base-muted">No tienes reservas aún</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-primary font-bold hover:underline"
          >
            ¡Reserva tu primera mesa ahora!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((res) => (
            <div 
              key={res._id || res.id} 
              className="bg-surface-2 border-[3px] border-stroke-strong rounded-3xl p-6 shadow-brutal-sm hover:shadow-brutal transition-all flex flex-col gap-4 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bangers text-2xl text-on-base tracking-wide truncate">
                    {res.restaurant?.name || 'Restaurante'}
                  </h3>
                  <p className="text-xs text-on-base-muted uppercase tracking-widest">
                    Mesa #{res.table?.tableNumber || res.tableId?.tableNumber || '?'}
                  </p>
                </div>
                <div className="bg-surface-3 p-2 rounded-xl border-2 border-stroke-soft">
                  {getStatusIcon(res.status)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-on-base">
                  <CalendarIcon size={14} className="text-primary" />
                  {format(new Date(res.date || res.reservationDate), 'PPPP', { locale: es })}
                </div>
                <div className="flex items-center gap-2 text-sm text-on-base">
                  <Clock size={14} className="text-primary" />
                  {res.time || format(new Date(res.reservationDate), 'HH:mm')} hs
                </div>
                <div className="flex items-center gap-2 text-sm text-on-base">
                  <Users size={14} className="text-primary" />
                  {res.numberOfPeople} personas
                </div>
              </div>

              <div className={`mt-auto pt-4 border-t-2 border-dashed border-stroke-soft flex justify-between items-center`}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-base-muted">
                  Estado: {res.status}
                </span>
                <button className="text-xs font-bold text-primary hover:underline">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nueva Reserva */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-surface-1/80 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-4xl bg-surface-2 border-[3px] border-stroke-strong rounded-3xl shadow-brutal p-6 md:p-8 flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto">
            
            {/* Calendar Section */}
            <div className="md:w-1/2 space-y-4">
              <h3 className="font-bangers text-2xl text-on-base">1. Elige Fecha</h3>
              <div className="bg-surface-3 rounded-2xl p-4 border-[3px] border-stroke-soft flex justify-center">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  locale={es}
                  className="mx-auto"
                />
              </div>
            </div>

            {/* Details Section */}
            <form onSubmit={handleCreate} className="md:w-1/2 space-y-6 flex flex-col">
              <h3 className="font-bangers text-2xl text-on-base">2. Detalles</h3>
              
              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-on-base-muted mb-2 block">
                    Restaurante
                  </label>
                  <select
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                    required
                    className="w-full bg-surface-3 border-[3px] border-stroke-strong rounded-xl px-4 py-3 font-semibold text-on-base focus:outline-none focus:border-primary"
                  >
                    <option value="">Seleccionar...</option>
                    {restaurants.map(r => (
                      <option key={r._id || r.id} value={r._id || r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-on-base-muted mb-2 block">
                    Mesa
                  </label>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    required
                    disabled={!selectedRestaurant || tables.length === 0}
                    className="w-full bg-surface-3 border-[3px] border-stroke-strong rounded-xl px-4 py-3 font-semibold text-on-base focus:outline-none focus:border-primary disabled:opacity-50"
                  >
                    <option value="">{tables.length === 0 ? 'No hay mesas disponibles' : 'Seleccionar...'}</option>
                    {tables.map(t => (
                      <option key={t._id || t.id} value={t._id || t.id}>Mesa #{t.tableNumber} - Cap: {t.capacity} pers.</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-on-base-muted mb-2 block">
                      Hora
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="w-full bg-surface-3 border-[3px] border-stroke-strong rounded-xl px-4 py-3 font-semibold text-on-base focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-on-base-muted mb-2 block">
                      Personas
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={people}
                      onChange={(e) => setPeople(parseInt(e.target.value))}
                      required
                      className="w-full bg-surface-3 border-[3px] border-stroke-strong rounded-xl px-4 py-3 font-semibold text-on-base focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 mt-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border-[3px] border-stroke-strong font-bangers tracking-widest text-on-base hover:bg-surface-3 transition-all"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl border-[3px] border-stroke-strong bg-primary text-on-primary font-bangers tracking-widest shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  CONFIRMAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
