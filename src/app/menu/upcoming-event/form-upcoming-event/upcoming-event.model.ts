import { League } from '../../track-odds/league-combobox/models/league.model';
import { Away } from '../../track-odds/league-combobox/models/away.model';
import { Home } from '../../track-odds/league-combobox/models/home.model';

export class UpcomingEvent {
    constructor() {}
    id: number;
    sport_id: number;
    time: any;
    time_status: number;
    league: League;
    home: Home;
    away: Away;
    ss: any;
    our_event_id: number;

}
