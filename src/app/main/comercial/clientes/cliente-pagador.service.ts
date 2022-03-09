import { Injectable } from '@angular/core';
import {RequestMethod} from "app/shared/helpers/request-method";
import {environment} from "environments/environment";
import {CLIENTEPAGADOR} from "app/shared/helpers/url/comercial";
import {Observable} from "rxjs";
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

  obtener(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${CLIENTEPAGADOR.obtener}`,
      `?idClientePagador=${payload.idClientePagador}`,
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

  eliminar(payload): Observable<any> {
    return this.requestMethod.delete(
      `${environment.apiUrl}${CLIENTEPAGADOR.eliminar}`,
      `?idClientePagador=${payload.idClientePagador}&usuarioAud=${payload.usuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
