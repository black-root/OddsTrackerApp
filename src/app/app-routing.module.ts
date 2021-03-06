import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './menu/home/home.component';
import { TrackOddsComponent } from './menu/track-odds/track-odds.component';
import { UpcomingEventComponent } from './menu/upcoming-event/upcoming-event.component';
import { DocumentationComponent } from './menu/documentation/documentation.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'home', component: HomeComponent},
  { path: 'home/track-odds/inplay', component: TrackOddsComponent},
  { path: 'home/track-odds/upcoming-event', component: UpcomingEventComponent},
  { path: 'home/documentation', component: DocumentationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
