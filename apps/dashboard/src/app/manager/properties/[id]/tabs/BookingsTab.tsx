'use client';

import { useState, useEffect } from 'react';
import { managerApi, Booking } from '../../../../../lib/api-client';
import { useToastContext } from '../../../../../components/ToastProvider';
import { DataTable } from '../../../../../components/common/DataTable';
import { FormModal } from '../../../../../components/common/FormModal';

export function BookingsTab({ propertyId }: { propertyId: string }) {
  const toast = useToastContext();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    totalAmount: '',
    source: '',
    guestName: '',
    description: '',
  });

  useEffect(() => {
    loadBookings();
  }, [propertyId]);

  async function loadBookings() {
    try {
      setLoading(true);
      const data = await managerApi.getBookings(propertyId);
      setBookings(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки бронирований');
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingBooking(null);
    setFormData({
      checkIn: '',
      checkOut: '',
      totalAmount: '',
      source: '',
      guestName: '',
      description: '',
    });
    setShowModal(true);
  }

  function openEditModal(booking: Booking) {
    setEditingBooking(booking);
    setFormData({
      checkIn: new Date(booking.checkinDate).toISOString().split('T')[0],
      checkOut: new Date(booking.checkoutDate).toISOString().split('T')[0],
      totalAmount: booking.amount.toString(),
      source: booking.source,
      guestName: booking.guestName || '',
      description: booking.comment || '',
    });
    setShowModal(true);
  }

  async function handleSubmit() {
    if (!formData.checkIn || !formData.checkOut) {
      toast.error('Укажите даты заезда и выезда');
      return;
    }

    if (!formData.totalAmount.trim() || parseFloat(formData.totalAmount) <= 0) {
      toast.error('Укажите корректную сумму');
      return;
    }

    if (!formData.source.trim()) {
      toast.error('Укажите источник бронирования');
      return;
    }

    try {
      const data = {
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        totalAmount: parseFloat(formData.totalAmount),
        source: formData.source,
        guestName: formData.guestName || undefined,
        description: formData.description || undefined,
      };

      if (editingBooking) {
        await managerApi.updateBooking(editingBooking.id, data);
        toast.success('Бронирование изменено');
      } else {
        await managerApi.addBooking(propertyId, data);
        toast.success('Бронирование добавлено');
      }

      setShowModal(false);
      await loadBookings();
    } catch (err: any) {
      toast.error(err.message || 'Ошибка сохранения');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить это бронирование?')) return;

    try {
      await managerApi.deleteBooking(id);
      toast.success('Бронирование удалено');
      await loadBookings();
    } catch (err: any) {
      toast.error(err.message || 'Ошибка удаления');
    }
  }

  const columns = [
    { key: 'checkinDate', label: 'Заезд' },
    { key: 'checkoutDate', label: 'Выезд' },
    { key: 'source', label: 'Источник' },
    { key: 'amount', label: 'Сумма' },
    { key: 'guestName', label: 'Гость' },
    { key: 'actions', label: 'Действия' },
  ];

  const rows = bookings.map((booking) => ({
    id: booking.id,
    checkinDate: new Date(booking.checkinDate).toLocaleDateString('ru-RU'),
    checkoutDate: new Date(booking.checkoutDate).toLocaleDateString('ru-RU'),
    source: booking.source,
    amount: `${booking.amount.toLocaleString('ru-RU')} ₽`,
    guestName: booking.guestName || '-',
    actions: (
      <div className="flex gap-2">
        <button
          onClick={() => openEditModal(booking)}
          className="px-3 py-1 bg-sabay-primary/10 border border-sabay-primary text-sabay-primary rounded-lg hover:bg-sabay-primary/20 transition text-sm"
        >
          Изменить
        </button>
        <button
          onClick={() => handleDelete(booking.id)}
          className="px-3 py-1 bg-red-500/10 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/20 transition text-sm"
        >
          Удалить
        </button>
      </div>
    ),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Бронирования</h3>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-sabay-primary rounded-lg hover:bg-sabay-primary/90 transition text-sm font-medium"
        >
          + Добавить бронирование
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-white/60">Загрузка...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 text-white/60">Нет бронирований</div>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      {showModal && (
        <FormModal
          title={editingBooking ? 'Изменить бронирование' : 'Добавить бронирование'}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Дата заезда *</label>
              <input
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Дата выезда *</label>
              <input
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Сумма (₽) *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Источник *</label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Airbnb, Booking.com, Direct"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Имя гостя</label>
              <input
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Имя гостя"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                rows={3}
                placeholder="Дополнительная информация"
              />
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}
