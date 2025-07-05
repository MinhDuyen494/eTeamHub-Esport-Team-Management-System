"use client";
import { useState } from "react";
import api from "@/utils/api";

export default function CreatePlayerForm({ onPlayerAdded }: { onPlayerAdded: () => void }) {
  const [form, setForm] = useState({ fullName: "", ign: "", role: "", gameAccount: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/players", form);
      setForm({ fullName: "", ign: "", role: "", gameAccount: "" });
      onPlayerAdded();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-2 items-end"
    >
      <input className="border p-2 rounded" name="fullName" placeholder="Họ tên" value={form.fullName} onChange={handleChange} required />
      <input className="border p-2 rounded" name="ign" placeholder="IGN" value={form.ign} onChange={handleChange} required />
      <input className="border p-2 rounded" name="role" placeholder="Vai trò" value={form.role} onChange={handleChange} required />
      <input className="border p-2 rounded" name="gameAccount" placeholder="Game Account" value={form.gameAccount} onChange={handleChange} required />
      <button type="submit" className="col-span-1 sm:col-span-4 bg-blue-600 text-white rounded p-2" disabled={submitting}>
        {submitting ? "Đang thêm..." : "Thêm tuyển thủ"}
      </button>
    </form>
  );
}
