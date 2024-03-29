import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { County, Station } from '../../types';
import { debounceTime, distinctUntilChanged, map, shareReplay, startWith, take } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { TranslateObjectPropsPipe } from '../../pipe/translate-object-props.pipe';
import { AppSandbox } from '../../app.sandbox';

@Component({
  selector: 'app-station-search',
  templateUrl: './station-search.component.html',
  styleUrls: ['./station-search.component.sass']
})
export class StationSearchComponent implements OnInit, OnDestroy {

  @Input() placeholderLabel: string;
  @Input() stationInfoList: any;
  @Input() countyInfoList: any;
  @Output() stationSelect = new EventEmitter<Station>();
  @Output() stopEvent = new EventEmitter();

  filterStation: FormControl = new FormControl('');
  filterStation$ = this.filterStation.valueChanges.pipe(startWith(''));

  selectedStation: Station;
  selectedCounty: County;
  propStation$: Observable<string>;
  propCounties$: Observable<string>;
  filteredStationList = new ReplaySubject<any>(1);
  stationList$: Observable<Station>;
  stationList: Station[];
  countyList: County[];
  filteredCountyList: County[];
  globalAsiaClass = 'bubble';

  constructor(
    private sb: AppSandbox,
    private translateObjectPropsPipe: TranslateObjectPropsPipe
  ) { }

  ngOnInit() {
    this.countyList = this.countyInfoList;
    this.filteredCountyList = this.countyList;
    this.stationList = this.stationInfoList;
    this.filteredStationList.next(this.stationList);

    this.propCounties$ = this.sb.languageSetting.pipe(
      map(language => {
        if (language !== 'zh-TW') {
          return 'eng縣市';
        } else {
          return '縣市';
        }
      })
    );

    this.propStation$ = this.sb.languageSetting.pipe(
      map(language => {
        if (language !== 'zh-TW') {
          return 'eng站名';
        } else {
          return '站名';
        }
      }),
      shareReplay(1),
    );

    this.propStation$.subscribe(stationNameProp => {
      this.updateStationMessage(stationNameProp);
    });

    this.stationList$ = combineLatest(this.filteredStationList, this.filterStation$).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(([stationList, searchTerm]) => {
        return stationList.filter(
          station =>
            station.eng站名.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
              ||
            station.站名.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
              ||
            station.traWebsiteCode.indexOf(searchTerm) !== -1
        );
      })
    );
  }

  activatedCounty(county: County): void {
    this.filteredCountyList = this.countyList.filter(cy => cy.eng縣市 !== county.eng縣市);
    this.filteredStationList.next(this.stationList.filter(cy => cy.eng縣市 === county.eng縣市));
    this.selectedCounty = county;
    this.globalAsiaClass = 'counties bubble';
  }

  activatedGlobe() {
    this.filteredCountyList = this.countyList;
    this.filteredStationList.next(this.stationList);
    this.selectedCounty = undefined;
    this.globalAsiaClass = 'bubble';
  }

  saveValues() {
    this.stationSelect.emit(this.selectedStation);
  }

  selectThisStation(selectedStation: Station) {
    this.selectedStation = selectedStation;
    window.scrollTo(0, 0);
    this.propStation$.subscribe(
      stationPropName => this.updateStationMessage(stationPropName),
      take(1)
    );
  }

  updateStationMessage(stationNameProp: string = ''): void {
    const stationMessage = this.translateObjectPropsPipe.transform(this.selectedStation, stationNameProp, 'traWebsiteCode');
    this.filterStation.setValue(stationMessage);
  }

  discard() {
    this.stopEvent.emit();
  }

  ngOnDestroy() {
    this.propStation$.subscribe();
  }
}
