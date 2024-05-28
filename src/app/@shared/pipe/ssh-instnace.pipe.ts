import { Pipe, PipeTransform } from '@angular/core';
import { SshInstanceVO } from '../../@core/data/ssh-session';

@Pipe({ name: 'sshInstance' })
export class SshInstancePipe implements PipeTransform {

  transform(param: SshInstanceVO) {
    let index = param.instanceId.lastIndexOf('#');
    return param.instanceId.slice(0, index);
  }
}
