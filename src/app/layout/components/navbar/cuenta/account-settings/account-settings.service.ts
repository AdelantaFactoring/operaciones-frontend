import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import {RequestMethod} from '../../../../../shared/helpers/request-method';
import {environment} from '../../../../../../environments/environment';
import {CONTENT_TYPE} from '../../../../../shared/helpers/headers';
// import { USUARIOS } from '../../../../../shared/helpers/url';

import { BehaviorSubject, Observable } from 'rxjs';


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

  // updateClave(payload): Observable<any> {
  //   return this.requestMethod.post(
  //     `${environment.apiUrl}${USUARIOS.updateClave}`,
  //     payload,
  //     {
  //       'Content-Type': CONTENT_TYPE.json
  //     }
  //   );
  // }

  // updateCuenta(payload): Observable<any> {
  //   return this.requestMethod.post(
  //     `${environment.apiUrl}${USUARIOS.updateCuenta}`,
  //     payload,
  //     {
  //       'Content-Type': CONTENT_TYPE.json
  //     }
  //   );
  // }
}
