import { Component, OnInit } from '@angular/core';
import { TrackOddsService } from './track-odds.service';

@Component({
  selector: 'app-track-odds',
  templateUrl: './track-odds.component.html',
  styleUrls: ['./track-odds.component.css'],
  providers: [TrackOddsService]
})
export class TrackOddsComponent implements OnInit {
  hideLeagueComponent: boolean;

  constructor(private trackOddsService: TrackOddsService) {
    this.trackOddsService.hideLeagueComponent.subscribe(
      (flag: any) => {
        if (flag === null) {
          flag = false;
          console.log("flag is null")
        }
        this.hideLeagueComponent = flag;
      }
    );
   }


  ngOnInit() {
  }

  hideComponent() {
    this.trackOddsService.hideLeagueComponent.emit(this.hideLeagueComponent);
  }

}
