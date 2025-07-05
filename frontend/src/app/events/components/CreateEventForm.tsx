"use client";
import { useState } from "react";
import api from "@/utils/api";

export default function CreateEventForm({ onEventAdded }: { onEventAdded: () => void }) {
  const [form, setForm] = useState({
    title: "",
    startTime: "",
    endTime: "",
    type: "Luyện tập",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/events", form);
      setForm({ title: "", startTime: "", endTime: "", type: "Luyện tập", note: "" });
      onEventAdded();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
      <input className="border p-2 rounded" name="title" placeholder="Tiêu đề" value={form.title} onChange={handleChange} required />
      <input className="border p-2 rounded" type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required />
      <input className="border p-2 rounded" type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} required />
      <select className="border p-2 rounded" name="type" value={form.type} onChange={handleChange}>
        <option>Luyện tập</option>
        <option>Thi đấu</option>
      </select>
      <input className="border p-2 rounded" name="note" placeholder="Ghi chú" value={form.note} onChange={handleChange} />
      <button type="submit" className="col-span-1 sm:col-span-5 bg-green-600 text-white rounded p-2" disabled={submitting}>
        {submitting ? "Đang thêm..." : "Thêm sự kiện"}
      </button>
    </form>
  );
}
