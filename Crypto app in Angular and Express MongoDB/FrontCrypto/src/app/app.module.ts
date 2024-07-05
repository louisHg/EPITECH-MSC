import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import { GraphiqueComponent } from './graphique/graphique.component';
import { RankingComponent } from './ranking/ranking.component';
import { LogComponent } from './log/log.component';
import { AccueilComponent } from './accueil/accueil.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForumComponent } from './forum/forum.component';
import { FavorisComponent } from './favoris/favoris.component';
import { GeneralComponent } from './general/general.component';
import { TestAPIComponent } from './test-api/test-api.component';
import { DataService } from './core/services/data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CoinsSpeComponent } from './coins-spe/coins-spe.component';
import { MatCardModule } from '@angular/material/card'
import { UserService } from '../services/Axios.service';

@NgModule({
  declarations: [
    AppComponent,
    GraphiqueComponent,
    RankingComponent,
    LogComponent,
    AccueilComponent,
    SidenavComponent,
    HeaderComponent,
    DashboardComponent,
    ForumComponent,
    FavorisComponent,
    GeneralComponent,
    TestAPIComponent,
    CoinsSpeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule
  ],
  providers: [DataService,UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
