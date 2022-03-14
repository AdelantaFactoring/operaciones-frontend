import { Injectable } from '@angular/core';
import {RequestMethod} from "app/shared/helpers/request-method";
import {environment} from "environments/environment";
import {CLIENTE} from "app/shared/helpers/url/comercial";
import {Observable} from "rxjs";
import {CONTENT_TYPE} from "app/shared/helpers/headers";

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private requestMethod = new RequestMethod();
  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${CLIENTE.listar}`,
      `?search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  obtener(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${CLIENTE.obtener}`,
      `?idCliente=${payload.idCliente}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  guardar(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${CLIENTE.guardar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  eliminar(payload): Observable<any> {
    return this.requestMethod.delete(
      `${environment.apiUrl}${CLIENTE.eliminar}`,
      `?idCliente=${payload.idCliente}&idUsuarioAud=${payload.idUsuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  eliminarCuenta(payload): Observable<any> {
    return this.requestMethod.delete(
      `${environment.apiUrl}${CLIENTE.eliminarCuenta}`,
      `?idClienteCuenta=${payload.idClienteCuenta}&idUsuarioAud=${payload.idUsuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  eliminarContacto(payload): Observable<any> {
    return this.requestMethod.delete(
      `${environment.apiUrl}${CLIENTE.eliminarContacto}`,
      `?idClienteContacto=${payload.idClienteContacto}&idUsuarioAud=${payload.idUsuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  eliminarGastos(payload): Observable<any> {
    return this.requestMethod.delete(
      `${environment.apiUrl}${CLIENTE.eliminarGastos}`,
      `?idClienteGastos=${payload.idClienteGastos}&idUsuarioAud=${payload.idUsuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
