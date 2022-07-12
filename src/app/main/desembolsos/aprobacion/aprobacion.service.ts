import {Injectable} from '@angular/core';
import {RequestMethod} from 'app/shared/helpers/request-method';
import {Observable} from 'rxjs';
import {DESEMBOLSO} from 'app/shared/helpers/url/desembolso';
import {environment} from 'environments/environment';
import {CONTENT_TYPE} from 'app/shared/helpers/headers';
import {HttpClient} from '@angular/common/http';
import {InjectorInstance} from 'app/app.module';
import {LIQUIDACIONES} from "../../../shared/helpers/url/operaciones";

@Injectable({
  providedIn: 'root'
})
export class AprobacionService {
  private requestMethod = new RequestMethod();
  private http: HttpClient;

  constructor() {
    this.http = InjectorInstance.get<HttpClient>(HttpClient);
  }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${DESEMBOLSO.listar}`,
      `?idConsulta=${payload.idConsulta}&codigoLiquidacion=${payload.codigoLiquidacion}&codigoSolicitud=${payload.codigoSolicitud}` +
      `&cliente=${payload.cliente}&pagProv=${payload.pagProv}&moneda=${payload.moneda}&idTipoOperacion=${payload.idTipoOperacion}&idEstado=${payload.idEstado}` +
      `&pagProvDet=${payload.pagProvDet}&nroDocumento=${payload.nroDocumento}&fechaOperacion=${payload.fechaOperacion}` +
      `&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  actualizar(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${DESEMBOLSO.actualizar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  cambiarEstado(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${DESEMBOLSO.cambiarEstado}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  // GenerarArchivo(payload): Observable<any> {
  //   return this.requestMethod.put(
  //     `${environment.apiUrl}${DESEMBOLSO.GenerarArchivo}`,
  //     payload,
  //     {
  //       'Content-Type': CONTENT_TYPE.json
  //     }
  //   );
  // }

  generarArchivo(payload): any {
    return this.requestMethod.getNewTab(
      `${environment.apiUrl}${DESEMBOLSO.GenerarArchivo}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      });
  }

  export(payload: any): Observable<Blob> {
    return this.http.post(environment.apiUrl + DESEMBOLSO.GenerarArchivo, payload, {responseType: 'blob'});
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
}
