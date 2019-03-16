import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { timer, of } from 'rxjs';
import { InplayFilter } from '../menu/track-odds/league-combobox/inplay-filter.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  // uri = url + urn
  private URL: string = `/v1/bet365`;
  private TOKEN: string = `17954-QbN5GSRIBZtpec`;
 
  constructor(private http: HttpClient) {}

  getSoccerLeague() {
    // https://api.betsapi.com/v1/bet365/inplay_filter?sport_id=1&token=17954-QbN5GSRIBZtpec
    return this.http.get<InplayFilter[]>(`${this.URL}/inplay_filter?sport_id=1&token=${this.TOKEN}`);
  }
// IdMatch = "FI inPlay" or "ID inPlayFilter"
  getSoccerInplayEvent(IdMatch: number) {
    return this.http.get(`${this.URL}/event?token=${this.TOKEN}&FI=${IdMatch}`);
  }

  // "FI" is the id of the getSoccerLeague
  rqDataTimer(FI: any, startTime: number = 0, intervalTime: number = 1000) {
    console.log(`rqDataTimer(): FI: ${FI}, startTime: ${startTime}, Interval Time: ${intervalTime}`);
    return timer(startTime, intervalTime )
      .pipe(
        // https://api.betsapi.com/v1/bet365/event?FI=79239507&token=17954-QbN5GSRIBZtpec
        switchMap(_ => this.http.get(`${this.URL}/event?FI=${FI}&token=${this.TOKEN}`)),
        catchError(error => of(`Bad request: ${error}`))
      );
  }

  getSoccerUpcomingEventLeague() {
    return this.http.get<InplayFilter[]>(`${this.URL}/upcoming?sport_id=1&token=${this.TOKEN}`);
  }

  getSoccerUpcomingEvent(league_id: number) {
    return this.http.get<InplayFilter[]>(`${this.URL}/upcoming?sport_id=1&league_id=${league_id}&token=${this.TOKEN}`);
  }
}