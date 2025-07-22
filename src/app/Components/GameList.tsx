"use client";
import React, { useEffect, useState } from "react";
import { getGames } from "../Util/vlr";
import Image from "next/image";

const regions = {
    all: "All Regions (only top 10)",
    na: "North America",
    eu: "Europe",
    br: "Brazil",
    ap: "Asia-Pacific",
    kr: "Korea",
    ch: "China",
    jp: "Japan",
    lan: "Latin America North",
    las: "Latin America South",
    oce: "Oceania",
    mn: "Middle East and North Africa",
    gc: "Game Changers"
};

const scheduleGameNotifications = (games: ListElement[]) => {
    games.forEach((game) => {
        const gameStartUTC = new Date(game.date).getTime();
        const nowUTC = new Date().getTime();

        const timeToStart = gameStartUTC - nowUTC;

        if (timeToStart > 0) {
            setTimeout(() => {
                new Notification("Game Starting", {
                    body: `${game.event.name}: ${game.teams[0].name} vs ${game.teams[1].name} is starting now!`,
                    icon: game.event.logo,
                });
            }, timeToStart);
        }
    });
};

const GameList = () => {
    const [search, setSearch] = useState("");
    const [region, setRegion] = useState("all");
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
        await fetchDates(search, region);
        setSearch("");
    };

    const fetchDates = async (query: string, region: string): Promise<void> => {
        try {
            const gamesNew: ListElement[] = await getGames(query, region);
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
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-8 items-center">
                <input
                    type="text"
                    placeholder="Search for a Team..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                    id="searchInput"
                    autoComplete="off"
                />

                <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="border border-gray-300 bg-white text-gray-900 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                    {Object.entries(regions).map(([key, value]) => (
                    <option key={key} value={key}>
                        {value}
                    </option>
                    ))}
                </select>

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
                        <h2 className="text-xl font-semibold text-gray-700 mb-3">

                            {new Date(date).toLocaleDateString("de-AT", {
                                timeZone: "Europe/Vienna"
                            })}
                        
                        </h2>
                        <ul className="space-y-3">
                            {gamesForDate.map((game) => (
                                <li
                                    key={game.id}
                                    className="flex justify-between items-center bg-gray-50 p-3 rounded hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center space-x-3">
                                    {/* Event Logo */}
                                    <Image
                                        src={game.event.logo}
                                        alt={game.event.name + " Logo"}
                                        width={24}
                                        height={24}
                                        className="rounded"
                                    />

                                    {/* Teams & Time Info */}
                                    <div className="text-sm text-gray-800">
                                        <span className="font-bold">{game.event.name}</span> {" "}
                                        <span className="text-gray-600 flex items-center space-x-2">
                                            <div className="flex items-center space-x-1">
                                                <Image
                                                    src={game.teams[0].logo}
                                                    alt={game.teams[0].name + " Logo"}
                                                    width={16}
                                                    height={16}
                                                    className="rounded-full"
                                                />
                                                <span>{game.teams[0].name}</span>
                                            </div>
                                            <span>vs</span>
                                            <div className="flex items-center space-x-1">
                                                <Image
                                                    src={game.teams[1].logo}
                                                    alt={game.teams[1].name + " Logo"}
                                                    width={16}
                                                    height={16}
                                                    className="rounded-full"
                                                />
                                                <span>{game.teams[1].name}</span>
                                            </div>
                                            <span>
                                                at{" "}
                                                {new Date(game.date).toLocaleTimeString("de-AT", {
                                                    timeZone: "Europe/Vienna",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                })}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                <a
                                    href={game.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-4 inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                                >
                                    <Image
                                        src={"https://vlr.gg/img/vlr/logo_tw.png"}
                                        alt={"VLR Logo"}
                                        width={16}
                                        height={16}
                                        className="rounded-full justify items-center mr-1 inline-block align-middle"
                                    />
                                    View on VLR
                                </a>
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
