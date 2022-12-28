import { Injectable } from '@angular/core';
import {RequestMethod} from "../../../shared/helpers/request-method";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {SOLICITUD} from "../../../shared/helpers/url/comercial";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";

@Injectable({
  providedIn: 'root'
})
export class CheckListService {
  private requestMethod = new RequestMethod();
  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${SOLICITUD.listar}`,
      `?idUsuario=${payload.idUsuario}&idConsulta=${payload.idConsulta}&idSubConsulta=${payload.idSubConsulta}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  actualizar(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${SOLICITUD.actualizar}`,
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

  listarAdelanto(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${SOLICITUD.listarAdelanto}`,
      `?idSolicitudCab=${payload.idSolicitudCab}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  guardarAdelanto(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${SOLICITUD.guardarAdelanto}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  eliminarAdelanto(payload): Observable<any> {
    return this.requestMethod.delete(
      `${environment.apiUrl}${SOLICITUD.eliminarAdelanto}`,
      `?idSolicitudCabAdelanto=${payload.idSolicitudCabAdelanto}&idSolicitudCab=${payload.idSolicitudCab}&idUsuarioAud=${payload.idUsuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
