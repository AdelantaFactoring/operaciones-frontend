import { Injectable } from '@angular/core';
import {RequestMethod} from "app/shared/helpers/request-method";
import {environment} from "environments/environment";
import {PAGADOR} from "app/shared/helpers/url/comercial";
import {Observable} from "rxjs";
import {CONTENT_TYPE} from "app/shared/helpers/headers";

@Injectable({
  providedIn: 'root'
})
export class PagadorService {
  private requestMethod = new RequestMethod();
  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${PAGADOR.listar}`,
      `?search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  guardar(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${PAGADOR.guardar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
  eliminar(payload): Observable<any> {
    return this.requestMethod.delete(
      `${environment.apiUrl}${PAGADOR.eliminar}`,
      `?idPagador=${payload.idPagador}&idUsuarioAud=${payload.idUsuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
