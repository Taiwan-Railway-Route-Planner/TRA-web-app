import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  title = 'Taiwan Railway app';

  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'lang',
      type: 'select',
      templateOptions: {
        required: true,
        change: (field) => this.translate.use(field.formControl.value),
        options: [
          {label: 'English', value: 'en-GB'},
          {label: '中文', value: 'zh-TW'},
          {label: '한국어', value: 'ko-KR'},
          {label: 'Deutsch', value: 'de-DE'},
          {label: 'Español', value: 'es-ES'},
          {label: 'Française', value: 'fr-FR'},
          {label: 'Nederlands', value: 'nl-BE'},
          {label: 'Հայերեն', value: 'hy-AM'},
          {label: 'Русский', value: 'ru-RU'}

        ],
      }
    },
  ];

  constructor(public translate: TranslateService) {
    translate.addLangs(['zh-TW', 'en-GB', 'ko-KR', 'de-DE', 'es-ES', 'fr-FR', 'nl-BE', 'hy-AM', 'ru-Ru']);
    translate.setDefaultLang('en-GB');

    const browserLang = translate.getBrowserLang();

    translate.use(browserLang.match(/'zh-TW'|'en-GB'|'ko-KR'|'de-DE'|'es-ES'|'fr-FR'|'nl-BE'|'hy-AM'|'ru-Ru'/) ? browserLang : 'en-GB');
    this.model.lang = translate.currentLang;
  }

}
