import { Injectable } from '@angular/core';
import { Station } from "../class/station";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StateStationService {

  private stationInfoSource = new BehaviorSubject<any>(1);
  public stationInfo = this.stationInfoSource.asObservable();

  private destinationStationSource = new BehaviorSubject<Station>(null as any);
  public destinationStation = this.destinationStationSource.asObservable();

  private arrivalStationSource = new BehaviorSubject<Station>(null as any);
  public arrivalStation = this.arrivalStationSource.asObservable();

  public updateStationInfoService(stationInfo: any): void{
    this.stationInfoSource.next(stationInfo);
  }

  public updateDestinationStation(station: Station): void {
    this.destinationStationSource.next(station);
  }

  public updateArrivalStation(station: Station): void {
    this.arrivalStationSource.next(station);
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
