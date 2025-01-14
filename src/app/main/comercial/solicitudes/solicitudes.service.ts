import {Injectable} from '@angular/core';
import {RequestMethod} from "../../../shared/helpers/request-method";
import {environment} from "environments/environment";
import {SOLICITUD, CLIENTE} from "../../../shared/helpers/url/comercial";
import {Observable} from "rxjs";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private requestMethod = new RequestMethod();

  constructor() {
  }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${SOLICITUD.listar}`,
      `?idUsuario=${payload.idUsuario}&idConsulta=${payload.idConsulta}&idSubConsulta=${payload.idSubConsulta}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  listarCliente(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${CLIENTE.listar}`,
      `?idTipo=${payload.idTipo}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  comboCliente(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${CLIENTE.combo}`,
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

  eliminar(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${SOLICITUD.eliminar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  upload(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${SOLICITUD.upload}`,
      payload,
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
}
