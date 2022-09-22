import { Injectable } from '@angular/core';
import { CONTENT_TYPE } from 'app/shared/helpers/headers';
import { RequestMethod } from 'app/shared/helpers/request-method';
import { DASHBOARD } from 'app/shared/helpers/url/dashboard';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcumEjecutivoService {
  private requestMethod = new RequestMethod();

  constructor() { }

  
  // listar2(payload): Observable<any> {
  //   return this.requestMethod.get(
  //     `${environment.apiUrl}${DASHBOARD.listar2}`,
  //     `?idConsulta=${payload.idConsulta}&cliente=${payload.cliente}&pagProv=${payload.pagProv}&moneda=${payload.moneda}` +
  //     `&pagProvDet=${payload.pagProvDet}&fechaDesde=${payload.fechaDesde}&fechaHasta=${payload.fechaHasta}`,
  //     {
  //       'Content-Type': CONTENT_TYPE.json
  //     }
  //   );
  // }

  listarDash(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${DASHBOARD.listarDash}`,
      `?idMoneda=${payload.idMoneda}&idEjecutivo=${payload.idEjecutivo}&fechaHasta=${payload.fechaHasta}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
