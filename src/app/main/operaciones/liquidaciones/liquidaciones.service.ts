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
      `?idConsulta=${payload.idConsulta}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
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
}
