import { Injectable } from '@angular/core';
import {RequestMethod} from "../../../shared/helpers/request-method";
import {environment} from "environments/environment";
import {SOLICITUD, CLIENTEPAGADOR} from "../../../shared/helpers/url/comercial";
import {Observable} from "rxjs";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private requestMethod = new RequestMethod();
  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${SOLICITUD.listar}`,
      `?idEstado=${payload.idEstado}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
  comboCliente(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${CLIENTEPAGADOR.combo}`,
      `?idTipo=${payload.idTipo}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
  guardar(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${SOLICITUD.guardar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
