export async function getGames(searchTeam: string, region: string): Promise<ListElement[]> {

    const id: string = await getTeamId(searchTeam, region);

    const games: ListElement[] = await getGamesByTeamId(id);

    return games;
}

async function getGamesByTeamId(teamId: string): Promise<ListElement[]> {
    const games: ListElement[] = [];

    await fetch(`https://vlr.orlandomm.net/api/v1/teams/${teamId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data: GetTeamResponse) => {

            if (!data.data.upcoming || data.data.upcoming.length === 0) {
                return [];
            }

            data.data.upcoming.forEach((game: Upcoming) => {

                if (games.some(existingGame => existingGame.id === game.match.id)) {
                    return;
                }

                const date = new Date(game.utc);
                date.setHours(date.getHours() + 5);

                games.push({
                    id: game.match.id,
                    event: { name: game.event.name, logo: game.event.logo },
                    teams: [
                        { name: game.teams[0].name, tag: game.teams[0].tag, logo: game.teams[0].logo },
                        { name: game.teams[1].name, tag: game.teams[1].tag, logo: game.teams[1].logo }
                    ],
                    date: date.toUTCString(),
                    url: game.match.url,
                });
            });
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert(`Error fetching games for team: ${teamId}. Please check the team name and region.`);
        });

    return games;
}

async function getTeamId(searchTeam: string, region: string): Promise<string> {
    let id = "";
    await fetch('https://vlr.orlandomm.net/api/v1/teams?limit=all&region=' + region)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data: GetIdResponse) => {
            const teamName = data.data.find((team: GetIdTeamData) =>
                team.name.toLowerCase() === searchTeam.toLowerCase()
            );

            if (teamName) {
                id = teamName.id;
            } else {
                alert(`Team "${searchTeam}" not found in region "${region}". Please check the team name and region.`);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    return id;
}