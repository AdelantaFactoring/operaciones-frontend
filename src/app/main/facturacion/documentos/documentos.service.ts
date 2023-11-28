import {Injectable} from '@angular/core';
import {RequestMethod} from "../../../shared/helpers/request-method";
import {HttpClient} from "@angular/common/http";
import {InjectorInstance} from "../../../app.module";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";
import {DOCUMENTOS} from "../../../shared/helpers/url/facturacion";

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  private requestMethod = new RequestMethod();
  private http: HttpClient;

  constructor() {
    this.http = InjectorInstance.get<HttpClient>(HttpClient);
  }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${DOCUMENTOS.listar}`,
      `?search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}` +
        `&codigoLiquidacion=${payload.codigoLiquidacion}&codigoSolicitud=${payload.codigoSolicitud}` +
        `&cliente=${payload.cliente}&idMoneda=${payload.idMoneda}&fechaEmisionDesde=${payload.fechaEmisionDesde}` +
        `&fechaEmisionHasta=${payload.fechaEmisionHasta}&idTipoDocumento=${payload.idTipoDocumento}` +
        `&nroDocumento=${payload.nroDocumento}&montoTotal=${payload.montoTotal}&idsEstados=${payload.idsEstados}` +
        `&serie=${payload.serie}&correlativoMin=${payload.correlativoMin}&correlativoMax=${payload.correlativoMax}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  serieCombo(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${DOCUMENTOS.serieCombo}`,
      `?idTipoDocumento=${payload.idTipoDocumento}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  obtenerPorNroDocumento(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${DOCUMENTOS.obtenerPorNroDocumento}`,
      `?idTipoDocumento=${payload.idTipoDocumento}&nroDocumento=${payload.nroDocumento}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  guardar(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${DOCUMENTOS.guardar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  firmaPublicacionDeclaracion(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${DOCUMENTOS.firmaPublicacionDeclaracion}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  async firmaPublicacionDeclaracionAsync(payload): Promise<any> {
    return await this.requestMethod.postAsync(
      `${environment.apiUrl}${DOCUMENTOS.firmaPublicacionDeclaracion}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  consultarEstado(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${DOCUMENTOS.consultarEstado}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  anular(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${DOCUMENTOS.anular}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  eliminar(payload): Observable<any> {
    return this.requestMethod.delete(
      `${environment.apiUrl}${DOCUMENTOS.eliminar}`,
      `?idLiquidacionDocumentoCab=${payload.idLiquidacionDocumentoCab}&idUsuarioAud=${payload.idUsuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  enviarCorreo(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${DOCUMENTOS.enviarCorreo}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  descargar(payload): Observable<any> {
    return this.requestMethod.getFile(
      `${environment.apiUrl}${DOCUMENTOS.descargar}`,
      `?search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}` +
      `&codigoLiquidacion=${payload.codigoLiquidacion}&codigoSolicitud=${payload.codigoSolicitud}` +
      `&cliente=${payload.cliente}&idMoneda=${payload.idMoneda}&fechaEmisionDesde=${payload.fechaEmisionDesde}` +
      `&fechaEmisionHasta=${payload.fechaEmisionHasta}&idTipoDocumento=${payload.idTipoDocumento}` +
      `&nroDocumento=${payload.nroDocumento}&montoTotal=${payload.montoTotal}&idsEstados=${payload.idsEstados}` +
      `&serie=${payload.serie}&correlativoMin=${payload.correlativoMin}&correlativoMax=${payload.correlativoMax}`
    );
  }
}
