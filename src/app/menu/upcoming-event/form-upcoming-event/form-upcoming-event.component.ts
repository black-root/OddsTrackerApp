import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { UpcomingEvent } from './upcoming-event.model';
import { OnlyLeagues } from '../../track-odds/league-combobox/inplay-filter.model';

@Component({
  selector: 'app-form-upcoming-event',
  templateUrl: './form-upcoming-event.component.html',
  styleUrls: ['./form-upcoming-event.component.css']
})
export class FormUpcomingEventComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  leagueUpComingEvent: UpcomingEvent [];
  onlyLeagues: OnlyLeagues[] = [];

  constructor(private formBuilder: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.dataService.getSoccerUpcomingEventLeague()
        .subscribe(data => {
          this.leagueUpComingEvent = data['results'];
          this.UniqueLeagueFilter(this.leagueUpComingEvent);
          console.log(this.leagueUpComingEvent);
        });
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
}
