import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { StationSearchComponent } from './main-page/station-search/station-search.component';
import { TrainOverviewComponent } from './train-overview/train-overview.component';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';
import { NgZorroModule } from './ngZorro';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateObjectPropsPipe } from './pipe/translate-object-props.pipe';
import { NgZorroAntdModule, NZ_I18N, en_GB } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    StationSearchComponent,
    TrainOverviewComponent,
    TranslateObjectPropsPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyNgZorroAntdModule,

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
    NgZorroAntdModule
  ],
  providers: [
    TranslateObjectPropsPipe,
    { provide: NZ_I18N, useValue: en_GB },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
