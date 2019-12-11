import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Station } from "../../class/station";
import { StateStationService } from "../../service/stateStation.service";
import { map, startWith } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";

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

  prop$ = this.translateService.onLangChange.pipe(
    map(langChangeEvent => {
      if (langChangeEvent.lang !== 'zh-TW'){
        return 'eng站名'
      } else {
        return '站名'
      }
    }),
    startWith('eng站名')
  );



  constructor(private state: StateStationService,
              private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.listOfPossibleStations = this.state.getFilterStation();
    this.listOfCounties = this.state.getCounties();
    this.state.stationInfo.subscribe(data => console.log(data));
  }

  emitSelectedStation() {
    this.selectedStationEvent.emit(this.selectedStation);
    this.listOfPossibleStations = this.state.getFilterStation();
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
