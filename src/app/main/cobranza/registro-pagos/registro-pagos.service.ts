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
      `?idConsulta=${payload.idConsulta}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
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

  infoPago(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${REGISTROPAGOS.infoPago}`,
      `?idLiquidacionDet=${payload.idLiquidacionDet}&tipoPago=${payload.tipoPago}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
