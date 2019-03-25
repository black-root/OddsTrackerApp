import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {DataService} from './services/data.service';
import {ExcelExportService} from './services/excel-export.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Subject } from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './menu/home/home.component';
import { TrackOddsComponent } from './menu/track-odds/track-odds.component';
import { LeagueComboboxComponent } from './menu/track-odds/league-combobox/league-combobox.component';
import { TableOddsInPlayComponent } from './menu/track-odds/league-combobox/table-odds-in-play/table-odds-in-play.component';
import {MatInputModule} from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatRadioModule} from '@angular/material/radio';
import { UpcomingEventComponent } from './menu/upcoming-event/upcoming-event.component';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {MatStepperModule} from '@angular/material/stepper';
import { FormUpcomingEventComponent } from './menu/upcoming-event/form-upcoming-event/form-upcoming-event.component';
import {MatSelectModule} from '@angular/material/select';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { TrackOddsService } from './menu/track-odds/track-odds.service';
import { UpcomingEventService } from './menu/upcoming-event/upcoming-event.service';

import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { CountdownService } from './services/countdown.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DocumentationComponent } from './menu/documentation/documentation.component'
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    TrackOddsComponent,
    LeagueComboboxComponent,
    TableOddsInPlayComponent,
    UpcomingEventComponent,
    FormUpcomingEventComponent,
    DocumentationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatRadioModule,
    ScrollDispatchModule,
    MatStepperModule,
    MatSelectModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressBarModule,
    NgbModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule

  ],
  providers: [CountdownService, DataService, UpcomingEventService, Subject, ExcelExportService, TrackOddsService,
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}],
  bootstrap: [AppComponent]
})
export class AppModule { }
