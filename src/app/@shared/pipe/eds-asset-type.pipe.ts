import { Pipe, PipeTransform } from '@angular/core';
import { EdsAssetTypeEnum } from '../../@core/data/ext-datasource';

@Pipe({ name: 'edsAssetType' })
export class EdsAssetTypePipe implements PipeTransform {

  transform(edsAssetType: string) {
    switch (edsAssetType) {
      case EdsAssetTypeEnum.ALIYUN_CERT:
      case EdsAssetTypeEnum.AWS_CERT:
      case EdsAssetTypeEnum.CLOUDFLARE_CER:
        return 'Certificate';
      case EdsAssetTypeEnum.AWS_STS_VPN:
        return 'Site-to-Site VPN';
      default:
        return edsAssetType;
    }
  }
}
