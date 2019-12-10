import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Station } from "../../class/station";
import { StationInfoService } from "../../service/station-info.service";

@Component({
  selector: 'app-station-search',
  templateUrl: './station-search.component.html',
  styleUrls: ['./station-search.component.sass']
})
export class StationSearchComponent implements OnInit {

  @Input() departureOrArrivalStation: boolean;
  @Output() getSelectedStation = new EventEmitter<Station>();
  listOfPossibleStations: Station[];
  listOfCounties: any;

  constructor(private stationInfoService: StationInfoService) { }

  ngOnInit() {
    this.listOfPossibleStations = this.stationInfoService.getFilterStation();
    this.listOfCounties = this.stationInfoService.getCounties();
  }

}
