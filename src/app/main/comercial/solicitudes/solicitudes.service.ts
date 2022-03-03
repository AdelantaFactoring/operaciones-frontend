import { Injectable } from '@angular/core';
import {RequestMethod} from "../../../shared/helpers/request-method";
import {environment} from "environments/environment";
import {SOLICITUD} from "../../../shared/helpers/url/comercial";
import {Observable} from "rxjs";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private requestMethod = new RequestMethod();
  constructor() { }

  listar(): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${SOLICITUD.listar}`,
      ``,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
