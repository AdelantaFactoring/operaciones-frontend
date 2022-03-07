import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {NgbCalendar, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder} from "@angular/forms";
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {ColumnMode} from '@swimlane/ngx-datatable';
import {RespuestaPagadorService} from "./respuesta-pagador.service";
import {SolicitudDet} from "../../../shared/models/comercial/solicitudDet";

@Component({
  selector: 'app-respuesta-pagador',
  templateUrl: './respuesta-pagador.component.html',
  styleUrls: ['./respuesta-pagador.component.scss']
})
export class RespuestaPagadorComponent implements OnInit {
  public contentHeader: object;
  public ColumnMode = ColumnMode;
  public submitted: boolean;
  public solicitudes: SolicitudCab[] = [];
  public seleccionarTodo: boolean = false;
  public cambiarIcono: boolean = false;
  //Paginación
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;
  public search: string = '';
  @ViewChild('tableRowDetails') tableRowDetails: any;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private calendar: NgbCalendar,
    private respuestaPagadorService: RespuestaPagadorService
  ) {
    this.contentHeader = {
      headerTitle: 'Respuesta Pagador',
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
            name: 'Respuesta Pagador',
            isLink: false
          }
        ]
      }
    };
  }

  ngOnInit(): void {
    this.onListarSolicitudes();
  }

  rowDetailsToggleExpand(row) {
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }

  onListarSolicitudes(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.respuestaPagadorService.listar({
      idEstado: 1,
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

  onRegistrarFacturas(): void {
    console.log(this.solicitudes);
  }

  onTransformarFecha(fecha: string): any {
    return {
      year: Number(fecha.split('/')[2]),
      month: Number(fecha.split('/')[1]),
      day: Number(fecha.split('/')[0])
    };
  }

  onCambiarFechaConfirmado($event: any, item: SolicitudDet): void {
    item.fechaConfirmadoFormat = `${String($event.day).padStart(2, '0')}/${String($event.month).padStart(2, '0')}/${$event.year}`;
    item.editado = true;
  }

  onCambiarMontoConfirmado(item: SolicitudDet) {
    item.editado = true;
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

  onRefrescar(): void {
    this.onListarSolicitudes();
  }

  onSeleccionarTodo(): void {
    this.solicitudes.forEach(el => {
      el.seleccionado = this.seleccionarTodo;
    })
  }

  onGuardarCambios(item: SolicitudCab): void {
    if (item.solicitudDet.filter(f => f.editado).length == 0) return;

    let valido = true;

    for (let el of item.solicitudDet.filter(f => f.editado)) {
      if (el.fechaConfirmadoFormat.length === 0) {
        this.utilsService.showNotification("Seleccione Fecha", "", 2);
        valido = false;
        return;
      } else if (el.netoConfirmado <= 0) {
        this.utilsService.showNotification("Ingrese Neto Confirmado", "", 2);
        valido = false;
        return;
      }
    }

    if (!valido) return;
    item.usuarioAud = "superadmin";
    item.solicitudDet = item.solicitudDet.filter(f => f.editado);

    this.utilsService.blockUIStart('Guardando...');
    this.respuestaPagadorService.confirmarPago(item).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarSolicitudes();
      } else if (response.tipo == 2) {
        this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
        this.utilsService.blockUIStop();
      } else {
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
      }
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onDeshacerCambios(): void {
    this.onRefrescar();
  }
}
