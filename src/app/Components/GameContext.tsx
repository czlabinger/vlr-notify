import React, { createContext, useState, ReactNode } from "react";

interface GameContextProps {
    games: ListElement[];
    setGames: (value: ListElement[]) => void;
    autoRemove: boolean;
    setAutoRemove: (value: boolean) => void;
}

export const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [games, setGames] = useState<ListElement[]>([]);
    const [autoRemove, setAutoRemove] = useState<boolean>(false);

    return (
        <GameContext.Provider
        value={{ games, setGames, autoRemove, setAutoRemove }}
        >
        {children}
        </GameContext.Provider>
    );
};
