import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateObjectProps'
})
export class TranslateObjectPropsPipe implements PipeTransform {

  transform(object: any, arg: string, optionalArg: string = ''): string {
    if (object !== undefined) {
      return optionalArg === '' ? object[arg] : `${object[arg]} (${object[optionalArg]})`;
    }
    return '';
  }

}
