import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'edsAssetType' })
export class EdsAssetTypePipe implements PipeTransform {

  transform(param: { type: string, displayName: string }) {
    return param.displayName;
  }
}
