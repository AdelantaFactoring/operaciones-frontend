import { Injectable } from '@angular/core';
import {RequestMethod} from "../../../shared/helpers/request-method";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {SOLICITUD} from "../../../shared/helpers/url/comercial";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";

@Injectable({
  providedIn: 'root'
})
export class RespuestaPagadorService {
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

  confirmarPago(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${SOLICITUD.confirmarPago}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
