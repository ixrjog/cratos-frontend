import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketApiService } from '../../../@core/services/ws.api.service';
import { Subscription, timer } from 'rxjs';

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
    this.initInterval();
  }

  initWs() {
    this.ws = this.wsApi.createWsClient('/test');
  }

  initInterval() {
    this.timerRequest = timer(1000, 1000)
      .subscribe(num => {
        console.log('num:' + num);
      });
  }

  fetchData() {
    this.ws.send(this.wsMsg);
    this.ws.onmessage = (event) => {
      this.message = this.message + event.data;
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
