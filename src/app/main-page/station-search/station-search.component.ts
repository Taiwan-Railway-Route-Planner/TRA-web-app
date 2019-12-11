import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Station } from "../../class/station";
import { TranslateService } from "@ngx-translate/core";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: 'app-station-search',
  templateUrl: './station-search.component.html',
  styleUrls: ['./station-search.component.sass']
})
export class StationSearchComponent implements OnInit {

  @Input() placeholderLabel: string;
  @Input() stationInfo: any;
  @Output() stationSelect = new EventEmitter<Station>();
  @Output() stopEvent = new EventEmitter();

  selectedStation: Station;
  propStation$;
  propCounties$;


  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit() {

    this.propCounties$ = this.translateService.onLangChange.pipe(
      startWith({lang: this.translateService.currentLang}),
      map(langChangeEvent => {
        if (langChangeEvent.lang !== 'zh-TW'){
          return 'eng縣市'
        } else {
          return '縣市'
        }
      }),
    );

    this.propStation$ = this.translateService.onLangChange.pipe(
      startWith({lang: this.translateService.currentLang}),
      map(langChangeEvent => {
        if (langChangeEvent.lang !== 'zh-TW'){
          return 'eng站名'
        } else {
          return '站名'
        }
      }),
    );
  }

  saveValues() {
    this.stationSelect.emit(this.selectedStation);
  }

  selectThisStation(selectedStation: Station){
    this.selectedStation = selectedStation;
    window.scrollTo(0,0);
  }

  discard() {
    this.stopEvent.emit();
  }
}
