import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { TIPOCAMBIO } from "../../../shared/helpers/url/tipo-cambio";
import { CONTENT_TYPE } from "../../../shared/helpers/headers";
import { RequestMethod } from "../../../shared/helpers/request-method";

@Injectable({
    providedIn: 'root'
})
export class TipoCambioService {
    constructor(private requestMethod: RequestMethod) { }

    listar(payload): Observable<any> {
        return this.requestMethod.get(
            `${environment.apiUrl}${TIPOCAMBIO.listar}`,
            `?&startDate=${payload.startDate}&endDate=${payload.endDate}&idUsuario=${payload.idUsuario}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
            {
                'Content-Type': CONTENT_TYPE.json
            }
        );
    }

    guardar(payload): Observable<any> {
        return this.requestMethod.post(
          `${environment.apiUrl}${TIPOCAMBIO.guardar}`,
          payload,
          {
            'Content-Type': CONTENT_TYPE.json
          }
        )
      }
}
