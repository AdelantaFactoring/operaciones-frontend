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
    const params = new URLSearchParams();
    params.append('search', payload.search);
    params.append('pageIndex', payload.pageIndex);
    params.append('pageSize', payload.pageSize);
    params.append('codigoLiquidacion', payload.codigoLiquidacion);
    params.append('codigoSolicitud', payload.codigoSolicitud);
    params.append('idTipoOperacion', payload.idTipoOperacion);
    params.append('cliente', payload.cliente);
    params.append('moneda', payload.moneda);
    params.append('fechaDesembolsoDesde', payload.fechaDesembolsoDesde);
    params.append('fechaDesembolsoHasta', payload.fechaDesembolsoHasta);
    params.append('nroDocumento', payload.nroDocumento);
    params.append('monto', payload.monto);
    params.append('idsEstados', payload.idsEstados);
    params.append('fechaPagoDesde', payload.fechaPagoDesde);
    params.append('fechaPagoHasta', payload.fechaPagoHasta);
    params.append('flagSinFecDes', payload.flagSinFecDes);

    return this.requestMethod.get(
      `${environment.apiUrl}${DEVOLUCIONES.listar}`,
      `?${params.toString()}`,
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

  actualizarFechaDesembolso(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${DEVOLUCIONES.actualizarFechaDesembolso}`,
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
