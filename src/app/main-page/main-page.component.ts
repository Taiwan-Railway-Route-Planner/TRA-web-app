import { Component, OnInit } from '@angular/core';
import { RequestService } from '../service/request.service';
import { StateStationService } from "../service/stateStation.service";
import { TrainRouteDetailsService } from "../service/train-route-details.service";
import { Station } from '../class/station';

import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// @ts-ignore
import { default as _rollupMoment } from 'moment';
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { TimeDetails} from "../class/timeDetails";
import {map, shareReplay, startWith, tap} from "rxjs/operators";
import {combineLatest, concat} from "rxjs";

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

  // data$ = new Subject();
  // com$ = combineLatest(this.prop$, this.data$).pipe(
  //   map(([prop, data]) =>  {
  //
  //     return {data,prop};
  //   })
  // )


  // languageProp$ = this.translateService.onLangChange.pipe(
  //   map(langChangeEvent => {
  //     if (langChangeEvent.lang !== 'zh-TW'){
  //       return 'eng站名'
  //     } else {
  //       return '站名'
  //     }
  //   }),
  //   shareReplay(1),
  //   tap(x => console.log({x}))
  // );

  constructor(
    private requestService: RequestService,
    private state: StateStationService,
    private translateService: TranslateService,
    private trainRouteDetails: TrainRouteDetailsService,
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

    let _self = this;

    combineLatest(this.state.departureStation, this.state.arrivalStation)
    .subscribe(function ([departure, arrival]) {
      _self.showSearchDetails = false;
      _self.arrivalStation = arrival;
      _self.departureStation = departure;
    });

  }

  openStationList(departureOrArrivalStation: boolean): void{
    // this.state.updateFilterStation(departureOrArrivalStation? this.arrivalStation : this.departureStation);
    this.departureOrArrivalStation = departureOrArrivalStation;
    this.showSearchDetails = true;
  }

  // getStationList() : void {
  //   let _self = this;
  //   this.requestService.getStation().subscribe(function (stationListData) {
  //     _self.stationInfo = stationListData;
  //     _self.stationList = stationListData.stations;
  //     _self.state.initService(stationListData);
  //
  //     // debug
  //     // _self.departureOrArrivalStation = true;
  //     // _self.state.updateFilterStation(_self.departureOrArrivalStation? _self.arrivalStation : _self.departureStation);
  //     // _self.showSearchDetails = true;
  //   });
  // }

  // updateStation($event: Station){
  //   // if (this.departureOrArrivalStation){
  //   //   this.state.updateDestinationStation($event);
  //   //   if (this.arrivalStation !== undefined){
  //   //     this.showSearchDetails = false;
  //   //   }
  //   // } else {
  //   //   this.state.updateArrivalStation($event);
  //   //   this.showSearchDetails = false;
  //   // }
  //   // this.state.updateFilterStation(!this.departureOrArrivalStation? this.arrivalStation : this.departureStation);
  //   // this.departureOrArrivalStation = !this.departureOrArrivalStation;
  // }

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
