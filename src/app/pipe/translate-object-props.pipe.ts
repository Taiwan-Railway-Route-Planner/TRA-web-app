import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateObjectProps'
})
export class TranslateObjectPropsPipe implements PipeTransform {

  transform(object: any, arg: string): string {
    if (object) {
      return object[arg];
    }
    return ''
  }

}
