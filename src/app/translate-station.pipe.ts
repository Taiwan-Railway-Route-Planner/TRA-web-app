import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {Station} from "./station";

@Pipe({
  name: 'translateStation',
  pure: false
})
export class TranslateStationPipe implements PipeTransform {

  constructor(private translateService: TranslateService) {
  }

  transform(station: Station): string {
    if (station === undefined){
      return '';
    } else {
      if (this.translateService.currentLang !== 'zh-TW'){
        return `${station.eng站名}  (${station.traWebsiteCode})`
      } else {
        return `${station.站名}  (${station.traWebsiteCode})`
      }
    }

  }

}
