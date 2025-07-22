interface GetIdTeamData {
    id: string;
    name: string;
    url: string;
    img: string;
    country: string;
}

interface GetIdResponse {
    status: string;
    region: string;
    size: number;
    pagination: object;
    data: GetIdTeamData[];
}

interface GetTeamResponse {
    status: string;
    data: TeamData;
}

interface UpcomingEvent {
    name: string;
    logo: string;
};

interface Upcoming {
    match: {
        id: string;
        url: string;
    };
    event: UpcomingEvent;
    teams: [
        {
            name: string;
            tag: string;
            logo: string;
        },
        {
            name: string;
            tag: string;
            logo: string;
        }];
    utc: string;
}


interface TeamData {
    info: {
        name: string;
        tag: string;
        logo: string;
    };
    players: [{
        id: string;
        url: string;
        user: string;
        name: string;
        img: string;
        country: string;
    }];
    staff: [{
        id: string;
        url: string;
        user: string;
        name: string;
        tag: string;
        img: string;
        country: string;
    }];
    events: [{
        id: string;
        url: string;
        name: string;
        results: string[];
        year: string;
    }];
    results: [{
        match: {
            id: string;
            url: string;
        };
        event: {
            name: string;
            logo: string;
        };
        teams: [{
            name: string;
            tag: string;
            logo: string;
            points: string;
        }];
    }];

    upcoming: Upcoming[];
}