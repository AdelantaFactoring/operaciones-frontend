import { Injectable } from '@angular/core';
import {RequestMethod} from "../../../shared/helpers/request-method";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {SOLICITUD_CAVALI} from "../../../shared/helpers/url/operaciones";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";
import {SOLICITUD} from "../../../shared/helpers/url/comercial";

@Injectable({
  providedIn: 'root'
})
export class CavaliService {
  private requestMethod = new RequestMethod();
  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${SOLICITUD_CAVALI.listar}`,
      `?codigoSolicitud=${payload.codigoSolicitud}&nroDocumento=${payload.nroDocumento}&idTipoProceso=${payload.idTipoProceso}&fechaDesde=${payload.fechaDesde}&fechaHasta=${payload.fechaHasta}` +
      `&idEstado=${payload.idEstado}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  consultarFactura(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${SOLICITUD.consutarFactura}`,
      `?idUsuarioAud=${payload.idUsuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    )
  }

  revertirEstado(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${SOLICITUD_CAVALI.revertirEstado}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
