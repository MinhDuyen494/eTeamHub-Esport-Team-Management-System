"use client";
import CreatePlayerForm from "./components/CreatePlayerForm";
import ListPlayer from "./components/ListPlayer";
import { useState } from "react";

export default function PlayersPage() {
  const [reload, setReload] = useState(0);

  // Gọi hàm này sau khi thêm/xóa thành công để load lại danh sách
  const handleReload = () => setReload((prev) => prev + 1);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Quản lý tuyển thủ</h1>
      <CreatePlayerForm onPlayerAdded={handleReload} />
      <ListPlayer reload={reload} onDeleted={handleReload} />
    </div>
  );
}
