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
  departureOrArrivalStation: boolean;
  showSearchDetails: boolean = false;

  constructor(private requestService: RequestService,) { }

  ngOnInit() {
    this.getStationList();
  }

  openStationList(departureOrArrivalStation: boolean): void{
    this.departureOrArrivalStation = departureOrArrivalStation;
    console.log(this.departureOrArrivalStation)
    this.showSearchDetails = true;
  }

  getStationList() : void {
    let _self = this;
    this.requestService.getStation().subscribe(function (stationListData) {
      _self.stationInfo = stationListData;
      _self.stationList = stationListData.stations;
    });
  }

  updateStation($event: Station){
    if (this.departureOrArrivalStation){
      this.departureStation = $event;
    } else {
      this.arrivalStation = $event;
    }
    this.showSearchDetails = false;
  }

}
