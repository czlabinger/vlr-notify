export async function getGames(searchTeam: string): Promise<ListElement[]> {

    const id: string = await getTeamId(searchTeam);

    const games: ListElement[] = await getGamesByTeamId(id);

    return games;
}

async function getGamesByTeamId(teamId: string): Promise<ListElement[]> {
    const games: ListElement[] = [];
    await fetch('https://vlr.orlandomm.net/api/v1/teams/' + teamId)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data: GetTeamResponse) => {
            data.data.upcoming.map((game: Upcoming) => {
                games.push({ id: game.match.id, event: { name: game.event.name, logo: game.event.logo }, teams: [game.teams[0].name, game.teams[1].name], date: game.utc });
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

            if (teamName) {
                id = teamName.id;
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    return id;
}