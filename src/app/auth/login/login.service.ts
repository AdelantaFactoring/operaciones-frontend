import { Injectable } from '@angular/core';
import { CONTENT_TYPE } from 'app/shared/helpers/headers';
import { RequestMethod } from 'app/shared/helpers/request-method';
import { USUARIO } from 'app/shared/helpers/url/seguridad';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private requestMethod = new RequestMethod();

  constructor() { }

  login(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${USUARIO.login}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  isAuth(): boolean {
    return sessionStorage.getItem('currentUser') ? true : false;
  }
}
