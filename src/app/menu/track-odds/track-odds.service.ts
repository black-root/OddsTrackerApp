import {EventEmitter, Injectable} from '@angular/core';
import { InPlayGame } from './league-combobox/table-odds-inplay.model';

@Injectable()
export class TrackOddsService {
    constructor() {}

    hideLeagueComponent = new EventEmitter<boolean>();
    hideInplayGame = new EventEmitter<boolean>(false);
    parameterInPlayTable = new EventEmitter<{FI: any, startTime: number, intervalTime: number}>();
    inPlayGame = new EventEmitter<InPlayGame[]>();
    nameLeagueSelected = new EventEmitter <{league: string, teams: string}>();
}