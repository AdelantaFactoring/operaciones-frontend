import { Injectable } from '@angular/core';
import { CONTENT_TYPE } from 'app/shared/helpers/headers';
import { RequestMethod } from 'app/shared/helpers/request-method';
import { REGISTROPAGOS } from 'app/shared/helpers/url/cobranza';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavContentService {
  private requestMethod = new RequestMethod();

  constructor() { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${REGISTROPAGOS.listar}`,
      `?idConsulta=${payload.idConsulta}&codigoLiquidacion=${payload.codigoLiquidacion}&codigoSolicitud=${payload.codigoSolicitud}` +
      `&cliente=${payload.cliente}&pagProv=${payload.pagProv}&moneda=${payload.moneda}&idTipoOperacion=${payload.idTipoOperacion}&idEstado=${payload.idEstado}` +
      `&pagProvDet=${payload.pagProvDet}&nroDocumento=${payload.nroDocumento}&fechaOperacion=${payload.fechaOperacion}` +
      `&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }
}
