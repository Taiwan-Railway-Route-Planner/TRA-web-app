import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { TrainOverviewComponent } from './train-overview/train-overview.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'train/:type', component: TrainOverviewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }