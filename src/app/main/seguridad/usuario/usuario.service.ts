import { Injectable } from '@angular/core';
import { CONTENT_TYPE } from 'app/shared/helpers/headers';
import { RequestMethod } from 'app/shared/helpers/request-method';
import { USUARIO } from 'app/shared/helpers/url/seguridad';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private requestMethod = new RequestMethod();

  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${USUARIO.listar}`,
      `?idEmpresa=${payload.idEmpresa}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  eliminar(payload): Observable<any> {
    return this.requestMethod.delete(
      `${environment.apiUrl}${USUARIO.eliminar}`,
      `?idEmpresa=${payload.idEmpresa}&idUsuario=${payload.idUsuario}&idUsuarioAud=${payload.idUsuarioAud}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  guardar(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${USUARIO.guardar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  combo(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${USUARIO.combo}`,
      `?idEmpresa=${payload.idEmpresa}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

}
