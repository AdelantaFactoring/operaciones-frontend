import { Injectable } from '@angular/core';
import {RequestMethod} from "../../../shared/helpers/request-method";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";
import {AUDITORIA} from "../../../shared/helpers/url/seguridad";

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private requestMethod = new RequestMethod();

  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${AUDITORIA.listar}`,
      `?idTabla=${payload.idTabla}&desde=${payload.desde}&hasta=${payload.hasta}` +
      `&idUsuario=${payload.idUsuario}&idAccion=${payload.idAccion}` +
      `&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  exportar(payload): Observable<any> {
    return this.requestMethod.getFile(
      `${environment.apiUrl}${AUDITORIA.exportar}`,
      `?idTabla=${payload.idTabla}&desde=${payload.desde}&hasta=${payload.hasta}` +
      `&idUsuario=${payload.idUsuario}&idAccion=${payload.idAccion}` +
      `&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`
    );
  }
}
