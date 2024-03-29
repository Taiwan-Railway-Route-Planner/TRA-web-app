import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPageComponent, TrainOverviewComponent } from './containers';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'train/:type', component: TrainOverviewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
