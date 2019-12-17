import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Station } from '../class/station';
import { TimeDetails } from '../class/timeDetails';
import { County } from '../class/county';

@Injectable({
  providedIn: 'root'
})
export class StateStationService {

  private stationInfo$ = new ReplaySubject<any>(1);
  public stationInfo = this.stationInfo$.asObservable();

  private departureStation$ = new ReplaySubject<Station>();
  public departureStation = this.departureStation$.asObservable();

  private arrivalStation$ = new ReplaySubject<Station>();
  public arrivalStation = this.arrivalStation$.asObservable();

  private timeDetails$ = new ReplaySubject<TimeDetails>();
  public timeDetails = this.timeDetails$.asObservable();


  public updateStationInfoService(stationInfo: any): void {
    this.stationInfo$.next(stationInfo);
  }

  public updateDepartureStation(station: Station): void {
    this.departureStation$.next(station);
  }

  public updateArrivalStation(station: Station): void {
    this.arrivalStation$.next(station);
  }

  public updateTimeDetails(timeDetails: TimeDetails): void {
    this.timeDetails$.next(timeDetails);
  }
}
