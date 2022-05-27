import { Injectable } from '@angular/core';
import {RequestMethod} from "../../../shared/helpers/request-method";
import {HttpClient} from "@angular/common/http";
import {InjectorInstance} from "../../../app.module";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";
import {DOCUMENTOS} from "../../../shared/helpers/url/facturacion";

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  private requestMethod = new RequestMethod();
  private http: HttpClient;

  constructor() {
    this.http = InjectorInstance.get<HttpClient>(HttpClient);
  }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${DOCUMENTOS.listar}`,
      `?search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  guardar(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${DOCUMENTOS.guardar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  firmaPublicacion(payload): Observable<any> {
    return this.requestMethod.post(
      `${environment.apiUrl}${DOCUMENTOS.firmaPublicacion}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
