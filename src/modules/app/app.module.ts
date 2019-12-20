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
import { AppSandbox } from './app.sandbox';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, MainPageComponent, TrainOverviewComponent  } from './containers';
import { StationSearchComponent } from './components';

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
    AppSandbox
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
