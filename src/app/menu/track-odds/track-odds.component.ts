import { Component, OnInit } from '@angular/core';
import { TrackOddsService } from './track-odds.service';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportService } from 'src/app/services/excel-export.service';

@Component({
  selector: 'app-track-odds',
  templateUrl: './track-odds.component.html',
  styleUrls: ['./track-odds.component.css']
})
export class TrackOddsComponent implements OnInit {
  hideLeagueComponent: boolean;
  count: number = 0;
  league: string;
  teams: string;
  score: string;
  inPlayTime: any;
  tabGroupFlag: boolean = true;
  inPlayGameStat: any;
  stopTrackingFlag: boolean;
  clearFlag: boolean = true;
  onlyButonStopFlag: boolean = true;
  constructor(private trackOddsService: TrackOddsService, config: NgbProgressbarConfig, private excelService: ExcelExportService) {
    this.trackOddsService.hideLeagueComponent.subscribe(
      (flag: any) => {
        if (flag === null) {
          flag = false;
          console.log("flag is null")
        }
        this.hideLeagueComponent = flag;
      }
    );
    this.trackOddsService.progressInplay.subscribe(
      (count: any) => {
        // this.count = count;
        this.count = count;
        if (this.count === 100) {
          this.clearFlag = false;
        }
      }
    );
    this.trackOddsService.nameLeagueSelected.subscribe(
      (headerTable: any) => {
        this.league = headerTable['league'];
        this.teams = headerTable['teams'];
      }
    );
    this.trackOddsService.inPlayingTime.subscribe(
      (apiTime: any) => {
        // this.count = count;
        this.inPlayTime = apiTime;
      }
    );
    this.trackOddsService.score.subscribe(
      (score: any) => {
        // this.count = count;
        this.score = score;
      }
    );
    this.trackOddsService.tabGroup.subscribe(
      (tabGroupFlag: boolean) => {
        // this.count = count;
        this.tabGroupFlag = tabGroupFlag;
        if (tabGroupFlag === false && this.count < 1) {
          this.onlyButonStopFlag = false;
        }
      }
    );
    this.trackOddsService.inPlayGame.subscribe(
      (data: any) => {
        // this.count = count;
        this.inPlayGameStat = data;
      }
    );

    config.max = 100;
    config.striped = true;
    config.animated = true;
    config.type = 'success';
    config.height = '20px';
  }


  ngOnInit() {
  }

  hideComponent() {
    this.trackOddsService.hideLeagueComponent.emit(this.hideLeagueComponent);
  }
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.inPlayGameStat, 'sample');
  }
  stopTrackingEvent() {
    this.trackOddsService.stopTrackingFlag.emit(true);
    this.clearFlag = false;
    this.onlyButonStopFlag = true;
  }
  allClear() {
    this.tabGroupFlag = true;
    this.trackOddsService.tabGroup.emit(this.tabGroupFlag);
    this.trackOddsService.stopTrackingFlag.emit(false);
    this.inPlayGameStat = [];
    console.log(this.inPlayGameStat);
    this.trackOddsService.inPlayGame.emit([]);
    this.score = "";
    this.teams = "";
    this.inPlayTime = "";
    this.clearFlag = true;
    this.count = 0;
    this.league = "";
    this.onlyButonStopFlag = true;
    window.location.reload();
  }
}
