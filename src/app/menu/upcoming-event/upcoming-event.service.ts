import { EventEmitter, Injectable } from '@angular/core';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class UpcomingEventService {
    constructor() { }

    basicInfoTeams = new EventEmitter<{leagueUp: string, homeUp: string, awayUp: string}>();

    score = new EventEmitter<string>();
    matchTime = new EventEmitter<any>();
    dateEvent = new EventEmitter<Date>();
    timeToWaitSeconds = new EventEmitter<number>();

    tabGroup = new EventEmitter<boolean>(true);
    stopTrackingFlag = new EventEmitter<boolean>(false);
    clearFlag = new EventEmitter<boolean>(false);
    statusInfo = new EventEmitter<string>();

}
