import { Injectable } from '@angular/core';
import { CONTENT_TYPE } from 'app/shared/helpers/headers';
import { RequestMethod } from 'app/shared/helpers/request-method';
import { PERFIL } from 'app/shared/helpers/url/seguridad';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private requestMethod = new RequestMethod();

  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${PERFIL.listar}`,
      `?idEmpresa=${payload.idEmpresa}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  eliminar(payload): Observable<any> {
    return this.requestMethod.delete(
      `${environment.apiUrl}${PERFIL.eliminar}`,
      `?idEmpresa=${payload.idEmpresa}&idPerfil=${payload.idPerfil}&idUsuarioAud=${payload.idUsuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  guardar(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${PERFIL.guardar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  combo(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${PERFIL.combo}`,
      `?idEmpresa=${payload.idEmpresa}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
