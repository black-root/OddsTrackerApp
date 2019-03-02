import {Subject} from 'rxjs';
import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class TrackOddsService {
    constructor() {}

    hideLeagueComponent = new EventEmitter<boolean>(false);
    parameterInPlayTable = new EventEmitter<{FI: any, startTime: number, intervalTime: number}>();
}