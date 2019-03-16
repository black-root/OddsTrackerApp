import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { UpcomingEvent } from './upcoming-event.model';
import { OnlyLeagues } from '../../track-odds/league-combobox/inplay-filter.model';

@Component({
  selector: 'app-form-upcoming-event',
  templateUrl: './form-upcoming-event.component.html',
  styleUrls: ['./form-upcoming-event.component.css']
})
export class FormUpcomingEventComponent implements OnInit {

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  threeFormGroup: FormGroup;
  leagueUpComingEvent: UpcomingEvent[];
  onlyLeagues: OnlyLeagues[] = [];
  league_idSelected: number = 0;
  requestNumber: number;
  intervalTimefrm: number;
  waitTime: number;

  constructor(private formBuilder: FormBuilder, private dataService: DataService) { }

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
    this.startRequest();
  }
  startRequest() {
    this.dataService.getSoccerUpcomingEventLeague()
      .subscribe(data => {
        this.leagueUpComingEvent = data['results'];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.leagueUpComingEvent.length; i++) {
          this.leagueUpComingEvent[i].time = this.unixToDate(this.leagueUpComingEvent[i].time);
        }
        this.UniqueLeagueFilter(this.leagueUpComingEvent);
        console.log(this.leagueUpComingEvent);
      });
  }

  timeToWait(eventTime: Date) {
    let localTime = new Date();
    let waitTSeconds = Math.abs(eventTime.getTime() - localTime.getTime());
    waitTSeconds = waitTSeconds / 1000;
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
    this.dataService.getSoccerUpcomingEvent(this.league_idSelected)
      .subscribe(data => {
        this.leagueUpComingEvent = data['results'];
        this.UniqueLeagueFilter(this.leagueUpComingEvent);
        console.log(this.leagueUpComingEvent);
      });
  }
}
