import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { County } from "../class/county";

@Pipe({
  name: 'translateCounty',
  pure: false
})
export class TranslateCountyPipe implements PipeTransform {

  constructor(private translateService: TranslateService) {}

  transform(county: County): string {
    if (this.translateService.currentLang !== 'zh-TW'){
      return `${county.eng縣市}`
    } else {
      return `${county.縣市}`
    }
  }

}
