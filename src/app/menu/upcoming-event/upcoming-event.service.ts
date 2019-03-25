import { EventEmitter, Injectable } from '@angular/core';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { UpcomingEvent } from './form-upcoming-event/upcoming-event.model';


@Injectable()
export class UpcomingEventService {
    constructor() { }

    basicInfoTeams = new EventEmitter<{ leagueUp: string, homeUp: string, awayUp: string }>();

    score = new EventEmitter<string>();
    matchTime = new EventEmitter<any>();
    dateEvent = new EventEmitter<Date>();
    timeToWaitSeconds = new EventEmitter<number>();

    tabGroup = new EventEmitter<boolean>(false);
    stopTrackingFlag = new EventEmitter<boolean>(false);
    clearFlag = new EventEmitter<boolean>(false);
    statusInfo = new EventEmitter<string>();
    status = new EventEmitter<number>();
    matches = new EventEmitter<any>();

    stopButton = new EventEmitter<boolean>(true);
    exportButton = new EventEmitter<boolean>(true);
    timeToWaitFlagIf = new EventEmitter<boolean>(true);
    startButtonFlag = new EventEmitter<boolean>(false);
}
