import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import * as _moment from 'moment';
// @ts-ignore
import {default as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;

@Injectable({
  providedIn: 'root'
})
export class TimeStampService {

  constructor(private translateService: TranslateService) { }

  getTimeStamp() {
    let test: string = '';
    switch (test) {
      case "EN":
        return moment().format('llll');
      case "ZH":
        return moment().format('llll').replace('一', '');
      case "KO":
        return moment().format('ll') + " " + moment().locale('en-SG').format('LT');
      case "NL":
        return moment().format('llll');
      case "ES":
        return moment().format('llll');
      case "DE":
        return moment().format('llll');
      case "FR":
        return moment().format('llll');
      case "AR":
        return moment().format('llll');
      case "RU":
        return moment().format('llll');
    }
  }
}
