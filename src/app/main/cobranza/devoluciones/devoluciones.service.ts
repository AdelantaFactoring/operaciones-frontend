import { Injectable } from '@angular/core';
import {RequestMethod} from "../../../shared/helpers/request-method";
import {HttpClient} from "@angular/common/http";
import {InjectorInstance} from "../../../app.module";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {DEVOLUCIONES} from "../../../shared/helpers/url/cobranza";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";

@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {
  private requestMethod = new RequestMethod();
  private http: HttpClient;

  constructor() {
    this.http = InjectorInstance.get<HttpClient>(HttpClient);
  }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${DEVOLUCIONES.listar}`,
      `?search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}&codigoLiquidacion=${payload.codigoLiquidacion}` +
      `&codigoSolicitud=${payload.codigoSolicitud}&idTipoOperacion=${payload.idTipoOperacion}&cliente=${payload.cliente}&moneda=${payload.moneda}` +
      `&fechaDesembolsoDesde=${payload.fechaDesembolsoDesde}&fechaDesembolsoHasta=${payload.fechaDesembolsoHasta}&nroDocumento=${payload.nroDocumento}` +
      `&monto=${payload.monto}&idsEstados=${payload.idsEstados}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  actualizar(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${DEVOLUCIONES.actualizar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  cambiarEstado(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${DEVOLUCIONES.cambiarEstado}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  export(payload: any): Observable<Blob> {
    return this.http.post(environment.apiUrl + DEVOLUCIONES.generarArchivo, payload, {responseType: 'blob'});
  }

  enviarCorreo(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${DEVOLUCIONES.enviarCorreo}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  eliminar(payload): Observable<any> {
    return this.requestMethod.delete(
      `${environment.apiUrl}${DEVOLUCIONES.eliminar}`,
      `?idLiquidacionDevolucion=${payload.idLiquidacionDevolucion}&idUsuarioAud=${payload.idUsuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
