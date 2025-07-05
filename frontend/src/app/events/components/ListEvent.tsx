"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

type Event = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  type: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export default function ListEvent({ reload, onDeleted, onUpdated }: { reload: number, onDeleted: () => void, onUpdated: () => void }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = () => {
    setLoading(true);
    api.get("/events")
      .then(res => setEvents(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [reload]);

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Xác nhận xóa sự kiện "${title}"?`)) {
      await api.delete(`/events/${id}`);
      onDeleted();
    }
  };

  // Nâng cao: thêm form sửa EditEventForm ở đây nếu muốn

  return (
    <div>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">#</th>
              <th className="p-2">Tiêu đề</th>
              <th className="p-2">Bắt đầu</th>
              <th className="p-2">Kết thúc</th>
              <th className="p-2">Loại</th>
              <th className="p-2">Ghi chú</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={e.id} className="even:bg-gray-50">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{e.title}</td>
                <td className="p-2">{new Date(e.startTime).toLocaleString()}</td>
                <td className="p-2">{new Date(e.endTime).toLocaleString()}</td>
                <td className="p-2">{e.type}</td>
                <td className="p-2">{e.note}</td>
                <td className="p-2">
                  {/* Thêm nút Sửa ở đây khi cần */}
                  <button onClick={() => handleDelete(e.id, e.title)} className="text-red-600 hover:underline">
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
