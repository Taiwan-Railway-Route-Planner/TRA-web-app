import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Station } from "../../class/station";
import { TranslateService } from "@ngx-translate/core";
import {debounceTime, distinctUntilChanged, map, shareReplay, startWith, take, tap} from "rxjs/operators";
import { FormControl } from "@angular/forms";
import {combineLatest, of, fromEvent, Observable} from "rxjs";
import { TranslateObjectPropsPipe } from '../../pipe/translate-object-props.pipe';

@Component({
  selector: 'app-station-search',
  templateUrl: './station-search.component.html',
  styleUrls: ['./station-search.component.sass']
})
export class StationSearchComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() placeholderLabel: string;
  @Input() stationInfo: any;
  @Output() stationSelect = new EventEmitter<Station>();
  @Output() stopEvent = new EventEmitter();

  filterStation: FormControl = new FormControl('');
  filterStation$ = this.filterStation.valueChanges.pipe(startWith(''));

  selectedStation: Station;
  propStation$: Observable<string>;
  propCounties$: Observable<string>;
  stationList$: Observable<Station>;
  valueTest: string = 'te';


  constructor(
    private translateService: TranslateService,
    private translateObjectPropsPipe: TranslateObjectPropsPipe
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
      })
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
      shareReplay(1),
    );

    this.propStation$.subscribe(stationNameProp => {
      this.updateStationMessage(stationNameProp)
    });

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
      }),
    );
  }

  ngAfterViewInit(): void {
    // let selectedCounty$ = fromEvent(this.selectCounty.nativeElement, 'click').pipe(
    //   tap(x => console.log(x))
    // ).subscribe(x => console.log(x))
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
    )
  }

  updateStationMessage(stationNameProp: string ='') : void {
    let stationMessage = this.translateObjectPropsPipe.transform(this.selectedStation, stationNameProp, 'traWebsiteCode');
    this.filterStation.setValue(stationMessage);
  }

  discard() {
    this.stopEvent.emit();
  }

  ngOnDestroy() {
    this.propStation$.subscribe();
  }
}
