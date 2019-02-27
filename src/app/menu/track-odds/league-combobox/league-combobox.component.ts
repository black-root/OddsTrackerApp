import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { InplayFilter, LeagueSelected } from './inplay-filter.model';


@Component({
  selector: 'app-league-combobox',
  templateUrl: './league-combobox.component.html',
  styleUrls: ['./league-combobox.component.css']
})
export class LeagueComboboxComponent implements OnInit {

  private idLeagueLocal: number;
  inplayFilter: InplayFilter[];
  leagueSelected: LeagueSelected[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    return this.dataService.getSoccerLeague()
      .subscribe(data => {
        this.inplayFilter = data['results'];
        console.log(this.inplayFilter);
      });
  }

  getIdByName(idLeagueLocal: number) {
    console.log(idLeagueLocal);
    this.idLeagueLocal = idLeagueLocal;
  }

  cleanLeagueSelected() {
    this.leagueSelected = [];
  }

  getMatchesInplay(idLeagueLocal: number) {
    this.cleanLeagueSelected();
    for ( let i = 0; this.inplayFilter.length > i; i++ ) {
      if (this.inplayFilter[i].league.id === idLeagueLocal) {
        this.leagueSelected.push({
          id: this.inplayFilter[i].id,
          home: this.inplayFilter[i].home.name,
          away: this.inplayFilter[i].away.name
        });
      }
    }
    console.log(this.leagueSelected);
  }
}
