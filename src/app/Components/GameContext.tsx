import React, { createContext, useState, ReactNode } from "react";

interface GameContextProps {
    games: ListElement[];
    setGames: (value: ListElement[]) => void;
}

export const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [games, setGames] = useState<ListElement[]>([]);

    return (
        <GameContext.Provider
        value={{ games, setGames }}
        >
        {children}
        </GameContext.Provider>
    );
};
