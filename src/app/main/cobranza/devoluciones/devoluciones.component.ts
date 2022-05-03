import { Component, OnInit } from '@angular/core';
import {Devolucion} from "../../../shared/models/cobranza/devolucion";
import {UtilsService} from "../../../shared/services/utils.service";
import {DevolucionesService} from "./devoluciones.service";

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.scss']
})
export class DevolucionesComponent implements OnInit {
  public contentHeader: object;
  public devoluciones: Devolucion[];

  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  constructor(private utilsService: UtilsService,
              private devolucionesService: DevolucionesService) {
    this.contentHeader = {
      headerTitle: 'Devoluciones',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Inicio',
            isLink: true,
            link: '/'
          },
          {
            name: 'Cobranza',
            isLink: false
          },
          {
            name: 'Devoluciones',
            isLink: false
          }
        ]
      }
    };
  }

  ngOnInit(): void {
    this.onListarDevolucion();
  }

  onListarDevolucion(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.devolucionesService.listar({
      idConsulta: 3,
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: Devolucion[]) => {
      this.devoluciones = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }
}
