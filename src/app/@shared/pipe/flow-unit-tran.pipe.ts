import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'flowUnitTran' })
export class FlowUnitTranPipe implements PipeTransform {

  transform(bytes: number) {
    if (bytes === 0) {
      return '0 B';
    }
    const k = 1024;
    const sizes = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'RB', 'QB' ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
  }
}
