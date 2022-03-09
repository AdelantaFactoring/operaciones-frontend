import { Component, OnInit } from '@angular/core';
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {UtilsService} from "../../../shared/services/utils.service";
import {ConsultaFactrackService} from "./consulta-factrack.service";

@Component({
  selector: 'app-consulta-factrack',
  templateUrl: './consulta-factrack.component.html',
  styleUrls: ['./consulta-factrack.component.scss']
})
export class ConsultaFactrackComponent implements OnInit {
  public contentHeader: object;
  public solicitudes: SolicitudCab[];
  public seleccionarTodo: boolean = false;
  public cambiarIcono: boolean = false;
  public search: string = '';

  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  constructor(private utilsService: UtilsService,
              private consultaFactrackService: ConsultaFactrackService) {
    this.contentHeader = {
      headerTitle: 'Consulta Factrack',
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
            name: 'Operaciones',
            isLink: false
          },
          {
            name: 'Consulta Factrack',
            isLink: false
          }
        ]
      }
    };
  }

  ngOnInit(): void {
    this.onListarSolicitudes();
  }

  onListarSolicitudes(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.consultaFactrackService.listar({
      idConsulta: 3,
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: SolicitudCab[]) => {
      this.solicitudes = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onSeleccionarTodo(): void {
    this.solicitudes.forEach(el => {
      el.seleccionado = this.seleccionarTodo;
    })
  }

  onRefrescar(): void {
    this.onListarSolicitudes();
  }

  onCambiarVisibilidadDetalleTodo() {
    this.cambiarIcono = !this.cambiarIcono;
    this.solicitudes.forEach(el => {
      el.cambiarIcono = this.cambiarIcono;
      document.getElementById('tr' + el.idSolicitudCab).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
      document.getElementById('detail' + el.idSolicitudCab).style.display = (el.cambiarIcono) ? "block" : "none";
    })
  }

  onCambiarVisibilidadDetalle(item: any) {
    item.cambiarIcono = !item.cambiarIcono;
    document.getElementById('tr' + item.idSolicitudCab).style.visibility = (item.cambiarIcono) ? "visible" : "collapse";
    document.getElementById('detail' + item.idSolicitudCab).style.display = (item.cambiarIcono) ? "block" : "none";
  }
}
