"use client";
import React, { useState } from "react";
import { getGames } from '../Util/vlr';

const fetchDates = async (query: string): Promise<void> => {
    try {
        const games: DateGameMap[] = await getGames(query);
        console.log(games);
        // Optionally update state or localStorage here
    } catch (error) {
        console.error("Error fetching games:", error);
    }
};

const GameList = () => {
    const [search, setSearch] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await fetchDates(search);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Search dates..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
        </div>
    );
};

export default GameList;
