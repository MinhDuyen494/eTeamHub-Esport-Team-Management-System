export interface Player {
  id: number;
  fullName: string;
  ign: string;
  roleInGame: { name: string };
  gameAccount: string;
  team?: { id: number; name: string } | null;
  createdAt: string;
  updatedAt: string;
} 