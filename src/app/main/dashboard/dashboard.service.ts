import { Injectable } from '@angular/core';
import { CONTENT_TYPE } from 'app/shared/helpers/headers';
import { RequestMethod } from 'app/shared/helpers/request-method';
import { DASHBOARD } from 'app/shared/helpers/url/dashboard';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private requestMethod = new RequestMethod();

  constructor() { }
  listarDash(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${DASHBOARD.listarDash}`,
      `?idMoneda=${payload.idMoneda}&idEjecutivo=${payload.idEjecutivo}&fechaHasta=${payload.fechaHasta}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  listarDashVencido(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${DASHBOARD.listarDashVencido}`,
      `?idMoneda=${payload.idMoneda}&idEjecutivo=${payload.idEjecutivo}&fechaDesde=${payload.fechaDesde}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  listarDashSaldo(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${DASHBOARD.listarDashSaldo}`,
      `?idMoneda=${payload.idMoneda}&idEjecutivo=${payload.idEjecutivo}&fechaHasta=${payload.fechaHasta}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  listarDashSaldo_Proyectado(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${DASHBOARD.listarDashSaldo_Proyectado}`,
      `?idMoneda=${payload.idMoneda}&idEjecutivo=${payload.idEjecutivo}&fechaDesde=${payload.fechaDesde}&fechaHasta=${payload.fechaHasta}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
