import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InjectorInstance} from 'app/app.module';

export class RequestMethod {
  private http: HttpClient;

  constructor() {
    this.http = InjectorInstance.get<HttpClient>(HttpClient);
  }

  get(url: string, params: string, headers: any): Observable<any> {
    return this.http.get(url + ((params) ? params : ''), {headers: new HttpHeaders(headers)});
  }

  post(url: string, body: string, headers: any): Observable<any> {
    return this.http.post(url, body, {headers: new HttpHeaders(headers)});
  }

  // postFile(url: string, body: FormData, headers: any): Observable<any> {
  //   return this.http.post(url, body, {headers: new HttpHeaders(headers)});
  // }
}
