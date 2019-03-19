import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrackOddsService } from '../track-odds/track-odds.service';


@Component({
  selector: 'app-upcoming-event',
  templateUrl: './upcoming-event.component.html',
  styleUrls: ['./upcoming-event.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingEventComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  hideLeagueComponent: boolean;

  constructor(private trackOddsService: TrackOddsService) {
    this.trackOddsService.hideLeagueComponent.subscribe(
      (flag: any) => {
        if (flag === null) {
          flag = false;
        }
        this.hideLeagueComponent = flag;
        console.log(`UpcomingEvent: hideLueagueComponent: ${this.hideLeagueComponent}`);
      }
    );
  }

  ngOnInit() {
  }

  hideComponent() {
    this.trackOddsService.hideLeagueComponent.emit(this.hideLeagueComponent);
  }
  /*progressBarset() {
    setInterval(function () {
      /// call your function here
    }, 1000);
    clearInterval();
  }*/
}
