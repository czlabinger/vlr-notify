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
    gc: "Game Changers",
};

const scheduleGameNotifications = (games: ListElement[]) => {
    games.forEach((game) => {
        const gameStart = new Date(game.date).getTime();
        const now = Date.now();
        const timeToStart = gameStart - now;

        if (timeToStart > 0) {
            setTimeout(() => {
                if (Notification.permission === "granted") {
                    new Notification("Game Starting", {
                        body: `${game.event.name}: ${game.teams[0].name} vs ${game.teams[1].name} is starting now!`,
                        icon: game.event.logo,
                    });
                }
            }, timeToStart);
        }
    });
};

const GameList = () => {
    const [search, setSearch] = useState("");
    const [region, setRegion] = useState("all");
    const [games, setGames] = useState<ListElement[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("games");
        if (stored) setGames(JSON.parse(stored));

        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        scheduleGameNotifications(stored ? JSON.parse(stored) : []);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await fetchDates(search, region);
        setSearch("");
    };

    const handleRemove = (id: string) => {
        const updatedGames = games.filter((game) => game.id !== id);
        setGames(updatedGames);
        localStorage.setItem("games", JSON.stringify(updatedGames));
    };


    const fetchDates = async (query: string, region: string) => {
        setLoading(true);
        try {
            const gamesNew = await getGames(query, region);
            const allGames = [...games, ...gamesNew];
            const uniqueMap = new Map(allGames.map((g) => [g.id, g]));
            const updated = Array.from(uniqueMap.values());
            setGames(updated);
            localStorage.setItem("games", JSON.stringify(updated));
        } catch (err) {
            console.error("Error fetching games", err);
        } finally {
            setLoading(false);
        }
    };

    const groupGamesByDate = (games: ListElement[]) => {
        const grouped: Record<string, ListElement[]> = {};

        games.forEach((game) => {
            const dateObj = new Date(game.date);
            if (isNaN(dateObj.getTime())) return;

            const formatted = dateObj.toLocaleDateString("en-CA", {
                timeZone: "Europe/Berlin",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });

            if (!grouped[formatted]) grouped[formatted] = [];
            grouped[formatted].push(game);
        });

        return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className="flex flex-wrap gap-4 mb-6 items-center"
            >
                <input
                    type="text"
                    placeholder="Search for a team..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    disabled={loading}
                    className="flex-1 min-w-[200px] border border-gray-300 rounded px-3 py-2 text-sm focus:ring focus:ring-blue-200"
                />

                <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    disabled={loading}
                    className="border border-gray-300 bg-white text-sm text-gray-900 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                >
                {Object.entries(regions).map(([key, value]) => (
                    <option key={key} value={key}>
                    {value}
                    </option>
                ))}
                </select>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
                >
                {loading ? "Loading..." : "Search"}
                </button>
            </form>

            {loading && (
                <div className="flex items-center space-x-2 text-blue-600 mb-4">
                <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                    />
                </svg>
                <span>Fetching games...</span>
                </div>
            )}

            {/* Game List */}
            <div className="space-y-8">
                {groupGamesByDate(games).map(([date, dayGames]) => (
                <div key={date} className="rounded border border-gray-200 shadow bg-white p-5">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {new Date(date).toLocaleDateString("de-AT", {
                        timeZone: "Europe/Vienna",
                    })}
                    </h2>

                    <ul className="space-y-4">
                    {dayGames.map((game) => (
                        <li
                            key={game.id}
                            className="flex flex-col md:flex-row md:justify-between md:items-center gap-y-2 bg-gray-50 border border-gray-200 p-4 rounded hover:bg-gray-100 transition"
                            >
                            <div className="flex items-center space-x-4">
                                <Image
                                    src={game.event.logo}
                                    alt={game.event.name}
                                    width={32}
                                    height={32}
                                />
                                <div className="text-sm">
                                    <p className="font-bold text-gray-900">{game.event.name}</p>
                                        <div className="text-gray-700 text-xs flex flex-wrap items-center gap-x-3">
                                            <span className="flex items-center gap-1">
                                                <Image
                                                    src={game.teams[0].logo}
                                                    alt={game.teams[0].name}
                                                    width={16}
                                                    height={16}
                                                />
                                            {game.teams[0].name}
                                        </span>
                                        <span>vs</span>
                                        <span className="flex items-center gap-1">
                                            <Image
                                                src={game.teams[1].logo}
                                                alt={game.teams[1].name}
                                                width={16}
                                                height={16}
                                            />
                                            {game.teams[1].name}
                                        </span>
                                        <span className="text-gray-500">
                                            &bull;{" "}
                                            {new Date(game.date).toLocaleTimeString("de-AT", {
                                                timeZone: "Europe/Vienna",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-2 mt-2 md:mt-0">
                                <a
                                    href={game.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                >
                                    <Image
                                        src="https://vlr.gg/img/vlr/logo_tw.png"
                                        alt="VLR Logo"
                                        width={14}
                                        height={14}
                                    />
                                    View on VLR
                                </a>

                                <button
                                    onClick={() => handleRemove(game.id)}
                                    className="text-sm text-red-600 border border-red-500 px-3 py-1 rounded hover:bg-red-100 transition"
                                >
                                    Remove
                                </button>
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
