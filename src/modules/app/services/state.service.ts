import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { County, Station, TimeDetails } from '../types';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private stationList$ = new ReplaySubject<Station[]>(1);
  public stationList = this.stationList$.asObservable();

  private countyList$ = new ReplaySubject<County[]>(1);
  public countyList = this.countyList$.asObservable();

  private departureStation$ = new ReplaySubject<Station>();
  public departureStation = this.departureStation$.asObservable();

  private arrivalStation$ = new ReplaySubject<Station>();
  public arrivalStation = this.arrivalStation$.asObservable();

  private timeDetails$ = new ReplaySubject<TimeDetails>();
  public timeDetails = this.timeDetails$.asObservable();

  private travelDetails$ = new ReplaySubject<any>();
  public travelDetails = this.travelDetails$.asObservable();

  public languageSetting$ = new BehaviorSubject<string>('en-gb');
  public languageSetting = this.languageSetting$.asObservable();

  public updateStationList(stationList: Station[]): void {
    this.stationList$.next(stationList);
  }

  public updateCountyList(countyList: County[]): void {
    this.countyList$.next(countyList);
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

  public updateTravelDetails(travelDetails: any): void {
    this.travelDetails$.next(travelDetails);
  }

  public updateLanguage(language: string): void {
    this.languageSetting$.next(language);
  }
}
