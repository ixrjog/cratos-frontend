import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stringReplace' })
export class StringReplacePipe implements PipeTransform {
  transform(val: string, ...args: any[]) {
    return val.replaceAll(args[0], args[1]);
  }
}
