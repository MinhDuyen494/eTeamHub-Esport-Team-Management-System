"use client";
import { useState } from "react";
import api from "@/utils/api";

type Event = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  type: string;
  note?: string;
};

export default function EditEventForm({
  event,
  onClose,
  onUpdated,
}: {
  event: Event;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [form, setForm] = useState({
    title: event.title,
    startTime: event.startTime.slice(0, 16), // Đảm bảo đúng định dạng
    endTime: event.endTime.slice(0, 16),
    type: event.type,
    note: event.note || "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      console.log('=== FRONTEND UPDATE DEBUG ===');
      console.log('Event ID:', event.id);
      console.log('Form data:', form);
      
      // Kiểm tra việc chuyển đổi date
      const startDate = new Date(form.startTime);
      const endDate = new Date(form.endTime);
      console.log('Start date object:', startDate);
      console.log('End date object:', endDate);
      console.log('Start date ISO:', startDate.toISOString());
      console.log('End date ISO:', endDate.toISOString());
      
      const payload = {
        ...form,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      };
      console.log('Payload being sent:', payload);
      console.log('=== END FRONTEND DEBUG ===');
      
      const response = await api.put(`/events/${event.id}`, payload);
      console.log('Response from server:', response.data);
      
      onUpdated();
    } catch (err: any) {
      console.error('Error updating event:', err);
      alert(err?.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">Sửa sự kiện</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="border w-full p-2 rounded" name="title" placeholder="Tiêu đề" value={form.title} onChange={handleChange} required />
          <input className="border w-full p-2 rounded" type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required />
          <input className="border w-full p-2 rounded" type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} required />
          <select className="border w-full p-2 rounded" name="type" value={form.type} onChange={handleChange}>
            <option>Luyện tập</option>
            <option>Thi đấu</option>
          </select>
          <input className="border w-full p-2 rounded" name="note" placeholder="Ghi chú" value={form.note} onChange={handleChange} />
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>Hủy</button>
            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={submitting}>
              {submitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
