import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
// @ts-ignore
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MaterialModule } from './materialDesign';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// @ts-ignore
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { TranslateObjectPropsPipe } from './pipe/translate-object-props.pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { StationSearchComponent } from './main-page/station-search/station-search.component';
import { TrainOverviewComponent } from './train-overview/train-overview.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule,

    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    NgxMaterialTimepickerModule
  ],
  declarations: [
    AppComponent,
    MainPageComponent,
    StationSearchComponent,
    TrainOverviewComponent,
    TranslateObjectPropsPipe,
  ],
  providers: [
    TranslateObjectPropsPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
