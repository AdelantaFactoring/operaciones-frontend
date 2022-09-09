import { Injectable } from '@angular/core';
import { CONTENT_TYPE } from 'app/shared/helpers/headers';
import { RequestMethod } from 'app/shared/helpers/request-method';
import { DASHBOARD } from 'app/shared/helpers/url/dashboard';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EjecutivoService {
  private requestMethod = new RequestMethod();

  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${DASHBOARD.listar}`,
      `?idConsulta=${payload.idConsulta}&cliente=${payload.cliente}&pagProv=${payload.pagProv}&moneda=${payload.moneda}` +
      `&pagProvDet=${payload.pagProvDet}&fechaDesde=${payload.fechaDesde}&fechaHasta=${payload.fechaHasta}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  listar2(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${DASHBOARD.listar2}`,
      `?idConsulta=${payload.idConsulta}&cliente=${payload.cliente}&pagProv=${payload.pagProv}&moneda=${payload.moneda}` +
      `&pagProvDet=${payload.pagProvDet}&fechaDesde=${payload.fechaDesde}&fechaHasta=${payload.fechaHasta}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
