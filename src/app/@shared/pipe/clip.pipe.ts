import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ 'name': 'clip' })
export class ClipPipe implements PipeTransform {
  transform(val: string, ...args: any[]) {
    let defaultLength = 20;
    if (args[0]) {
      defaultLength = args[0]
    }
    if (val.length > defaultLength) return val.slice(0, defaultLength) + '...';
    return val;
  }

}
