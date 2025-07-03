import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'ticketState' })
export class TicketStatePipe implements PipeTransform {

  constructor(private translate: TranslateService) {
  }

  transform(value: string): string {
    let result = '';
    this.translate.get('workOrderTicket')
      .subscribe((res) => {
        result =  res['state'][this.convertToCamelCase(value)];
    });
    return result;
  }

  convertToCamelCase(str: string): string {
    return str.toLowerCase().split('_').map((word, index) => {
      // 首单词不做首字母大写处理，后续单词首字母大写
      return index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
  }
}
