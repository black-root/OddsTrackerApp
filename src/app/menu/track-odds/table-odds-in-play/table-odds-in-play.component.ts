import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { TrackOddsService } from '../track-odds.service';
import { InPlayGame } from './table-odds-inplay.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-table-odds-in-play',
  templateUrl: './table-odds-in-play.component.html',
  styleUrls: ['./table-odds-in-play.component.css']
})
export class TableOddsInPlayComponent implements OnInit, OnDestroy {

  // variable is necesary to stop the suscription
  private unsubscribe: Subject<void> = new Subject();
  private subscription: any;
  data: any;
  count: number = 0;
  intervalTimefrm: number;
  parameterRequest: { FI: number, startTime: number, intervalTime: number };
  inPlayGameStat: InPlayGame[];
  flag: boolean = false;

  constructor(private dataService: DataService, private parametersRequest: TrackOddsService) {
    this.parametersRequest.parameterInPlayTable.subscribe(
      (paramaters: any) => {
        this.parameterRequest = paramaters;
        console.log(this.parameterRequest);
      }
    );
    this.parametersRequest.hideLeagueComponent.subscribe(
      (flag: any) => {
        this.parameterRequest = flag;
      }
    );
  }

  /*let m  = '20190301170222'.match(/(\d\d\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)/);
var todayDate = new Date(m[1], m[2] - 1, m[3], m[4], m[5], m[6]);

console.log(todayDate.toLocaleDateString());
console.log(todayDate.toLocaleTimeString('en-US', { hour12: false }));

var ts = new Date();
console.log(ts.getMinutes() +"  "+  ts.getSeconds())*/

  ngOnInit() {
  }
  private startRequest() {
   // console.log('se llamo startrequest');
    if (this.flag === true) {
      console.log('se inicio startrequest');
      this.parameterRequest.intervalTime = this.parameterRequest.intervalTime * 1000;

      console.log('[takeUntil] ngOnInit');
      this.subscription = this.dataService.rqDataTimer(
        this.parameterRequest.FI, 0, this.parameterRequest.intervalTime)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(data => {
          this.data = data['results'];
          console.log(data['results'][37]['type']);
          console.log(data['results'][37]['NA']);
          console.log(data['results'][37]['OD']);
          // se va sumando un contador cada iteracion(por segundo)
          /*
                    this.inPlayGameStat.push({
                      date: data['results'],
                      apiTime: data['results'],
                      localTime: data['results'],
                      score: data['results'],
                      team1WO_Odds: data['results'],
                      tie_Odds: data['results'],
                      team2WO_Odds: data['results'],
                    });
                    console.log(this.inPlayGameStat);
          */
          this.count++;
          // this.storeArray[this.count] = data;
          if (this.count >= 2) {// a los 10 segundos se detiene
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
}
