import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForumComponent } from './forum/forum.component';
import { LogComponent } from './log/log.component';
import { GeneralComponent } from './general/general.component';
import { TestAPIComponent } from './test-api/test-api.component';
import { FavorisComponent } from './favoris/favoris.component';
import { CoinsSpeComponent } from './coins-spe/coins-spe.component';

const routes: Routes = [
  { path: '', redirectTo: 'Accueil', pathMatch: 'full' },
  { path: 'Accueil', component: AccueilComponent },
  { path : 'Dashboard' , component : DashboardComponent},
  { path : 'Forum' , component : ForumComponent},
  { path : 'Log' , component : LogComponent},
  // Route Information
  { path: 'Information', redirectTo: 'general', pathMatch: 'full' },
  { path : 'General' , component : GeneralComponent},
  { path : 'testAPI' , component : TestAPIComponent},
  { path : 'Favoris' , component : FavorisComponent},
  { path : 'CoinSpe' , component : CoinsSpeComponent},
  { path : 'CoinSpe?&uuid=' , component : CoinsSpeComponent}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
