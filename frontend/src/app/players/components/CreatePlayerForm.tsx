"use client";
import { useState } from "react";
import api from "@/utils/api";

export default function CreatePlayerForm({ onPlayerAdded }: { onPlayerAdded: () => void }) {
  const [form, setForm] = useState({ fullName: "", ign: "", role: "", gameAccount: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      <input 
        className="border p-2 rounded" 
        name="fullName" 
        placeholder="Họ tên đầy đủ" 
        value={form.fullName} 
        onChange={handleChange} 
        required 
      />
      <input 
        className="border p-2 rounded" 
        name="ign" 
        placeholder="In-game Name (IGN)" 
        value={form.ign} 
        onChange={handleChange} 
        required 
      />
      <select 
        className="border p-2 rounded" 
        name="role" 
        value={form.role} 
        onChange={handleChange}
        required
      >
        <option value="">Chọn vai trò</option>
        <option value="Top">Top</option>
        <option value="Jungle">Jungle</option>
        <option value="Mid">Mid</option>
        <option value="ADC">ADC</option>
        <option value="Support">Support</option>
      </select>
      <input 
        className="border p-2 rounded" 
        name="gameAccount" 
        placeholder="Tài khoản game (VD: Riot ID)" 
        value={form.gameAccount} 
        onChange={handleChange} 
        required 
      />
      <button 
        type="submit" 
        className="col-span-1 sm:col-span-4 bg-blue-600 text-white rounded p-2" 
        disabled={submitting}
      >
        {submitting ? "Đang thêm..." : "Thêm tuyển thủ"}
      </button>
    </form>
  );
}
