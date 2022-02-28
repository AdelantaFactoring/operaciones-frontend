import { Injectable } from '@angular/core';
import {RequestMethod} from "../../../shared/helpers/request-method";
import {environment} from "environments/environment";
import {CLIENTEPAGADOR} from "../../../shared/helpers/url/comercial";
import {Observable} from "rxjs";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private requestMethod = new RequestMethod();
  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${CLIENTEPAGADOR.listar}`,
      `?idTipo=${payload.idTipo}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
