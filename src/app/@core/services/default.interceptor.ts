import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent,
} from '@angular/common/http';
import { catchError, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ToastService } from 'ng-devui';
import { HttpResult } from '../data/base-data';
import { Router } from '@angular/router';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService,
              private route: Router) {
  }

  toastData = {
    style: { width: '600px', color: 'red' },
    life: 5000,
    lifeMode: 'global',
  };

  private handleData(event: HttpResponse<any> | HttpErrorResponse | any): Observable<any> {
    const result: HttpResult<any> = event instanceof HttpResponse && event.body;
    // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
    // this.injector.get(this.httpClient).end();
    // 业务处理：一些通用操作
    switch (event.status) {
      case 200:
      case 201:
        // 业务层级错误处理，以下假如响应体的 `success` 若不为 true 表示业务级异常
        // 并显示 `msg` 内容
        const result: HttpResult<any> = event instanceof HttpResponse && event.body;
        if (result && !result.success) {
          this.toastService.open({
            value: [ { severity: 'error', summary: 'Error', content: result.msg } ],
            ...this.toastData,
          });
          throw new Error(result.msg);
        }
        return of(event);
      case 401: // 未登录状态码
        this.toastService.open({
          value: [ { severity: 'error', summary: 'Error', content: 'Token Invalid' } ],
          ...this.toastData,
        });
        this.route.navigate([ 'login' ]);
        break;
      case 403:
        this.toastService.open({
          value: [ { severity: 'error', summary: 'Error', content: event.error.msg} ],
          ...this.toastData,
        });
        break;
      case 404:
      case 500:
        this.toastService.open({
          value: [ { severity: 'error', summary: 'Error', content: event.message } ],
          ...this.toastData,
        });
        throw new Error('something error');
      default:
        throw new Error('something error');
    }
    return of(event);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    // 统一加上服务端前缀
    const url = req.url;
    // if (!url.startsWith('https://') && !url.startsWith('http://')) {
    //   url = environment.SERVER_URL + url;
    // }
    const newReq = req.clone({
      url,
    });
    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
        if (event instanceof HttpResponse && `${event.status}`.startsWith('20')) {
          return this.handleData(event);
        }
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err)),
    );
  }
}
