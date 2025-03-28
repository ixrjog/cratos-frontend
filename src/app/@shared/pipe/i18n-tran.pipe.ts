import { Pipe, PipeTransform } from '@angular/core';
import { I18nDataAlias } from '../../@core/data/base-data';

@Pipe({ name: 'i18nTran' })
export class I18nTranPipe implements PipeTransform {

  transform(param: I18nDataAlias) {
    const lang = localStorage.getItem('lang');
    if (lang) {
      return param[lang]['displayName'];
    }
    return param['en-us']['displayName'];
  }
}
