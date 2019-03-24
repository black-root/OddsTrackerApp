import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as Moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class CountdownService {

    private initTime = null;

    constructor() {
    }

    //returns an observable that throws only "numberOfSeconds" values,
    //one per second
    //with a string with the remaining seconds each
    public startCountdown(numberOfSeconds) {
        this.initTime = Moment(Date.now() + (numberOfSeconds + 1) * 1000);
        return interval(1000).pipe(
            take(numberOfSeconds),
            map(() => {
                let diff = this.initTime.diff(Moment());
                let countdown = Moment.utc(diff).format('hh:mm:ss');
                console.log("current countdown: ", countdown);
                return countdown;
            })
        );
    }
}
