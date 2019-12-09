import { Component, OnInit} from '@angular/core';
import { RequestService } from '../request.service';
import { Station } from '../station';
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { filter, map, takeUntil, tap } from "rxjs/operators";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass']
})
export class MainPageComponent implements OnInit {

  stationList: any;


  protected stationInfo: Station[];

  public stationCtrl: FormControl = new FormControl();

  public stationFilterCtrl: FormControl = new FormControl();

  public searching: boolean = false;

  public filteredStations: ReplaySubject<Station[]> = new ReplaySubject<Station[]>(1);

  protected _onDestroy = new Subject<void>();

  constructor(
    private requestService: RequestService,
  ) { }

  ngOnInit() {

    this.getStationList();

    this.stationFilterCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        map(search => {
          if (!this.stationInfo) {
            return [];
          }

          return this.stationInfo.filter(station =>
            station['eng站名'].toLowerCase().indexOf(search) > -1
            || station['站名'].toLowerCase().indexOf(search) > -1
            || station['traWebsiteCode'].toLowerCase().indexOf(search) > -1
            // || station['時刻表編號'].toString().toLowerCase().indexOf(search) > -1
          );

        })
      )
      .subscribe(filterStations => {
          this.searching = false;
          this.filteredStations.next(filterStations);
        },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });


  }

  getStationList() : void {
    let _self = this;
    this.requestService.getStation().subscribe(function (stationListData) {
      _self.stationList = stationListData;
      _self.stationInfo = stationListData.stations;
      _self.filteredStations.next(stationListData.stations);
      _self.searching = false;
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
