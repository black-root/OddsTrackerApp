import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { InplayFilter, LeagueSelected, OnlyLeagues } from './inplay-filter.model';
import { TrackOddsService } from '../track-odds.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InPlayGame } from './table-odds-inplay.model';


@Component({
  selector: 'app-league-combobox',
  templateUrl: './league-combobox.component.html',
  styleUrls: ['./league-combobox.component.css']
})
export class LeagueComboboxComponent implements OnInit, OnDestroy {

  private idLeagueLocal: number;
  inplayFilter: InplayFilter[];
  onlyLeagues: OnlyLeagues[] = [];
  leagueSelected: LeagueSelected[] = [];
  flagCall: number = 0; // variable que sirve para que no se haga doble request al clickear el select
  FI: number;
  intervalTimefrm: number;


  //table
  // variable is necesary to stop the suscription
  private unsubscribe: Subject<void> = new Subject();
  private subscription: any;
  count: number = 0;
  inPlayGameStat: InPlayGame[] = [];

  constructor(private dataService: DataService, private trackOddsService: TrackOddsService) { }

  hideComponent() {
    this.trackOddsService.hideLeagueComponent.emit(true);
  }

  ngOnInit() {
  }

  getMatchesInplay() {
    if (this.flagCall === 0) {
      this.dataService.getSoccerLeague()
        .subscribe(data => {
          this.inplayFilter = data['results'];
          this.UniqueLeagueFilter(this.inplayFilter);
          console.log(this.inplayFilter);
        });
      this.flagCall++;
    } else if (this.flagCall > 0) {
      this.flagCall++;
      if (this.flagCall > 1) {
        this.flagCall = 0;
      }
    }
  }
  // this method remove all the duplicate leagues from the original request
  UniqueLeagueFilter(inplayFilter: InplayFilter[]) {
    for (let i = 0; this.inplayFilter.length > i; i++) {
      let found = this.onlyLeagues.find(function (league) {
        return league.id === inplayFilter[i].league.id;
      });
      if (found == null) {
        this.onlyLeagues.push({ id: inplayFilter[i].league.id, name: inplayFilter[i].league.name });
        // console.log(this.onlyLeagues);
      }
    }
    this.onlyLeagues.sort(function (a, b) {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  cleanLeagueSelected() {
    this.leagueSelected = [];
    this.FI = 0;
  }
  // This method take the data from  inplayFilter just to get the names {home and away}
  getHomeAndAway(idLeagueLocal: number) {
    this.cleanLeagueSelected();
    let index;
    for (let i = 0; this.inplayFilter.length > i; i++) {
      if (this.inplayFilter[i].league.id === idLeagueLocal) {
        this.leagueSelected.push({
          id: this.inplayFilter[i].id,
          home: this.inplayFilter[i].home.name,
          away: this.inplayFilter[i].away.name
        });
        index = i;
      }
    }
  }

  getIdMatch(id: number) {
    this.FI = id;
    console.log(`El FI = ${id}`);
  }

  sendParameters() {
    if (this.FI != null && this.FI !== 0 && this.intervalTimefrm > 0) {
      this.trackOddsService.hideLeagueComponent.emit(true);
      this.trackOddsService.parameterInPlayTable.emit(
        { FI: this.FI, startTime: 0, intervalTime: this.intervalTimefrm });
    }
  }

  startRequest() {
    if (this.FI != null && this.FI !== 0 && this.intervalTimefrm > 0) {
      this.trackOddsService.hideLeagueComponent.emit(true);
      this.intervalTimefrm = this.intervalTimefrm * 1000;
      console.log(`FI: ${this.FI}, Interval Time: ${this.intervalTimefrm}`);
      console.log('[takeUntil] ngOnInit');
      this.subscription = this.dataService.rqDataTimer(
        this.FI, 0, this.intervalTimefrm)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(data => {
          this.trackOddsService.nameLeagueSelected.emit({
            league: data['results'][0][0]['CT'],
            teams: data['results'][0][0]['NA']
          });
          let local_Time = new Date().toLocaleTimeString('en-US', { hour12: false });
          this.inPlayGameStat.push({
            apiTime: this.convertStringToDate(data['results'][0][0]['TU'], 'time'),
            date: this.convertStringToDate(data['results'][0][0]['TU'], 'date'),
            localTime: local_Time,
            score: data['results'][0][0]['SS'],
            team1WO_Odds: this.stringToDecimal(data['results'][0][37]['OD']),
            tie_Odds: this.stringToDecimal(data['results'][0][38]['OD']),
            team2WO_Odds: this.stringToDecimal(data['results'][0][39]['OD'])
          });
          this.trackOddsService.inPlayGame.emit(this.inPlayGameStat);
          console.log(this.inPlayGameStat);
          this.count++;
          // this.storeArray[this.count] = data;
          if (this.count >= 15) {// a los 10 segundos se detiene
            this.stopSubscribe();
            this.count = 0;
            // se envia el array al servcio
          }
        }, (error) => console.error(error));
      return this.subscription;
    }
  }

  private stopSubscribe() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    console.log('[takeUntil] complete');
  }

  // dt: d= date, t= time
  convertStringToDate(dateTime: string, dt: string): any {
    let m: any = dateTime.match(/(\d\d\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)/);
    let result = new Date(m[1], m[2] - 1, m[3], m[4], m[5], m[6]);

    if (dt === 'date') {
      console.log(result.toLocaleDateString());
      return result.toLocaleDateString();
    } else if (dt === 'time') {
      console.log(result.toLocaleTimeString('en-US', { hour12: false }));
      return result.toLocaleTimeString('en-US', { hour12: false });
    } else {
      return null;
    }
  }

  stringToDecimal(cadena: any): number {
    cadena = cadena.split("/");
    let result = 1 + cadena[0] / cadena[1];
    let result2: any = result.toFixed(2);
    return result2;
  }

}

