import {Injectable} from '@angular/core';
import {RequestMethod} from "../../../../shared/helpers/request-method";
import {environment} from "environments/environment";
import {SOLICITUD, CLIENTE} from "../../../../shared/helpers/url/comercial";
import {Observable} from "rxjs";
import {CONTENT_TYPE} from "../../../../shared/helpers/headers";


@Injectable({
  providedIn: 'root'
})
export class SolicitudesFormService {

  private requestMethod = new RequestMethod();

  constructor() {
  }

  listarCliente(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${CLIENTE.listar}`,
      `?idTipo=${payload.idTipo}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
  
  guardar(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${SOLICITUD.guardar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
