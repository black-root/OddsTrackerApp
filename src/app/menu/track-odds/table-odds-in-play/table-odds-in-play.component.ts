import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { TrackOddsService } from '../track-odds.service';
import { InPlayGame } from '../league-combobox/table-odds-inplay.model';
import { ExcelExportService } from '../../../services/excel-export.service';
import { takeUntil } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-table-odds-in-play',
  templateUrl: './table-odds-in-play.component.html',
  styleUrls: ['./table-odds-in-play.component.css']
})
export class TableOddsInPlayComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  // variable is necesary to stop the suscription
  private unsubscribe: Subject<void> = new Subject();
  private subscription: any;
  data: any;
  count: number = 0;
  interval1Timefrm: number;
  parameterRequest: { FI: number, startTime: number, intervalTime: number };
  inPlayGameStat: InPlayGame[];
  flag: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  league: string;
  teams: string;


  constructor(private dataService: DataService, private trackOddsService: TrackOddsService, private excelService: ExcelExportService) {
    this.trackOddsService.hideLeagueComponent.subscribe(
      (flag: any) => {
        this.parameterRequest = flag;
      }
    );
    this.trackOddsService.inPlayGame.pipe(takeUntil(this.unsubscribe)).subscribe(
      (inPlayGame: any) => {
        this.inPlayGameStat = inPlayGame;
        this.count++;
        this.rerender();
        console.log(this.inPlayGameStat);
      });
    this.trackOddsService.nameLeagueSelected.subscribe(
      (headerTable: any) => {
        this.league = headerTable['league'];
        this.teams = headerTable['teams'];
      }
    );
  }

  ngOnInit() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5
    };
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    console.log('[takeUntil] complete');
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.inPlayGameStat, 'sample');
  }
}
