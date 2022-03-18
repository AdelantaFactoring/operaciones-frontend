import {Injectable} from '@angular/core';
import {RequestMethod} from "../../../../shared/helpers/request-method";
import {environment} from "environments/environment";
import {SOLICITUD, CLIENTE} from "../../../../shared/helpers/url/comercial";
import {TABLAMAESTRA} from "../../../../shared/helpers/url/shared";
import {Observable} from "rxjs";
import {CONTENT_TYPE} from "../../../../shared/helpers/headers";
import { TablaMaestra } from 'app/shared/models/shared/tabla-maestra';


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

  clienteObtener(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${CLIENTE.obtener}`,
      `?idCliente=${payload.idCliente}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  listarTablaMaestra(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${TABLAMAESTRA.listar}`,
      `?idTabla=${payload.idTabla}&idColumna=${payload.idColumna}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  guardarCT(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${SOLICITUD.guardarCT}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  generarCarpeta(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${SOLICITUD.generarCarpeta}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
