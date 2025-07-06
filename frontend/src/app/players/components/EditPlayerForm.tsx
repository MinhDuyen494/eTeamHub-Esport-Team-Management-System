"use client";
import { useState } from "react";
import api from "@/utils/api";

type Player = {
  id: number;
  fullName: string;
  ign: string;
  role: string;
  gameAccount: string;
};

export default function EditPlayerForm({
  player,
  onClose,
  onUpdated,
}: {
  player: Player;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [form, setForm] = useState({
    fullName: player.fullName,
    ign: player.ign,
    role: player.role,
    gameAccount: player.gameAccount,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      console.log('=== FRONTEND UPDATE PLAYER DEBUG ===');
      console.log('Player ID:', player.id);
      console.log('Form data:', form);
      console.log('Payload being sent:', form);
      console.log('=== END FRONTEND DEBUG ===');
      
      const response = await api.put(`/players/${player.id}`, form);
      console.log('Response from server:', response.data);
      
      onUpdated();
    } catch (err: any) {
      console.error('Error updating player:', err);
      alert(err?.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">Sửa thông tin tuyển thủ</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input 
            className="border w-full p-2 rounded" 
            name="fullName" 
            placeholder="Họ tên đầy đủ" 
            value={form.fullName} 
            onChange={handleChange} 
            required 
          />
          <input 
            className="border w-full p-2 rounded" 
            name="ign" 
            placeholder="In-game Name (IGN)" 
            value={form.ign} 
            onChange={handleChange} 
            required 
          />
          <select 
            className="border w-full p-2 rounded" 
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
            className="border w-full p-2 rounded" 
            name="gameAccount" 
            placeholder="Tài khoản game (VD: Riot ID)" 
            value={form.gameAccount} 
            onChange={handleChange} 
            required 
          />
          <div className="flex justify-end space-x-2 pt-2">
            <button 
              type="button" 
              className="px-3 py-1 bg-gray-200 rounded" 
              onClick={onClose}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-3 py-1 bg-blue-600 text-white rounded" 
              disabled={submitting}
            >
              {submitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
