import { Injectable } from '@angular/core';
import { CONTENT_TYPE } from 'app/shared/helpers/headers';
import { RequestMethod } from 'app/shared/helpers/request-method';
import { MENU } from 'app/shared/helpers/url/seguridad';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListaPermisoService {
  private requestMethod = new RequestMethod();

  constructor() { }

  listar(): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${MENU.listar}`,
      ``,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  listarPorPerfil(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${MENU.listarPorPerfil}`,
      `?idEmpresa=${payload.idEmpresa}&idPerfil=${payload.idPerfil}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  listarPorUsuario(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${MENU.listarPorUsuario}`,
      `?idEmpresa=${payload.idEmpresa}&idUsuario=${payload.idUsuario}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
