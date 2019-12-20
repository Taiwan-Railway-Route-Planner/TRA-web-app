import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppSandbox } from '../../app.sandbox';
import { Station, County } from '../../types';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// @ts-ignore
import { default as _rollupMoment } from 'moment';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { Router } from '@angular/router';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ],
})
export class MainPageComponent implements OnInit, OnDestroy {

  date = new FormControl(moment());
  timeStamp = moment().format('LT');

  departureStation: Station;
  arrivalStation: Station;
  departureOrArrivalStation: boolean;
  showSearchDetails = false;
  prop$;
  stationInfoList$: Observable<Station[]>;
  stationInfoListFiltered$: Observable<Station[]>;
  countyInfoList$: Observable<County[]>;
  private callData: any;
  private languageLoading: any;

  constructor(
    private sb: AppSandbox,
    private translateService: TranslateService,
    // tslint:disable-next-line:variable-name
    private _adapter: DateAdapter<any>,
    private router: Router
  ) { }

  ngOnInit() {
    this.callData = this.sb.loadInfoData().subscribe();

    this.languageLoading = this.sb.languageSetting.subscribe((language) => this._adapter.setLocale(language));

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.sb.updateLanguage(event.lang);
    });

    this.prop$ = this.sb.languageSetting.pipe(
      map(language => {
        if (language !== 'zh-TW') {
          return 'eng站名';
        } else {
          return '站名';
        }
      })
    );

    this.stationInfoList$ = this.sb.stationList;
    this.countyInfoList$ = this.sb.countyList;
    this.stationInfoListFiltered$ = this.stationInfoList$;

    // tslint:disable-next-line:variable-name
    const _self = this;

    combineLatest(this.sb.departureStation, this.sb.arrivalStation)
    .subscribe( ([departure, arrival]) =>  {
      _self.showSearchDetails = false;
      _self.arrivalStation = arrival;
      _self.departureStation = departure;
    });
  }

  openStationList(departureOrArrivalStation: boolean): void {
    this.departureOrArrivalStation = departureOrArrivalStation;
    this.showSearchDetails = true;
    if (this.departureOrArrivalStation && this.arrivalStation) {
      this.filterStationOutOfFilteredStationList(this.sb.arrivalStation);
    } else if (!this.departureOrArrivalStation && this.departureStation) {
      this.filterStationOutOfFilteredStationList(this.sb.departureStation);
    }
  }

  stopSearching() {
    this.showSearchDetails = false;
  }

  discard() {
    this.arrivalStation = undefined;
    this.departureStation = undefined;
  }

  confirm() {
    const dateInfo = this.buildTheInformationForTheTrainRecords();
    const postObject = {
      arrival: { details: this.arrivalStation },
      departure: { details: this.departureStation },
      time: {date: {show: '', real: dateInfo.date}, time: dateInfo.time}
    };
    this.sb.getARoute(postObject).subscribe(
      x => {
        this.router.navigate(['/train', x.data.multi]);
      }
    );
  }

  buildTheInformationForTheTrainRecords() {
    const date = moment(this.date).locale('en').format('YYYYMMDD');
    const time = moment(this.timeStamp, 'h:mm').format('HH:mm');
    return {date, time};
  }

  saveDepartureStation(station: Station) {
    this.sb.updateDepartureStation(station);
    this.departureOrArrivalStation = !this.departureOrArrivalStation;
    this.filterStationOutOfFilteredStationList(this.sb.departureStation);
  }

  filterStationOutOfFilteredStationList(station: Observable<Station>): void {
    this.stationInfoListFiltered$ = combineLatest(this.stationInfoList$, station).pipe(
      map(([stationList, departureStation]) => {
        // @ts-ignore
        return stationList.filter(
          // tslint:disable-next-line:no-shadowed-variable
          station => station.站名 !== departureStation.站名
        );
      }),
    );
  }

  saveArrivalStation(station: Station) {
    this.sb.updateArrivalStation(station);
    this.departureOrArrivalStation = !this.departureOrArrivalStation;
  }

  ngOnDestroy(): void {
    this.callData.unsubscribe();
    this.languageLoading.unsubscribe();
  }
}
