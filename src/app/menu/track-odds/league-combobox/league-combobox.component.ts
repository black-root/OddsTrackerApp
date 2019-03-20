import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { InplayFilter, LeagueSelected, OnlyLeagues } from './inplay-filter.model';
import { TrackOddsService } from '../track-odds.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InPlayGame } from './table-odds-inplay.model';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-league-combobox',
  templateUrl: './league-combobox.component.html',
  styleUrls: ['./league-combobox.component.css']
})
export class LeagueComboboxComponent implements OnInit {

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  threeFormGroup: FormGroup;
  fourFormGroup: FormGroup;

  leagueChoosed: boolean = false;
  private idLeagueLocal: number;
  inplayFilter: InplayFilter[];
  onlyLeagues: OnlyLeagues[] = [];
  leagueSelected: LeagueSelected[] = [];
  flagCall: number = 0; // variable que sirve para que no se haga doble request al clickear el select
  FI: number;
  intervalTimefrm: number;
  maxRequest: number;
  positionTie: number;
  positionWin1: number;
  positionWin2: number;

  //table
  // variable is necesary to stop the suscription
  private unsubscribe: Subject<void> = new Subject();
  private subscription: any;
  count: number = 0;
  inPlayGameStat: InPlayGame[] = [];

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private trackOddsService: TrackOddsService) {
  }

  hideComponent() {
    this.trackOddsService.hideLeagueComponent.emit(true);
  }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.threeFormGroup = this.formBuilder.group({
      threeCtrl: ['', Validators.required]
    });
    this.fourFormGroup = this.formBuilder.group({
      fourCtrl: ['', Validators.required]
    });
    this.getMatchesInplay();
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
    this.leagueChoosed = true;
    this.cleanLeagueSelected();
    console.log(`Selecected league ID: ${idLeagueLocal}`);
    for (let i = 0; this.inplayFilter.length > i; i++) {
      if (this.inplayFilter[i].league.id === idLeagueLocal) {
        this.leagueSelected.push({
          id: this.inplayFilter[i].id,
          home: this.inplayFilter[i].home.name,
          away: this.inplayFilter[i].away.name,
          ss: this.inplayFilter[i].ss
        });
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
  searchOdds(data: any) {
    let paFlagCount = 0;
    let treeTimesFlag: boolean = false;
    for (let i = 0; data.length > i; i++) {
      if (treeTimesFlag === false) {
        if (data[i]['type'] === "PA") {
          paFlagCount++;
          if (paFlagCount === 3) {
            console.log("Se encontro los odds");
            treeTimesFlag = true;
            this.positionWin1 = i - 2;
            this.positionTie = i - 1;
            this.positionWin2 = i;
          }
        } else {
          paFlagCount = 0;
        }
      }
    }
    treeTimesFlag = false;
  }
  startRequest() {
    if (this.FI != null && this.FI !== 0 && this.intervalTimefrm > 0) {
      this.leagueChoosed = false;
      this.intervalTimefrm = this.intervalTimefrm * 1000;
      console.log(`FI: ${this.FI}, Interval Time: ${this.intervalTimefrm}`);
      console.log('[takeUntil] ngOnInit');
      this.subscription = this.dataService.rqDataTimer(
        this.FI, 0, this.intervalTimefrm)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(data => {

          if (this.count === 1) {
            this.trackOddsService.hideLeagueComponent.emit(true);
          } else if (this.count === 0) {
            this.searchOdds(data['results'][0]);
          }
          // TU: any, TT: any, TM: any, TS: any
          console.log(data['results']);
          this.trackOddsService.nameLeagueSelected.emit({
            league: data['results'][0][0]['CT'],
            teams: data['results'][0][0]['NA']
          });
          let local_Time = new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/London' });
          this.inPlayGameStat.push({
            localTime: local_Time,
            apiTime: this.getTimeInPlay(
              data['results'][0][0]['TU'],
              data['results'][0][0]['TT'],
              data['results'][0][0]['TM'],
              data['results'][0][0]['TS']),
            date: this.convertStringToDate(data['results'][0][0]['TU'], 'date'),
            score: data['results'][0][0]['SS'],
            team1WO_Odds: this.stringToDecimal(data['results'][0][this.positionWin1]['OD']),
            tie_Odds: this.stringToDecimal(data['results'][0][this.positionTie]['OD']),
            team2WO_Odds: this.stringToDecimal(data['results'][0][this.positionWin2]['OD'])
          });
          this.trackOddsService.inPlayGame.emit(this.inPlayGameStat);
          console.log(this.inPlayGameStat);

          this.count++;
          // this.storeArray[this.count] = data;
          if (this.count >= this.maxRequest) {// a los 10 segundos se detiene
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
      return result.toLocaleTimeString();
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

  getTimeInPlay(TU: any, TT: any, TM: any, TS: any) {
    let apiTime = this.convertStringToDate(TU, 'time'); // bet365
    let horaEngland = new Date();
    let hora1 = horaEngland.toLocaleTimeString('en-GB', { timeZone: 'Europe/London' }).split(":");
    let hora2 = apiTime.split(":");
    let t1 = new Date();
    let t2 = new Date();
    let time = 0;

    t1.setHours(Number(hora1[0]), Number(hora1[1]), Number(hora1[2]));
    t2.setHours(Number(hora2[0]), Number(hora2[1]), Number(hora2[2]));

    //Aquí hago la resta
    t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
    let segundos = t1.getHours() * 60 * 60 + t1.getMinutes() * 60 + t1.getSeconds();
    console.log(`TT es: ${TT}, TM: ${TM}, TS: ${TS}, segundos: ${segundos}`);
    if (TT === `1`) {
      time = segundos + (Number(TM) * 60) + Number(TS);
      console.log(`seconds ${time}`);
    } else {
      time = Number(TM) * 60 + Number(TS);
      console.log(`seconds ${time}`);
    }
    //Imprimo el resultado
    let date = new Date(null);
    let t3 = new Date();
    date.setSeconds(time); // specify value for SECONDS here
    let result = date.toISOString().substr(11, 8);
    console.log(result);
    let time2 = result.split(":");
    t3.setHours(Number(time2[0]), Number(time2[1]), Number(time2[2]));
    let minutes = t3.getMinutes() + t3.getHours() * 60;
    console.log(`El tiempo de Bet365 es ${minutes}:${t3.getSeconds()} `);
    return `${minutes}:${t3.getSeconds()}`;
  }

}

