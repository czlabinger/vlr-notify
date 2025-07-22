"use client";
import React, { useEffect, useState } from "react";
import { getGames } from "../Util/vlr";
import Image from "next/image";

const scheduleGameNotifications = (games: ListElement[]) => {
    games.forEach((game) => {
        const gameStart = new Date(game.date);
        const now = new Date();
        const timeToStart = gameStart.getTime() - now.getTime();

        if (timeToStart > 0) {
            setTimeout(() => {
            new Notification("Game Starting", {
                body: `${game.event.name}: ${game.teams[0]} vs ${game.teams[1]} is starting now!`,
                icon: game.event.logo,
            });
        }, timeToStart);
        }
    });
};

const GameList = () => {
    const [search, setSearch] = useState("");
    const [games, setGames] = useState<ListElement[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("games");
        setGames(stored ? JSON.parse(stored) : []);

        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
        if (Notification.permission === "granted") {
            scheduleGameNotifications(games);
        }
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await fetchDates(search);
    };

    const fetchDates = async (query: string): Promise<void> => {
        try {
            const gamesNew: ListElement[] = await getGames(query);
            setGames((prevGames) => {
                const allGames = [...prevGames, ...gamesNew];
                const uniqueGamesMap = new Map();

                allGames.forEach((game) => uniqueGamesMap.set(game.id, game));
                const updatedGames = Array.from(uniqueGamesMap.values());
                localStorage.setItem("games", JSON.stringify(updatedGames));

                return updatedGames;
            });
        } catch (error) {
            console.error("Error fetching games:", error);
        }
    };

    const groupGamesByDate = (games: ListElement[]) => {
        const map: Record<string, ListElement[]> = {};
        games.forEach((game) => {
            const dateObj = new Date(game.date);
            if (isNaN(dateObj.getTime())) return;

            const options: Intl.DateTimeFormatOptions = {
                timeZone: "Europe/Berlin",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            };
            const dateKey = dateObj.toLocaleDateString("en-CA", options);
            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(game);
        });

        return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">

            <form onSubmit={handleSubmit} className="flex space-x-2 mb-8">
                <input
                    type="text"
                    placeholder="Search Tournament..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                Search
                </button>
            </form>

            <div className="space-y-6">
                {groupGamesByDate(games).map(([date, gamesForDate]) => (
                    <div key={date} className="bg-white border rounded shadow-sm p-4">
                        <h2 className="text-xl font-semibold text-gray-700 mb-3">{date}</h2>
                        <ul className="space-y-3">
                            {gamesForDate.map((game) => (
                                <li
                                    key={game.id}
                                    className="flex items-center space-x-3 bg-gray-50 p-3 rounded hover:bg-gray-100 transition"
                                >
                                <Image
                                    src={game.event.logo}
                                    alt={game.event.name + " Logo"}
                                    width={24}
                                    height={24}
                                    className="rounded"
                                />
                                <div className="text-sm text-gray-800">
                                    <span className="font-bold">{game.event.name}</span> —{" "}
                                    <span className="text-gray-600">
                                        {game.teams[0]} vs {game.teams[1]} at{" "}
                                        {new Date(game.date).toLocaleTimeString("en-GB", {
                                        timeZone: "Europe/Berlin",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                        })}
                                    </span>
                                </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameList;
