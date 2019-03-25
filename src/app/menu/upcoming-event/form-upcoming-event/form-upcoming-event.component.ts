import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { UpcomingEvent } from './upcoming-event.model';
import { OnlyLeagues } from '../../track-odds/league-combobox/inplay-filter.model';
import { TrackOddsService } from '../../track-odds/track-odds.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InPlayGame } from '../../track-odds/league-combobox/table-odds-inplay.model';
import { UpcomingEventService } from '../upcoming-event.service';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-form-upcoming-event',
  templateUrl: './form-upcoming-event.component.html',
  styleUrls: ['./form-upcoming-event.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FormUpcomingEventComponent implements OnInit {

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  threeFormGroup: FormGroup;
  fourFormGroup: FormGroup;

  leagueUpComingEvent: UpcomingEvent[];
  onlyLeagues: OnlyLeagues[] = [];
  league_idSelected: number = 0;
  requestNumber: number;
  intervalTimefrm: number;
  waitTime: any;
  time: any;
  //table
  FI: number;
  leagueChoosed: boolean = false;
  private unsubscribe: Subject<void> = new Subject();
  private subscription: any;
  inPlayGameStat: InPlayGame[] = [];
  count: number = 0;
  enableTable: boolean;
  maxRequest: number;
  stopTrackingFlag: boolean;
  upcomingTime: Date;
  leagueId: number;
  status: number;
  matches: UpcomingEvent[] = [];
  m: UpcomingEvent[];
  durationInSeconds = 5;
  startButtonFlag: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private trackOddsService: TrackOddsService,
    private upcomingService: UpcomingEventService,
    private snackBar: MatSnackBar) {

    this.trackOddsService.stopTrackingFlag.subscribe(
      (stopTrackingFlag: boolean) => {
        // this.count = count;
        this.stopTrackingFlag = stopTrackingFlag;
      }
    );
    this.upcomingService.stopButton.subscribe(
      (flag: boolean) => {
        // this.count = count;
        this.startButtonFlag = flag;
      }
    );

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
    this.startRequest();
  }
  startRequest() {
    this.dataService.getSoccerUpcomingEventLeague()
      .subscribe(data => {
        this.leagueUpComingEvent = data['results'];
        // tslint:disable-next-line:prefer-for-of
        /* for (let i = 0; i < this.leagueUpComingEvent.length; i++) {
           this.leagueUpComingEvent[i].time = this.unixToDate(this.leagueUpComingEvent[i].time);
         }*/
        this.UniqueLeagueFilter(this.leagueUpComingEvent);
        console.log(this.leagueUpComingEvent);
      });
  }

  timeToWait(eventTime: number, leagueId: number, league: string, home: string, away: string) {
    let localTime = new Date();
    // we need these data to validate the request second by second
    this.upcomingTime = new Date(eventTime * 1000);
    this.leagueId = leagueId;
    // Information to show in TabGroup "match progress"
    this.upcomingService.dateEvent.emit(this.upcomingTime);

    this.upcomingService.basicInfoTeams.emit({ leagueUp: league, homeUp: home, awayUp: away });

    let waitTSeconds = Math.abs(this.upcomingTime.getTime() - localTime.getTime());
    this.waitTime = waitTSeconds / 1000;
    console.log(`wait time in seconds ${this.waitTime}`);
    return waitTSeconds;
  }

  unixToDate(unixtime: number): Date {
    let a = new Date(unixtime * 1000);
    let timeResult = new Date();
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    //console.log(timeConverter(0));
    return a;
  }

  UniqueLeagueFilter(inplayFilter: UpcomingEvent[]) {
    for (let i = 0; inplayFilter.length > i; i++) {
      let found = this.onlyLeagues.find(function (league) {
        return league.id === inplayFilter[i].league.id;
      });
      if (found == null) {
        this.onlyLeagues.push({ id: inplayFilter[i].league.id, name: inplayFilter[i].league.name });
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
    console.log(this.onlyLeagues);
  }

  getLeagueIdSelected(id: number) {
    this.league_idSelected = id;
    console.log(this.league_idSelected);
    this.getUpcomingEventsByLeague();
  }

  getUpcomingEventsByLeague() {
    this.secondFormGroup.controls['secondCtrl'].reset();
    this.dataService.getSoccerUpcomingEvent(this.league_idSelected)
      .subscribe(data => {
        this.leagueUpComingEvent = data['results'];
        this.UniqueLeagueFilter(this.leagueUpComingEvent);
        console.log(this.leagueUpComingEvent);
      });
  }

  startInplayGame() {
    if (this.FI != null && this.FI !== 0 && this.intervalTimefrm > 0) {
      this.upcomingService.tabGroup.emit(true);
      let countCheckData: number = 0;
      let interval2 = this.intervalTimefrm;
      this.checkStatusMatch(this.FI, this.leagueId, this.upcomingTime);
      this.upcomingService.timeToWaitSeconds.emit(this.waitTime);
      this.upcomingService.startButtonFlag.emit(true);
      this.startButtonFlag = true;

      this.leagueChoosed = false;
      this.intervalTimefrm = this.intervalTimefrm * 1000;
      this.waitTime = this.waitTime * 1000;

      console.log(`FI: ${this.FI}, Interval Time: ${this.intervalTimefrm}`);
      console.log('[takeUntil] ngOnInit');
      this.subscription = this.dataService.rqDataTimer(
        this.FI, this.waitTime, this.intervalTimefrm)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(data => {
          if (this.status != 1) {
            if (interval2 >= 1 && interval2 <= 7) {
              if (countCheckData % 14 == 0) {
                this.checkStatusMatch(this.FI, this.leagueId, this.upcomingTime);
              }
            } else if (interval2 >= 7 && interval2 <= 14) {
              if (countCheckData % 2 == 0) {
                this.checkStatusMatch(this.FI, this.leagueId, this.upcomingTime);
              }
            } else if (interval2 >= 15) {
              this.checkStatusMatch(this.FI, this.leagueId, this.upcomingTime);
            }
            console.log(`status code != 1, status: ${status}`);
          } else if (this.status == 1) {
            // aproximate 100 minutes = 6000seconds
            let result = 6000 / interval2;
            if (result < countCheckData) {
              if (countCheckData % 10 == 0) {
                this.checkStatusMatch(this.FI, this.leagueId, this.upcomingTime);
                console.log('status code = 1');
              }
            }
          }
          // It does that the request limit from the API doesn't finish 3600reqs/h
          /* if (countCheckData % 2 == 0) {
             this.checkStatusMatch(this.FI, this.leagueId, this.upcomingTime);
             console.log(`Data checked, status: ${this.status}`);
           }*/
          countCheckData++;
          if (this.status == 1) {
            // TU: any, TT: any, TM: any, TS: any
            this.upcomingService.statusInfo.emit("In Play");
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
              team1WO_Odds: this.stringToDecimal(data['results'][0][37]['OD']),
              tie_Odds: this.stringToDecimal(data['results'][0][38]['OD']),
              team2WO_Odds: this.stringToDecimal(data['results'][0][39]['OD'])
            });
            this.upcomingService.score.emit(data['results'][0][0]['SS']);
            this.trackOddsService.inPlayingTime.emit(this.getTimeInPlay(
              data['results'][0][0]['TU'],
              data['results'][0][0]['TT'],
              data['results'][0][0]['TM'],
              data['results'][0][0]['TS']));
            this.trackOddsService.inPlayGame.emit(this.inPlayGameStat);
            this.upcomingService.stopButton.emit(false);
            this.upcomingService.exportButton.emit(false);
            console.log(this.inPlayGameStat);
            if (this.count === 1) {
              this.trackOddsService.hideLeagueComponent.emit(true);
            }
            this.trackOddsService.progressInplay.emit(this.progressBarPercent(this.count, this.maxRequest));

            // this.storeArray[this.count] = data;
            if (this.stopTrackingFlag === true || this.count >= this.maxRequest) {// a los 10 segundos se detiene
              this.trackOddsService.progressInplay.emit(this.progressBarPercent(this.count, this.maxRequest));
              this.stopSubscribe();
              this.count = 0;
              // se envia el array al servcio
            }
            this.count++;
          } else if (this.status == 3) {
            this.stopSubscribe();
            this.upcomingService.statusInfo.emit("Ended");
          } else if (this.status == 0) {
            this.upcomingService.statusInfo.emit("Not Started");
          } else if (this.status === 4) {
            this.stopSubscribe();
            this.upcomingService.statusInfo.emit("Postponed");
          } else if (this.status === 5) {
            this.stopSubscribe();
            this.upcomingService.statusInfo.emit("Cancelled");
          } else if (this.status === 7) {
            this.stopSubscribe();
            this.upcomingService.statusInfo.emit("Walkover");
          } else if (this.status === 8) {
            this.upcomingService.statusInfo.emit("Interrupted");
          } else if (this.status === 9) {
            this.stopSubscribe();
            this.upcomingService.statusInfo.emit("Retired");
          } else if (this.status === 99) {
            this.stopSubscribe();
            this.upcomingService.statusInfo.emit("Removed");
          }
        }, (error) => console.error(error));
      //return this.subscription;
    }
  }
  private progressBarPercent(count: number, maxRequest: number): number {
    let result: number = 0;
    result = (count / maxRequest) * 100;
    return Number(result.toFixed(2));
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
    // Imprimo el resultado
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

  private stopSubscribe() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.subscription.unsubscribe();
    console.log('[takeUntil] complete');
  }
  dateWithOutSimbol(date: Date): any {
    let onlyDate = date.toISOString().split('T')[0];
    console.log(onlyDate);
    let result = onlyDate.split("-");
    console.log(`Date with out simbols yyyymmdd: ${result}`);
    return `${result[0]}${result[1]}${result[2]}`;
  }
  // https://betsapi.com/docs/GLOSSARY.html time_status
  checkStatusMatch(FI: number, leagueId: number, day: any) {
    if ((FI != null && FI > 0) && (leagueId != null && leagueId > 0) && day != null) {
      let status: number;
      /*
      0	Not Started
      1	InPlay
      2	TO BE FIXED
      3	Ended
      4	Postponed
      5	Cancelled
      6	Walkover
      7	Interrupted
      8	Abandoned
      9	Retired
      99	Removed*/
      let onlydate = this.dateWithOutSimbol(day);
      console.log(onlydate);
      this.dataService.getSoccerUpcomingEventLeagueByDay(leagueId, onlydate)
        .subscribe(data => {
          this.matches = data['results'];
          //console.log(this.matches);
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.matches.length; i++) {
            if (this.matches[i].id == FI) {
              this.status = this.matches[i]['time_status'];
              this.upcomingService.status.emit(this.status);
              console.log(this.status);
              // this.upcomingService.matches.emit(this.matches);
            }
          }
        });
    }
  }
  openSnackBar() {
    this.snackBar.openFromComponent(StartPartyComponentUpcoming, {
      duration: this.durationInSeconds * 1000,
    });
  }
}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'start-bar-component-snack-upcoming',
  templateUrl: 'start-upcoming.html',
  styles: [`
    .example-start-party {
      color: hotpink;
    }
  `],
})
// tslint:disable-next-line:component-class-suffix
export class StartPartyComponentUpcoming { }
