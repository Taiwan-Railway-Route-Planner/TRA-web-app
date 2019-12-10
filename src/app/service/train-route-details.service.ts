import { Injectable } from '@angular/core';
import {Station} from "../class/station";
import {TimeDetails} from "../class/timeDetails";

@Injectable({
  providedIn: 'root'
})
export class TrainRouteDetailsService {

  public departureStation: Station;
  public arrivalStation: Station;
  public timeDetails: TimeDetails;

  public init(departureStation: Station, arrivalStation: Station, timeDetails: TimeDetails){
    this.departureStation = departureStation;
    this.arrivalStation = arrivalStation;
    this.timeDetails = timeDetails;
  }
}
