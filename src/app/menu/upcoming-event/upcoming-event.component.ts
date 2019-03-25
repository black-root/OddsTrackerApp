import { ChangeDetectionStrategy, Component, OnInit, ElementRef, ViewChild, Renderer2, NgZone, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrackOddsService } from '../track-odds/track-odds.service';
import { UpcomingEventService } from './upcoming-event.service';
import { NgbTimeStruct, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportService } from 'src/app/services/excel-export.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-upcoming-event',
  templateUrl: './upcoming-event.component.html',
  styleUrls: ['./upcoming-event.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class UpcomingEventComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  hideLeagueComponent: boolean;
  headerTeams: { leagueUp: string, homeUp: string, awayUp: string } = { leagueUp: null, homeUp: null, awayUp: null };
  //score: string = null;
  matchTime: any = null;
  count: number = 0;
  timeToWait: number;
  matchProgressFlag: boolean = false;
  progressSpiner: number = 0;
  inPlayGameStat: any;
  buttonStopFlag: boolean = false;
  //inPlayTime: any;
  // timefeik: NgbTimeStruct = {hour: 13, minute: 30, second: 0};
  tempTime: number;
  timeToWaitFlag: boolean = false;
  private unsubscribe: Subject<void> = new Subject();
  private subscription: any;
  tabGroupFlag: boolean = false;
  stopButton: boolean = true;
  exportButton: boolean = true;
  timeToWaitFlagIf: boolean = true;
  intervalId: any;

  // prueba timer
  @ViewChild('timeToWait') timeToWaitV: ElementRef;
  @ViewChild('score') score: ElementRef;
  @ViewChild('inPlayTime') inPlayTime: ElementRef;
  @ViewChild('countV') countV: ElementRef;
  @ViewChild('statusMatch') statusMatch: ElementRef;


  constructor(
    private renderer: Renderer2,
    private trackOddsService: TrackOddsService,
    private upcomingEvent: UpcomingEventService,
    private config: NgbProgressbarConfig,
    private excelService: ExcelExportService) {

    this.upcomingEvent.tabGroup.subscribe(
      (tabGroupFlag: boolean) => {
        this.tabGroupFlag = tabGroupFlag;
      }
    );
    this.upcomingEvent.stopButton.subscribe(
      (flag: boolean) => {

        this.stopButton = flag;
      }
    );
    this.upcomingEvent.exportButton.subscribe(
      (flag: boolean) => {

        this.exportButton = flag;
      }
    );

    this.trackOddsService.inPlayingTime.subscribe(
      (apiTime: any) => {
        this.renderer.setProperty(this.inPlayTime.nativeElement, 'innerHTML', apiTime);
      }
    );
    this.upcomingEvent.statusInfo.subscribe(
      (status: any) => {
        console.log(`The status of the match is ${status}`);
        this.renderer.setProperty(this.statusMatch.nativeElement, 'innerHTML', status);
      }
    );
    this.trackOddsService.progressInplay.subscribe(
      (count: any) => {
        // this.count = count;
        this.count = count;
        this.renderer.setProperty(this.countV.nativeElement, 'innerHTML', `${count}%`);
        if (count === 100) {
          //  this.clearFlag = false;
        }
      }
    );

    this.trackOddsService.inPlayGame.subscribe(
      (data: any) => {
        // this.count = count;
        this.inPlayGameStat = data;
      }
    );
    this.trackOddsService.hideLeagueComponent.subscribe(
      (flag: any) => {
        if (flag === null) {
          flag = false;
        }
        this.hideLeagueComponent = flag;
        console.log(`UpcomingEvent: hideLueagueComponent: ${this.hideLeagueComponent}`);
      }
    );
    this.upcomingEvent.basicInfoTeams.subscribe(
      (headerTeams: { leagueUp: string, homeUp: string, awayUp: string }) => {
        this.headerTeams = headerTeams;
        console.log(this.headerTeams);
      });
    this.upcomingEvent.score.subscribe(
      (score: any) => {
        //this.score = score;
        this.renderer.setProperty(this.score.nativeElement, 'innerHTML', score);
      }
    );
    this.upcomingEvent.matchTime.subscribe(
      (matchTime: any) => {
        this.matchTime = matchTime;
        console.log(this.matchTime);
      }
    );
    this.timerProgess();

    config.max = 100;
    config.striped = true;
    config.animated = true;
    config.type = 'success';
    config.height = '20px';
  }
  ngOnInit() {
  }

  timerProgess() {
    this.upcomingEvent.timeToWaitSeconds.pipe(takeUntil(this.unsubscribe)).subscribe(
      (timeToWait: number) => {
        this.timeToWait = timeToWait;
        console.log(`UpcomingComponent: ${timeToWait}`);
        this.progressTimeToWait();
      }
    );
  }

  secondsToHms(d) {
    /*
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;*/

    if (d != null && d > 0) {
      d = Number(d);
      let h = Math.floor(d / 3600);
      let m = Math.floor(d % 3600 / 60);
      let s = Math.floor(d % 3600 % 60);
      let time = { hour: h, minute: m, second: s };
      return time;
    }
  }

  progressTimeToWait(): any {
    if (this.timeToWaitFlag === false) {
      this.timeToWaitFlag = true;

      this.intervalId = setInterval(() => {
        this.timeToWait = this.timeToWait - 1;
        //console.log(this.timeToWait);
        let time = this.secondsToHms(this.timeToWait);
        let result =
          ('0' + time.hour).substr(-2)
          + ':' + ('0' + time.minute).substr(-2)
          + ':' + ('0' + time.second).substr(-2);
        // let result = `${this.time.hour}:${this.time.minute}:${this.time.second}`;
        /*this.time.hour = this.secondsToHms(waitTime).hour;
        this.time.minute = this.secondsToHms(waitTime).minute;
        this.time.second = this.secondsToHms(waitTime).second;*/
        if (this.timeToWait < 0) {
          clearInterval(this.intervalId);
          this.timeToWaitFlagIf = false;
        }
        if (this.timeToWait >= 0) {
          this.renderer.setProperty(this.timeToWaitV.nativeElement, 'innerHTML', result);
        }
      }, 1000);
    }
  }

  hideComponent() {
    this.trackOddsService.hideLeagueComponent.emit(this.hideLeagueComponent);
  }
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.inPlayGameStat, 'sample');
  }
  stopTrackingEvent() {
    this.trackOddsService.stopTrackingFlag.emit(true);
    this.upcomingEvent.stopButton.emit(true);
    this.stopButton = true;
    this.exportButton = true;
    //this.clearFlag = false;
    //this.onlyButonStopFlag = true;
  }

}
