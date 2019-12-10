import { Component, OnInit} from '@angular/core';
import { RequestService } from '../service/request.service';
import { Station } from '../station';

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

  openStationList(departureOrArrivalStation: boolean): void{
    console.log(departureOrArrivalStation)
  }

  getStationList() : void {
    let _self = this;
    this.requestService.getStation().subscribe(function (stationListData) {
      _self.stationInfo = stationListData;
      _self.stationList = stationListData.stations;
    });
  }

}
