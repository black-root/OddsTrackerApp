import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-upcoming-event',
  templateUrl: './upcoming-event.component.html',
  styleUrls: ['./upcoming-event.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingEventComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);

}
