import {NgModule} from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  exports: [
    NzPageHeaderModule,
    NzButtonModule,
  ]
})
export class NgZorroModule {}
