import { Component, OnInit } from '@angular/core';
import { RequestService } from '../service/request.service';
import { StationInfoService } from "../service/station-info.service";
import { TrainRouteDetailsService } from "../service/train-route-details.service";
import { Station } from '../class/station';

import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// @ts-ignore
import { default as _rollupMoment } from 'moment';
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
// import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { TimeDetails} from "../class/timeDetails";
import {map} from "rxjs/operators";

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

  stationInfo: any;
  stationList: Station[];
  departureStation: Station;
  arrivalStation: Station;
  departureOrArrivalStation: boolean;
  showSearchDetails: boolean = false;

  prop$ = this.translateService.onLangChange.pipe(
    map(langChangeEvent => {
      if (langChangeEvent.lang !== 'zh-TW'){
       return 'eng站名'
      } else {
        return '站名'
      }
    })
  )

  constructor(
    private requestService: RequestService,
    private stationInfoService: StationInfoService,
    private translateService: TranslateService,
    private trainRouteDetails: TrainRouteDetailsService,
    private _adapter: DateAdapter<any>
  ) { }

  ngOnInit() {
    this.getStationList();
    this._adapter.setLocale(this.translateService.currentLang);

    // NgxMaterialTimepickerModule.setLocale(this.translateService.currentLang);

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this._adapter.setLocale(event.lang);
      // NgxMaterialTimepickerModule.setLocale(event.lang);
    })
  }

  openStationList(departureOrArrivalStation: boolean): void{
    this.stationInfoService.updateFilterStation(departureOrArrivalStation? this.arrivalStation : this.departureStation);
    this.departureOrArrivalStation = departureOrArrivalStation;
    this.showSearchDetails = true;
  }

  getStationList() : void {
    let _self = this;
    this.requestService.getStation().subscribe(function (stationListData) {
      _self.stationInfo = stationListData;
      _self.stationList = stationListData.stations;
      _self.stationInfoService.initService(stationListData);

      // debug
      // _self.departureOrArrivalStation = true;
      // _self.stationInfoService.updateFilterStation(_self.departureOrArrivalStation? _self.arrivalStation : _self.departureStation);
      // _self.showSearchDetails = true;
    });
  }

  updateStation($event: Station){
    if (this.departureOrArrivalStation){
      this.departureStation = $event;
      if (this.arrivalStation !== undefined){
        this.showSearchDetails = false;
      }
    } else {
      this.arrivalStation = $event;
      this.showSearchDetails = false;
    }
    this.stationInfoService.updateFilterStation(!this.departureOrArrivalStation? this.arrivalStation : this.departureStation);
    this.departureOrArrivalStation = !this.departureOrArrivalStation;
  }

  stopSearching() {
    this.showSearchDetails = false;
  }

  discard() {
    this.arrivalStation = undefined;
    this.departureStation = undefined;
  }

  confirm(){
    this.trainRouteDetails.init(this.departureStation, this.arrivalStation, this.buildTheInformationForTheTrainRecords());

  }

  buildTheInformationForTheTrainRecords() : TimeDetails {
    let date = moment(this.date).locale('en').format('YYYYMMDD');
    let time = moment(this.timeStamp).format('HH:mm');
    return {date, time};
  }

}
