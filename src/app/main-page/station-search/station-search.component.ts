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
  @Output() stopEvent = new EventEmitter();

  selectedStation: Station;
  prop$;
  stationInfo$;


  constructor(
    private state: StateStationService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.stationInfo$ = this.state.stationInfo;

    this.prop$ = this.translateService.onLangChange.pipe(
      startWith({lang: this.translateService.currentLang}),
      map(langChangeEvent => {
        if (langChangeEvent.lang !== 'zh-TW'){
          // return ['eng縣市', 'eng站名']
          return 'eng縣市'
        } else {
          // return ['縣市', '站名']
          return '縣市'
        }
      }),
    );
  }

  saveValues() {
    if (this.departureOrArrivalStation){
      this.state.updateDepartureStation(this.selectedStation)
    } else {
      this.state.updateArrivalStation(this.selectedStation);
    }
    this.selectedStation = undefined;
    this.departureOrArrivalStation = !this.departureOrArrivalStation;
  }

  selectThisStation(selectedStation: Station){
    this.selectedStation = selectedStation;
    window.scrollTo(0,0);
  }

  discard() {
    this.stopEvent.emit();
  }
}
