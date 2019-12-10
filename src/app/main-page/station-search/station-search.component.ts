import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Station} from "../../station";

@Component({
  selector: 'app-station-search',
  templateUrl: './station-search.component.html',
  styleUrls: ['./station-search.component.sass']
})
export class StationSearchComponent implements OnInit {

  @Input() departureOrArrivalStation: boolean;
  @Output() getSelectedStation = new EventEmitter<Station>();
  listOfPossibleStations: Station[];

  constructor() { }

  ngOnInit() {
    console.log(this.departureOrArrivalStation)
  }

}
