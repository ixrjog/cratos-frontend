import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'containerImageTag' })
export class ContainerImageTagPipe implements PipeTransform {

  transform(val: string) {
    const index = val.indexOf(':');
    return val.substring(index + 1, val.length);
  }
}
