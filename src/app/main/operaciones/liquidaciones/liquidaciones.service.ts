import { Injectable } from '@angular/core';
import {RequestMethod} from "../../../shared/helpers/request-method";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";
import {LIQUIDACIONES} from "../../../shared/helpers/url/operaciones";

@Injectable({
  providedIn: 'root'
})
export class LiquidacionesService {
  private requestMethod = new RequestMethod();
  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${LIQUIDACIONES.listar}`,
      `?idConsulta=${payload.idConsulta}&codigoLiquidacion=${payload.codigoLiquidacion}&codigoSolicitud=${payload.codigoSolicitud}` +
      `&cliente=${payload.cliente}&pagProv=${payload.pagProv}&moneda=${payload.moneda}&idTipoOperacion=${payload.idTipoOperacion}&idEstado=${payload.idEstado}` +
      `&pagProvDet=${payload.pagProvDet}&nroDocumento=${payload.nroDocumento}&fechaConfirmadaDesde=${payload.fechaConfirmadaDesde}&fechaConfirmadaHasta=${payload.fechaConfirmadaHasta}` +
      `&netoConfirmado=${payload.netoConfirmado}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  exportar(payload): Observable<Blob> {
    return this.requestMethod.getFile(
      `${environment.apiUrl}${LIQUIDACIONES.exportar}`,
      `?idConsulta=${payload.idConsulta}&codigoLiquidacion=${payload.codigoLiquidacion}&codigoSolicitud=${payload.codigoSolicitud}` +
      `&cliente=${payload.cliente}&pagProv=${payload.pagProv}&moneda=${payload.moneda}&idTipoOperacion=${payload.idTipoOperacion}&idEstado=${payload.idEstado}` +
      `&pagProvDet=${payload.pagProvDet}&nroDocumento=${payload.nroDocumento}&fechaConfirmadaDesde=${payload.fechaConfirmadaDesde}&fechaConfirmadaHasta=${payload.fechaConfirmadaHasta}` +
      `&desde=${payload.desde}&hasta=${payload.hasta}&search=${payload.search}`
    );
  }

  exportarFC(payload): Observable<Blob> {
    return this.requestMethod.getFile(
      `${environment.apiUrl}${LIQUIDACIONES.exportarFC}`,
      `?idConsulta=${payload.idConsulta}&codigoLiquidacion=${payload.codigoLiquidacion}&codigoSolicitud=${payload.codigoSolicitud}` +
      `&cliente=${payload.cliente}&pagProv=${payload.pagProv}&moneda=${payload.moneda}&idTipoOperacion=${payload.idTipoOperacion}&idEstado=${payload.idEstado}` +
      `&pagProvDet=${payload.pagProvDet}&nroDocumento=${payload.nroDocumento}&fechaConfirmadaDesde=${payload.fechaConfirmadaDesde}&fechaConfirmadaHasta=${payload.fechaConfirmadaHasta}` +
      `&desde=${payload.desde}&hasta=${payload.hasta}&search=${payload.search}`
    );
  }

  generar(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${LIQUIDACIONES.generar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  eliminar(payload): Observable<any> {
    return this.requestMethod.delete(
      `${environment.apiUrl}${LIQUIDACIONES.eliminar}`,
      `?idLiquidacionCab=${payload.idLiquidacionCab}&idUsuarioAud=${payload.idUsuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  actualizar(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${LIQUIDACIONES.actualizar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  cambiarEstado(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${LIQUIDACIONES.cambiarEstado}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  pdf(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${LIQUIDACIONES.pdf}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  cambiarFechaOperacionGlobal(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${LIQUIDACIONES.cambiarFechaOperacionGlobal}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  vistaPrevia(payload): Observable<Blob> {
    return this.requestMethod.postFile(
      `${environment.apiUrl}${LIQUIDACIONES.vistaPrevia}`,
      payload
    );
  }
}
