import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'arrayLength' })
export class ArrayLengthPipe implements PipeTransform {

  transform(val: any) {
    return val.length
  }
}
