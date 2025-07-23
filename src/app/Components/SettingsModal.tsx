'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { GameContext } from './GameContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnableNotifications: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onEnableNotifications,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const context = useContext(GameContext);

  if (!context) throw new Error('SettingsModal must be used within a GameProvider');

  const [games, setGames] = [context.games, context.setGames];
  const [teamChecks, setTeamChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onClearSettings = () => {
    localStorage.removeItem('games');
    window.location.reload();
  };

  const uniqueTeams = Array.from(
    new Map(
      games
        .map(game => game.teams[0])
        .filter(team => team?.name) // optional: ignore if teams[0] is undefined
        .map(team => [team.name, team]) // use name as key to ensure uniqueness
    ).values()
  );

  const handleCheckboxChange = (teamName: string) => {
    const updatedChecks = {
      ...teamChecks,
      [teamName]: !teamChecks[teamName],
    };
    setTeamChecks(updatedChecks);

    // ✅ Filter games where teams[0].name is still checked
    const allowedTeams = Object.entries(updatedChecks)
      .filter(([, isChecked]) => isChecked)
      .map(([name]) => name);

    const filteredGames = games.filter(game =>
      allowedTeams.includes(game.teams[0].name)
    );

    setGames(filteredGames);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl"
          aria-label="Close settings modal"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Settings
        </h2>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={onEnableNotifications}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Enable Notifications
          </button>

          <button
            onClick={onClearSettings}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Clear Settings
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Selected Teams:</h2>
        </div>

        <div className="space-y-2">
          {uniqueTeams.map((team, index) => (
            <div key={team.name} className="flex gap-2 items-center">
              <input
                type="checkbox"
                id={`team-${index}`}
                checked
                onChange={() => handleCheckboxChange(team.name)}
              />
              <label
                htmlFor={`team-${index}`}
                className="text-gray-800 dark:text-gray-100"
              >
                {team.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
