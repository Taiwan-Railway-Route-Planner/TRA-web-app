import { Component, OnInit } from '@angular/core';
import { RequestService } from '../service/request.service';
import { StateStationService } from "../service/stateStation.service";
import { Station } from '../class/station';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// @ts-ignore
import { default as _rollupMoment } from 'moment';
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { TimeDetails} from "../class/timeDetails";
import { map, startWith } from "rxjs/operators";
import { combineLatest } from "rxjs";

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
  showSearchDetails: boolean = false;
  prop$;
  stationInfo$;

  constructor(
    private requestService: RequestService,
    private state: StateStationService,
    private translateService: TranslateService,
    private _adapter: DateAdapter<any>
  ) { }

  ngOnInit() {
    this.requestService.getStation().subscribe(stationInfo => this.state.updateStationInfoService(stationInfo));

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this._adapter.setLocale(event.lang);
    });

    this.prop$ = this.translateService.onLangChange.pipe(
      startWith({lang: this.translateService.currentLang}),
      map(langChangeEvent => {
        if (langChangeEvent.lang !== 'zh-TW'){
          return 'eng站名'
        } else {
          return '站名'
        }
      }),
    );

    this.stationInfo$ = this.state.stationInfo;

    let _self = this;

    combineLatest(this.state.departureStation, this.state.arrivalStation)
    .subscribe(function ([departure, arrival]) {
      _self.showSearchDetails = false;
      _self.arrivalStation = arrival;
      _self.departureStation = departure;
    });

  }

  openStationList(departureOrArrivalStation: boolean): void{
    this.departureOrArrivalStation = departureOrArrivalStation;
    this.showSearchDetails = true;
  }

  stopSearching() {
    this.showSearchDetails = false;
  }

  discard() {
    this.arrivalStation = undefined;
    this.departureStation = undefined;
  }

  confirm(){

  }

  buildTheInformationForTheTrainRecords() : TimeDetails {
    let date = moment(this.date).locale('en').format('YYYYMMDD');
    let time = moment(this.timeStamp).format('HH:mm');
    return {date, time};
  }

  saveDepartureStation(station: Station) {
    this.state.updateDepartureStation(station);
    this.departureOrArrivalStation = !this.departureOrArrivalStation;
  }

  saveArrivalStation(station: Station) {
    this.state.updateArrivalStation(station);
    this.departureOrArrivalStation = !this.departureOrArrivalStation;
  }
}
