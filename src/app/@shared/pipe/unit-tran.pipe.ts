import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'unitTran' })
export class UnitTranPipe implements PipeTransform {

  transform(unit: string) {
    const t = unit.split('/');
    const k = 1000;
    const sizes = [ 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB' ];
    const aliasSizes = [ 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB' ];
    const i = Math.floor(Math.log(parseInt(t[0])) / Math.log(k));
    let index = 0;
    if (t[1]) {
      let index = sizes.indexOf(t[1]);
      if (index === -1) {
        index = aliasSizes.indexOf(t[1]);
      } else {
        index = 0;
      }
    }
    return (parseInt(t[0]) / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i + index];
  }
}
