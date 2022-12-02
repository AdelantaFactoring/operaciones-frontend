import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {TABLAMAESTRA} from "../../../shared/helpers/url/shared";
import {CONTENT_TYPE} from "../../../shared/helpers/headers";
import {RequestMethod} from "../../../shared/helpers/request-method";

@Injectable({
  providedIn: 'root'
})
export class MaestrosService {
  constructor(private requestMethod: RequestMethod) { }

  listar(payload): Observable<any> {
    return this.requestMethod.get(
      `${environment.apiUrl}${TABLAMAESTRA.listar2}`,
      `?&idTabla=${payload.idTabla}&search=${payload.search}&pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    );
  }

  async guardarAsync(payload): Promise<any> {
    return await this.requestMethod.putAsync(
      `${environment.apiUrl}${TABLAMAESTRA.guardar}`,
      payload,
      {
        'Content-Type': CONTENT_TYPE.json
      }
    )
  }
}
