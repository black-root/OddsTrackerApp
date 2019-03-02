import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {DataService} from './services/data.service';
import {ExcelExportService} from './services/excel-export.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Subject } from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './menu/home/home.component';
import { TrackOddsComponent } from './menu/track-odds/track-odds.component';
import { LeagueComboboxComponent } from './menu/track-odds/league-combobox/league-combobox.component';
import { TableOddsInPlayComponent } from './menu/track-odds/table-odds-in-play/table-odds-in-play.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    TrackOddsComponent,
    LeagueComboboxComponent,
    TableOddsInPlayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DataTablesModule
  ],
  providers: [DataService, Subject, ExcelExportService],
  bootstrap: [AppComponent]
})
export class AppModule { }
