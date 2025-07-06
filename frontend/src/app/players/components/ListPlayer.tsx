"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import EditPlayerForm from "./EditPlayerForm";

type Player = {
  id: number;
  fullName: string;
  ign: string;
  role: string;
  gameAccount: string;
  createdAt: string;
  updatedAt: string;
};

export default function ListPlayer({ reload, onDeleted, onUpdated }: { reload: number, onDeleted: () => void, onUpdated: () => void }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const fetchPlayers = () => {
    setLoading(true);
    api.get("/players")
      .then(res => setPlayers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlayers();
  }, [reload]);

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Xác nhận xóa ${name}?`)) {
      await api.delete(`/players/${id}`);
      onDeleted();
    }
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
  };

  return (
    <div>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">#</th>
              <th className="p-2">Họ tên</th>
              <th className="p-2">IGN</th>
              <th className="p-2">Vai trò</th>
              <th className="p-2">Game Account</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => (
              <tr key={p.id} className="even:bg-gray-50">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{p.fullName}</td>
                <td className="p-2">{p.ign}</td>
                <td className="p-2">{p.role}</td>
                <td className="p-2">{p.gameAccount}</td>
                <td className="p-2">
                  <button 
                    onClick={() => handleEdit(p)} 
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id, p.fullName)} 
                    className="text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editingPlayer && (
        <EditPlayerForm
          player={editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onUpdated={() => {
            setEditingPlayer(null);
            onUpdated();
          }}
        />
      )}
    </div>
  );
}
