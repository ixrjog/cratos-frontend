import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RequestSignService } from './request-sign.service';

@Injectable()
export class WebSocketApiService {

  wsUrl: string = '/socket';

  constructor(private requestSignService: RequestSignService) {
  }

  createWsClient(url: string): WebSocket {
    let token = localStorage.getItem('id_token');
    let username = localStorage.getItem('username');
    let jti = localStorage.getItem('jti');

    if (token && jti) {
      // 签名模式
      const timestamp = String(Date.now());
      const sign = this.requestSignService.hmacSha256Sync(jti + timestamp, token);
      const params = `?jti=${encodeURIComponent(jti)}&t=${timestamp}&sign=${encodeURIComponent(sign)}`;
      return new WebSocket(environment.wsUrl + this.wsUrl + url + '/' + username + params, 'cratos-v1');
    }
    // 兼容旧模式
    return new WebSocket(environment.wsUrl + this.wsUrl + url + '/' + username, token);
  }

  onPing(ws: WebSocket) {
    ws.send('');
  }

  // onSend(data: string) {
  //   this.ws.send(data);
  // };
  //
  // onMessage(): Observable<any> {
  //   return new Observable(
  //     observer => {
  //       this.ws.onmessage = (event) => observer.next(event.data);
  //       this.ws.onerror = (event) => observer.error(event);
  //       this.ws.onclose = (event) => observer.complete();
  //     });
  // }

}

export enum WsMessageTopicEnum {
  HEARTBEAT = 'HEARTBEAT',
  APPLICATION_KUBERNETES_DETAILS = 'APPLICATION_KUBERNETES_DETAILS',
  APPLICATION_KUBERNETES_POD_WATCH_LOG = 'APPLICATION_KUBERNETES_POD_WATCH_LOG',
  APPLICATION_KUBERNETES_POD_EXEC = 'APPLICATION_KUBERNETES_POD_EXEC',
  PLAY_SSH_SESSION_AUDIT = 'PLAY_SSH_SESSION_AUDIT',
  EDS_KUBERNETES_NODE_DETAILS = 'EDS_KUBERNETES_NODE_DETAILS'

}

export enum WsMessageActionEnum {
  QUERY = 'QUERY',
  SUBSCRIPTION = 'SUBSCRIPTION',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  WATCH = 'WATCH',

  EXEC = 'EXEC',
  INPUT = 'INPUT',
  RESIZE = 'RESIZE',
  EXIT = 'EXIT',

  CLOSE = 'CLOSE',

}
