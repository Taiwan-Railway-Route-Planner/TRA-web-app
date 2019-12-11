import { Injectable } from '@angular/core';
import { Station } from "../class/station";
import { BehaviorSubject } from "rxjs";
import {TimeDetails} from "../class/timeDetails";

@Injectable({
  providedIn: 'root'
})
export class StateStationService {

  private stationInfo$ = new BehaviorSubject<any>(1);
  public stationInfo = this.stationInfo$.asObservable();

  private destinationStation$ = new BehaviorSubject<Station>(null as any);
  public destinationStation = this.destinationStation$.asObservable();

  private arrivalStation$ = new BehaviorSubject<Station>(null as any);
  public arrivalStation = this.arrivalStation$.asObservable();

  private timeDetails$ = new BehaviorSubject<TimeDetails>(null as any);
  public timeDetails = this.timeDetails$.asObservable();

  public updateStationInfoService(stationInfo: any): void{
    this.stationInfo$.next(stationInfo);
  }

  public updateDestinationStation(station: Station): void {
    this.destinationStation$.next(station);
  }

  public updateArrivalStation(station: Station): void {
    this.arrivalStation$.next(station);
  }

  public updateTimeDetails(timeDetails: TimeDetails): void {
    this.timeDetails$.next(timeDetails);
  }



  // need to clean up when state manager is complete
  private stationInfoS: any;
  private _pureStationList: Station[];
  private _filteredStationList: Station[];

  public initService(stationInfo: any){
    this.stationInfoS.next(stationInfo);
    this._pureStationList = stationInfo.stations;
  }

  getFilterStation(): Station[] {
    return this._filteredStationList;
  }

  updateFilterStation(stationToFilter: Station): void {
    if (stationToFilter !== undefined){
      this._filteredStationList = this._pureStationList.filter(station => station.時刻表編號 !== stationToFilter.時刻表編號);
    } else {
      this._filteredStationList = this._pureStationList;
    }
  }


}
