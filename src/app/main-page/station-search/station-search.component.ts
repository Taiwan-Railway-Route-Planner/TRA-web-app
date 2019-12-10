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
  @Output() selectedStationEvent = new EventEmitter<Station>();
  @Output() stopEvent = new EventEmitter();
  listOfPossibleStations: Station[];
  listOfCounties: any;
  selectedStation: Station;

  constructor(private stationInfoService: StationInfoService) { }

  ngOnInit() {
    this.listOfPossibleStations = this.stationInfoService.getFilterStation();
    this.listOfCounties = this.stationInfoService.getCounties();
  }

  emitSelectedStation() {
    this.selectedStationEvent.emit(this.selectedStation);
    this.listOfPossibleStations = this.stationInfoService.getFilterStation();
    this.selectedStation = undefined;
  }

  selectThisStation(selectedStation: Station){
    this.selectedStation = selectedStation;
    window.scrollTo(0,0);
  }

  discard() {
    this.stopEvent.emit();
  }
}
