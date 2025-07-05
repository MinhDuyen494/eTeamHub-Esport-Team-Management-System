"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

type Player = {
  id: number;
  fullName: string;
  ign: string;
  role: string;
  gameAccount: string;
  createdAt: string;
  updatedAt: string;
};

export default function ListPlayer({ reload, onDeleted }: { reload: number, onDeleted: () => void }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = () => {
    setLoading(true);
    api.get("/players")
      .then(res => setPlayers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Xác nhận xóa ${name}?`)) {
      await api.delete(`/players/${id}`);
      setPlayers(players.filter(x => x.id !== id));
    }
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
                  {/* Nút sửa sẽ thêm sau */}
                  <button onClick={() => handleDelete(p.id, p.fullName)} className="text-red-600 hover:underline">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
