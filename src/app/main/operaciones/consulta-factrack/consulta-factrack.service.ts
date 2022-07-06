import { Injectable } from '@angular/core';
import {RequestMethod} from "../../../shared/helpers/request-method";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {SOLICITUD} from "../../../shared/helpers/url/comercial";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";

@Injectable({
  providedIn: 'root'
})
export class ConsultaFactrackService {
  private requestMethod = new RequestMethod();
  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${SOLICITUD.listar}`,
      `?idConsulta=${payload.idConsulta}&idSubConsulta=${payload.idSubConsulta}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  eliminarFactura(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${SOLICITUD.eliminarFactura}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  cambiarEstado(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${SOLICITUD.cambiarEstado}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  consultarFactura(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${SOLICITUD.consutarFactura}`,
      `?idUsuario=${payload.idUsuario}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    )
  }
}
