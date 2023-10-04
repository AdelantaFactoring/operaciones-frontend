import { Injectable } from '@angular/core';
import { RequestMethod } from '../helpers/request-method';
import { SUNAT } from '../helpers/url/shared';
import { CONTENT_TYPE } from '../helpers/headers';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SunatService {

  private requestMethod = new RequestMethod();
  constructor() { }

  getToken(payload): Observable<any> {
    return this.requestMethod.post(
      `${SUNAT.genToken}`, payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  getData(payload): Observable<any> {
  
    return this.requestMethod.get(
      `${SUNAT.getDatos}`,
      `?RUC=${payload.ruc}`,
      {
        'Content-Type': CONTENT_TYPE.json,
        // headers
        'Authorization': `Bearer ${payload.token}`
      }
    );
  }

  async genToken(payload): Promise<any> {
    return await this.requestMethod.postAsync(
      `${SUNAT.genToken}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  async getData2(payload): Promise<any> {
  
    return await this.requestMethod.getAsync(
      `${SUNAT.getDatos}`,
      `?RUC=${payload.ruc}`,
      {
        'Content-Type': CONTENT_TYPE.json,
        'Authorization': `Bearer ${payload.token}`
      }
    );
  }
}
