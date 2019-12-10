import { Component, OnInit} from '@angular/core';
import { RequestService } from '../request.service';
import { Station } from '../station';
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { filter, map, takeUntil, tap } from "rxjs/operators";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass']
})
export class MainPageComponent implements OnInit {

  stationInfo: any;
  stationList: Station[];
  departureStation: Station;
  arrivalStation: Station;

  constructor(private requestService: RequestService,) { }

  ngOnInit() {
    this.getStationList();
  }

  openStationList(departureOrArrivalStation: boolean){

  }

  getStationList() : void {
    let _self = this;
    this.requestService.getStation().subscribe(function (stationListData) {
      _self.stationInfo = stationListData;
      _self.stationList = stationListData.stations;
    });
  }

}
