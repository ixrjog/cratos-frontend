import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';


@Injectable()
export class DnsUtil {

  dnsEndPoint: string = 'https://dns.google/resolve?name=';

  constructor(private http: HttpClient) {
  }

  lookup(hostname: string) {
    this.http.get(this.dnsEndPoint + hostname + '&type=5')
      .pipe(
        timeout(2000),
      ).subscribe(res => console.log(res));
  }

}
