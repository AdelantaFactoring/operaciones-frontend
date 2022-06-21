import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import {RequestMethod} from '../../../../../shared/helpers/request-method';
import {environment} from '../../../../../../environments/environment';
import {CONTENT_TYPE} from '../../../../../shared/helpers/headers';
// import { USUARIOS } from '../../../../../shared/helpers/url';

import { BehaviorSubject, Observable } from 'rxjs';
import { USUARIO } from 'app/shared/helpers/url/seguridad';


@Injectable({
  providedIn: 'root'
})
export class AccountSettingsService {
  private requestMethod = new RequestMethod();
  constructor(private _httpClient: HttpClient) {
  }

  // getCuenta(payload): Observable<any> {
  //   return this.requestMethod.get(
  //     `${environment.apiUrl}${USUARIOS.getCuenta}`,
  //     `?idAsociacion=${payload.idAsociacion}&idUsuario=${payload.idUsuario}`,
  //     {
  //       'Content-Type': CONTENT_TYPE.json
  //     }
  //   );
  // }

  cambioClave(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${USUARIO.cambioClave}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  ActualizarDatos(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${USUARIO.actualizarDatos}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
