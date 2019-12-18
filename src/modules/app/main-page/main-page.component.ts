import { Component, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service';
import { StateStationService } from '../services/stateStation.service';
import { Station, County } from '../class';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// @ts-ignore
import { default as _rollupMoment } from 'moment';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs/operators';
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
export class MainPageComponent implements OnInit {

  date = new FormControl(moment());
  timeStamp = moment().format('LT');

  departureStation: Station;
  arrivalStation: Station;
  departureOrArrivalStation: boolean;
  showSearchDetails = false;
  prop$;
  stationInfoList$: Observable<Station>;
  stationInfoListFiltered$: Observable<Station>;
  countyInfoList$: Observable<County>;

  constructor(
    private requestService: RequestService,
    private state: StateStationService,
    private translateService: TranslateService,
    // tslint:disable-next-line:variable-name
    private _adapter: DateAdapter<any>,
    private router: Router
  ) { }

  ngOnInit() {
    this.requestService.getStation().subscribe(stationInfo => this.state.updateStationInfoService(stationInfo));

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this._adapter.setLocale(event.lang);
    });

    this.prop$ = this.translateService.onLangChange.pipe(
      startWith({lang: this.translateService.currentLang}),
      map(langChangeEvent => {
        if (langChangeEvent.lang !== 'zh-TW') {
          return 'eng站名';
        } else {
          return '站名';
        }
      }),
    );

    this.stationInfoList$ = this.state.stationInfo.pipe(
      map(stationInfoList => stationInfoList.stations)
    );
    this.countyInfoList$ = this.state.stationInfo.pipe(
      map(stationInfoList => stationInfoList.counties)
    );
    this.stationInfoListFiltered$ = this.stationInfoList$;

    // tslint:disable-next-line:variable-name
    const _self = this;

    combineLatest(this.state.departureStation, this.state.arrivalStation)
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
      this.filterStationOutOfFilteredStationList(this.state.arrivalStation);
    } else if (!this.departureOrArrivalStation && this.departureStation) {
      this.filterStationOutOfFilteredStationList(this.state.departureStation);
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
    this.requestService.getTheRoute(JSON.stringify(postObject)).subscribe(
      x => {
        this.state.updateTravelDetails(x.data.data);
        this.router.navigate(['/train', x.data.multi]);
      }
    );
  }

  buildTheInformationForTheTrainRecords() {
    const date = moment(this.date).locale('en').format('YYYYMMDD');
    const time = (this.timeStamp);
    this.state.updateTimeDetails({date, time});
    return {date, time};
  }

  saveDepartureStation(station: Station) {
    this.state.updateDepartureStation(station);
    this.departureOrArrivalStation = !this.departureOrArrivalStation;
    this.filterStationOutOfFilteredStationList(this.state.departureStation);
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
    this.state.updateArrivalStation(station);
    this.departureOrArrivalStation = !this.departureOrArrivalStation;
  }
}
