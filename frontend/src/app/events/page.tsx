"use client";
import { useState } from "react";
import ListEvent from "./components/ListEvent";
import CreateEventForm from "./components/CreateEventForm";

export default function EventsPage() {
  const [reload, setReload] = useState(0);
  const handleReload = () => setReload((prev) => prev + 1);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Quản lý lịch trình đội</h1>
      <CreateEventForm onEventAdded={handleReload} />
      <ListEvent reload={reload} onDeleted={handleReload} onUpdated={handleReload} />
    </div>
  );
}
