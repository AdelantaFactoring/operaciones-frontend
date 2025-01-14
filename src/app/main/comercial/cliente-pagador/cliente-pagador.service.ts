import { Injectable } from '@angular/core';
import {RequestMethod} from "app/shared/helpers/request-method";
import {Observable} from "rxjs";
import {environment} from "./../../../../environments/environment";
import {CLIENTEPAGADOR} from "app/shared/helpers/url/comercial";
import {CONTENT_TYPE} from "app/shared/helpers/headers";

@Injectable({
  providedIn: 'root'
})
export class ClientePagadorService {
  private requestMethod = new RequestMethod();

  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${CLIENTEPAGADOR.listar}`,
      `?search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  guardar(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${CLIENTEPAGADOR.guardar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  listarGastos(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${CLIENTEPAGADOR.listarGastos}`,
      `?idClientePagador=${payload.idClientePagador}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  obtener(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${CLIENTEPAGADOR.obtener}`,
      `?idCliente=${payload.idCliente}&rucPagProv=${payload.rucPagProv}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  guardarGastos(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${CLIENTEPAGADOR.guardarGastos}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
