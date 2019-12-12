import {Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Station } from "../../class/station";
import { TranslateService } from "@ngx-translate/core";
import { debounceTime, distinctUntilChanged, map, startWith } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { combineLatest, of} from "rxjs";

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

  filterStation: FormControl = new FormControl('');
  filterStation$ = this.filterStation.valueChanges.pipe(startWith(''));

  selectedStation: Station;
  propStation$;
  propCounties$;
  stationList$;


  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.propCounties$ = this.translateService.onLangChange.pipe(
      startWith({lang: this.translateService.currentLang}),
      map(langChangeEvent => {
        if (langChangeEvent.lang !== 'zh-TW') {
          return 'eng縣市'
        } else {
          return '縣市'
        }
      }),
    );

    this.propStation$ = this.translateService.onLangChange.pipe(
      startWith({lang: this.translateService.currentLang}),
      map(langChangeEvent => {
        if (langChangeEvent.lang !== 'zh-TW') {
          return 'eng站名'
        } else {
          return '站名'
        }
      }),
    );

    this.stationList$ = combineLatest(of(this.stationInfo.stations), this.filterStation$).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(function ([stationList, searchTerm]) {
        return stationList.filter(
          station =>
            station['eng站名'].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
            ||
            station['站名'].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
            ||
            station['traWebsiteCode'].indexOf(searchTerm) !== -1
        )
      })
    );
  }

  saveValues() {
    this.stationSelect.emit(this.selectedStation);
  }

  selectThisStation(selectedStation: Station) {
    this.selectedStation = selectedStation;
    window.scrollTo(0, 0);
  }

  discard() {
    this.stopEvent.emit();
  }
}
