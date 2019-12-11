import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Station } from "../../class/station";
import { StateStationService } from "../../service/stateStation.service";
import { TranslateService } from "@ngx-translate/core";
import { map, startWith } from "rxjs/operators";

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
  // listOfCounties: any;
  selectedStation: Station;

  counties$;

  prop$ = this.translateService.onLangChange.pipe(
    startWith({lang: this.translateService.currentLang}),
    map(langChangeEvent => {
      if (langChangeEvent.lang !== 'zh-TW'){
        return 'eng縣市'
      } else {
        return '縣市'
      }
    }),
  )


  constructor(
    private state: StateStationService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.counties$ = this.state.stationInfo;

    this.listOfPossibleStations = this.state.getFilterStation();
    // this.listOfCounties = this.state.getCounties();

    this.translateService.onLangChange.subscribe(data => console.log(data));
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
