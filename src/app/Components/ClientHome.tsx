// app/ClientHome.tsx
'use client';

import { GameContext, GameProvider } from './GameContext';
import GameList from './GameList';
import SettingsButton from './SettingsButton';

export default function ClientHome() {
  return (
    <main className="max-w-3xl mx-auto p-4">
      <GameProvider>
        <div className="flex justify-end mb-6">
          <SettingsButton />
        </div>

        <h1 className="text-3xl font-bold text-center mb-8">
          Valorant Game Schedule
        </h1>

        <GameList />
      </GameProvider>
    </main>
  );
}
