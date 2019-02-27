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
  private httpOptions = {
    headers: new HttpHeaders({
    'Access-Control-Allow-Origin': 'https://api.betsapi.com',
    'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {}


  getSoccerLeague() {
    return this.http.get<InplayFilter[]>(`${this.URL}/inplay_filter?sport_id=18&token=${this.TOKEN}`);
  }
// IdMatch = "FI inPlay" or "ID inPlayFilter"
  getSoccerInplayEvent(IdMatch: number) {
    return this.http.get(`${this.URL}/event?token=${this.TOKEN}&FI=${IdMatch}`);
  }

  rqDataTimer(urn: string, startTime: number = 0, intervalTime: number = 1000) {
    return timer(startTime, intervalTime)
      .pipe(
        switchMap(_ => this.http.get(`${this.URL}/${urn}token=${this.TOKEN}`)),
        catchError(error => of(`Bad request: ${error}`))
      );
  }
}