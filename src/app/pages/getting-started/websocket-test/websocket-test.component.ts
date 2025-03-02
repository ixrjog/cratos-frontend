import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { WebSocketApiService } from '../../../@core/services/ws.api.service';
import { Subscription, timer } from 'rxjs';
import { WS_INIT_INTERVAL } from '../../../@shared/constant/ws.constant';

@Component({
  selector: 'app-websocket-test',
  templateUrl: './websocket-test.component.html',
  styleUrls: [ './websocket-test.component.less' ],
})
export class WebsocketTestComponent implements OnInit, OnDestroy {

  ws: WebSocket;
  wsMsg: string;
  message: string;
  timerRequest: Subscription;

  constructor(private wsApi: WebSocketApiService) {
  }

  ngOnInit(): void {
    this.initWs();
    // this.initInterval();
  }

  initWs() {
    this.ws = this.wsApi.createWsClient('/test');
    console.log(this.ws)
  }

  initInterval() {
    this.timerRequest = timer(1000, WS_INIT_INTERVAL)
      .subscribe(num => {
        console.log('num:' + num);
      });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.message = event.key
  }


  fetchData() {
    this.ws.send(this.wsMsg);
    this.ws.onmessage = (event) => {
      // this.message = event.data;
    };
    // this.ws.onerror = (event) => {
    //   console.log('onerror');
    //   console.log(event);
    // };
    // this.ws.onclose = (event) => {
    //   console.log('onclose');
    //   console.log(event);
    // };

    console.log(this.ws);

  }

  ngOnDestroy(): void {
    this.timerRequest.unsubscribe();
    this.ws.close();
  }




}
