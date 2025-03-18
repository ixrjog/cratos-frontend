import { Pipe, PipeTransform } from '@angular/core';
import { I18nData } from '../../@core/data/base-data';

@Pipe({ name: 'i18nTran' })
export class I18nTranPipe implements PipeTransform {

  transform(param: I18nData) {
    const lang = localStorage.getItem('lang');
    if (lang) {
      return param.langMap[lang]['displayName'];
    }
    return param.langMap['en-us']['displayName'];
  }
}
