import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {RequestMethod} from "../../../shared/helpers/request-method";
import {environment} from "../../../../environments/environment";
import {GASTOSMORA} from "../../../shared/helpers/url/catalogos";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";

@Injectable({
  providedIn: 'root'
})
export class GastosMoraService {
  constructor(private requestMethod: RequestMethod) { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${GASTOSMORA.listar}`,
      `?search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  guardar(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${GASTOSMORA.guardar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    )
  }

  eliminar(payload): Observable<any> {
    return this.requestMethod.delete(
      `${environment.apiUrl}${GASTOSMORA.eliminar}`,
      `?idGastosMora=${payload.idGastosMora}&idUsuarioAud=${payload.idUsuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    )
  }
}
