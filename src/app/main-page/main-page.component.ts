import { Component, OnInit} from '@angular/core';
import { RequestService } from '../service/request.service';
import { Station } from '../class/station';
import { StationInfoService } from "../service/station-info.service";

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

  constructor(
    private requestService: RequestService,
    private stationInfoService: StationInfoService
  ) { }

  ngOnInit() {
    this.getStationList();
  }

  openStationList(departureOrArrivalStation: boolean): void{
    this.stationInfoService.updateFilterStation(departureOrArrivalStation? this.departureStation : this.arrivalStation);
    this.departureOrArrivalStation = departureOrArrivalStation;
    this.showSearchDetails = true;
  }

  getStationList() : void {
    let _self = this;
    this.requestService.getStation().subscribe(function (stationListData) {
      _self.stationInfo = stationListData;
      _self.stationList = stationListData.stations;
      _self.stationInfoService.initService(stationListData);

      // debug
      _self.stationInfoService.updateFilterStation(true? this.departureStation : this.arrivalStation);
      _self.showSearchDetails = true;
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
