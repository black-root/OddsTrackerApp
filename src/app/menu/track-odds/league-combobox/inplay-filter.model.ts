import { League } from './models/league.model';
import { Home } from './models/home.model';
import { Away } from './models/away.model';

export class InplayFilter {
    constructor() {}
    id: number;
    sport_id: number;
    time: number;
    time_status: boolean;
    league: League;
    home: Home;
    away: Away;
    ss: string;
    our_event_id: number;
}
export class OnlyLeagues {
    constructor() {}
    id: number;
    name: string;
}
export class LeagueSelected {
    constructor() {}
    id: number;
    home: string;
    away: string;
}
