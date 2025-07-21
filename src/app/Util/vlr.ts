export async function getGames(searchTeam: string): Promise<DateGameMap[]> {

    const id: string = await getTeamId(searchTeam);

    const games: DateGameMap[] = await getGamesByTeamId(id);

    return games;
}

async function getGamesByTeamId(teamId: string): Promise<DateGameMap[]> {
    const games: DateGameMap[] = [];
    await fetch('https://vlr.orlandomm.net/api/v1/teams/' + teamId)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data: GetTeamResponse) => {
            data.data.upcoming.map((game: Upcoming) => {
                const event: string = game.event.name;
                games.push({ event, teams: [game.teams[0].name, game.teams[1].name], date: game.utc });
            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    return games;
}

async function getTeamId(searchTeam: string): Promise<string> {
    let id = "";
    await fetch('https://vlr.orlandomm.net/api/v1/teams?limit=all')
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
            console.log(teamName);

            if (teamName) {
                id = teamName.id;
                console.log(teamName.id);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    console.log("Team ID: " + id);
    return id;
}