"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";

type Event = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  type: string;
  note: string;
};

// Hàm tiện ích để chuyển đổi ngày tháng sang định dạng input datetime-local
const toDateTimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
};

export default function EditEventForm({ event, onClose, onUpdated }: { event: Event; onClose: () => void; onUpdated: () => void; }) {
  const [form, setForm] = useState({
    title: event.title,
    startTime: toDateTimeLocal(event.startTime),
    endTime: toDateTimeLocal(event.endTime),
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
      await api.put(`/events/${event.id}`, form); //
      onUpdated(); // Báo cho component cha reload
    } catch (err: any) {
      alert(err?.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa sự kiện</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
            <input className="border p-2 rounded w-full mt-1" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Thời gian bắt đầu</label>
              <input className="border p-2 rounded w-full mt-1" type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Thời gian kết thúc</label>
              <input className="border p-2 rounded w-full mt-1" type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} required />
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Loại sự kiện</label>
             <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded w-full mt-1">
                <option value="Luyện tập">Luyện tập</option>
                <option value="Thi đấu">Thi đấu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
            <input className="border p-2 rounded w-full mt-1" name="note" value={form.note} onChange={handleChange} />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Hủy</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={submitting}>
              {submitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}