import { Injectable } from '@angular/core';
import {RequestMethod} from "../../../shared/helpers/request-method";
import {HttpClient} from "@angular/common/http";
import {InjectorInstance} from "../../../app.module";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";
import {REGISTROPAGOS} from "../../../shared/helpers/url/cobranza";

@Injectable({
  providedIn: 'root'
})
export class RegistroPagosService {
  private requestMethod = new RequestMethod();
  private http: HttpClient;

  constructor() {
    this.http = InjectorInstance.get<HttpClient>(HttpClient);
  }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${REGISTROPAGOS.listar}`,
      `?idConsulta=${payload.idConsulta}&codigoLiquidacion=${payload.codigoLiquidacion}&codigoSolicitud=${payload.codigoSolicitud}` +
      `&cliente=${payload.cliente}&pagProv=${payload.pagProv}&moneda=${payload.moneda}&idTipoOperacion=${payload.idTipoOperacion}&idEstado=${payload.idEstado}` +
      `&pagProvDet=${payload.pagProvDet}&nroDocumento=${payload.nroDocumento}&fechaConfirmadaDesde=${payload.fechaConfirmadaDesde}&fechaConfirmadaHasta=${payload.fechaConfirmadaHasta}` +
      `&netoConfirmado=${payload.netoConfirmado}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  obtenerSumatoria(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${REGISTROPAGOS.obtenerSumatoria}`,
      `?idConsulta=${payload.idConsulta}&codigoLiquidacion=${payload.codigoLiquidacion}&codigoSolicitud=${payload.codigoSolicitud}` +
      `&cliente=${payload.cliente}&pagProv=${payload.pagProv}&moneda=${payload.moneda}&idTipoOperacion=${payload.idTipoOperacion}&idEstado=${payload.idEstado}` +
      `&pagProvDet=${payload.pagProvDet}&nroDocumento=${payload.nroDocumento}&fechaConfirmadaDesde=${payload.fechaConfirmadaDesde}&fechaConfirmadaHasta=${payload.fechaConfirmadaHasta}` +
      `&netoConfirmado=${payload.netoConfirmado}&search=${payload.search}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  listarPago(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${REGISTROPAGOS.listarPago}`,
      `?idLiquidacionDet=${payload.idLiquidacionDet}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  obtenerEstadoPagoFactoringRegular(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${REGISTROPAGOS.obtenerEstadoPagoFactoringRegular}`,
      `?idLiquidacionCab=${payload.idLiquidacionCab}&idLiquidacionDet=${payload.idLiquidacionDet}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  generarComprobanteEspecialFactoringRegular(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${REGISTROPAGOS.generarComprobanteEspecialFactoringRegular}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  infoPago(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${REGISTROPAGOS.infoPago}`,
      `?idLiquidacionDet=${payload.idLiquidacionDet}&fecha=${payload.fecha}&tipoPago=${payload.tipoPago}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  insertarPago(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${REGISTROPAGOS.insertarPago}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  insertarPagoMasivo(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${REGISTROPAGOS.insertarPagoMasivo}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  eliminarPago(payload): Observable<any> {
    return this.requestMethod.delete(
      `${environment.apiUrl}${REGISTROPAGOS.eliminarPago}`,
      `?idLiquidacionPago=${payload.idLiquidacionPago}&idLiquidacionDet=${payload.idLiquidacionDet}&idUsuarioAud=${payload.idUsuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  getPAI(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${REGISTROPAGOS.getPAI}`,
      `?idLiquidacionCab=${payload.idLiquidacionCab}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  updatePAI(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${REGISTROPAGOS.updatePAI}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
