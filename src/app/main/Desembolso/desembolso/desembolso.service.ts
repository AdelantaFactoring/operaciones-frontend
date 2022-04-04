import { Injectable } from '@angular/core';
import { RequestMethod } from 'app/shared/helpers/request-method';
import { Observable } from 'rxjs';
import { DESEMBOLSO } from 'app/shared/helpers/url/desembolso';
import { environment } from 'environments/environment';
import { CONTENT_TYPE } from 'app/shared/helpers/headers';

@Injectable({
  providedIn: 'root'
})
export class DesembolsoService {
  private requestMethod = new RequestMethod();
  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${DESEMBOLSO.listar}`,
      `?idConsulta=${payload.idConsulta}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
  actualizar(payload): Observable<any> {
    return this.requestMethod.put(
      `${environment.apiUrl}${DESEMBOLSO.actualizar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
