import { Injectable } from '@angular/core';
import { RequestService, StateService } from './services';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Station } from './types';

@Injectable()
export class AppSandbox {

  stationList = this.state.stationList;
  countyList = this.state.countyList;
  departureStation = this.state.departureStation;
  arrivalStation = this.state.arrivalStation;
  timeDetails = this.state.timeDetails;
  travelDetails = this.state.travelDetails;
  languageSetting = this.state.languageSetting;

  constructor(
    private request: RequestService,
    private state: StateService
  ) {}

  public loadInfoData(): Observable<any[]> {
    return this.request.getInfoList().pipe(
      tap(x => {
        this.state.updateStationList(x.stations);
        this.state.updateCountyList(x.counties);
      })
    );
  }

  public getARoute(travel: any): Observable<any> {
    const empty = {};
    const time = { ...empty , time: travel.time.time, date:  travel.time.date.real};
    this.state.updateTimeDetails(time);
    return this.request.getTheRoute(JSON.stringify(travel)).pipe(
      tap(x => this.state.updateTravelDetails(x))
    );
  }

  public updateDepartureStation(station: Station): void {
    this.state.updateDepartureStation(station);
  }

  public updateArrivalStation(station: Station): void {
    this.state.updateArrivalStation(station);
  }

  public updateLanguage(language: string): void {
    this.state.updateLanguage(language);
  }

}
