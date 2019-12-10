import { Injectable } from '@angular/core';
import { Station } from "../class/station";

@Injectable({
  providedIn: 'root'
})
export class StationInfoService {

  private stationInfo: any;
  private _pureStationList: Station[];
  private _filteredStationList: Station[];

  constructor() { }

  public initService(stationInfo: any){
    this.stationInfo = stationInfo;
    this._pureStationList = stationInfo.stations;
  }

  getCounties(): any {
    return this.stationInfo.counties;
  }

  getFilterStation(): Station[] {
    return this._filteredStationList;
  }

  updateFilterStation(stationToFilter: Station): void {
    if (stationToFilter !== undefined){
      this._filteredStationList = this._pureStationList.filter(station => station.時刻表編號 === stationToFilter.時刻表編號);
    } else {
      this._filteredStationList = this._pureStationList;
    }
  }


}
