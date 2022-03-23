import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {NgbCalendar, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder} from "@angular/forms";
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {ColumnMode} from '@swimlane/ngx-datatable';
import {RespuestaPagadorService} from "./respuesta-pagador.service";
import {SolicitudDet} from "../../../shared/models/comercial/solicitudDet";
import Swal from "sweetalert2";

@Component({
  selector: 'app-respuesta-pagador',
  templateUrl: './respuesta-pagador.component.html',
  styleUrls: ['./respuesta-pagador.component.scss']
})
export class RespuestaPagadorComponent implements OnInit {
  public contentHeader: object;
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
      idConsulta: 2,
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

  onFilas(facturas: any): string {
    let filas = "";
    for (const item of facturas) {
      filas += `<tr><td>${item.codigoSolicitud}</td><td>${item.codigoFactura}</td><td>${item.codigoRespuesta}</td></tr>`
    }
    return filas;
  }

  onInfoRespuesta(data: any, idEstado: number): void {
    let facturas = JSON.parse(data);
    Swal.fire({
      title: 'Información',
      html: `
            <p style="text-align: justify">Algunas facturas se han registrado correctamente y otras han tenido problemas para registrar</p>
            <p style="text-align: justify">La(s) siguiente(s) solicitude(s) contiene(n) factura(s) con problemas de registro:</p>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                <tr>
                  <th>N° Solicitud</th>
                  <th>N° Factura</th>
                  <th>Código Respuesta${idEstado === 3 ? 'Cavali' : ''}</th>
                  ${idEstado === 3 ? '<th>Código Respuesta Anotación</th>' : ''}
                </tr>
                </thead>
                <tbody>
                ${this.onFilas(facturas)}
                </tbody>
              </table>
            </div>
            <p style="text-align: justify">Consulte las facturas de las solicitudes para verificar su estado. Utilice el código de respuesta como referencia para su validación.</p>`,
      icon: 'info',
      width: '700px',
      showCancelButton: false,
      confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
      customClass: {
        confirmButton: 'btn btn-info',
      },
    }).then(result => {
      if (result.value) {

      }
    });
  }

  onRegistrarFacturas(idEstado: number): void {
    let solicitudes = this.solicitudes.filter(f => f.seleccionado);
    if (solicitudes.length == 0) {
      this.utilsService.showNotification("Seleccione una o varias solicitudes", "", 2);
      return;
    }

    solicitudes.forEach(el => {
      el.flagCavali = true;
      el.idTipoRegistro = idEstado === 4 ? 1 : 2;
      el.idEstado = idEstado;
      el.idUsuarioAud = 1;
    });

    this.utilsService.blockUIStart('Registrando...');
    this.respuestaPagadorService.cambiarEstado(solicitudes).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Información registrada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarSolicitudes();
      } else if (response.tipo == 2) {
        this.utilsService.blockUIStop();
        Swal.fire({
          title: 'Advertencia',
          html: `<p style="text-align: justify">La(s) siguiente(s) solicitude(s) contiene(n) factura(s) sin confirmación de pago:</p>
                 <p style="text-align: justify">Codigo(s):<br>
                    ${response.mensaje.replace(/,/g, "<br>")}</p>`,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
          customClass: {
            confirmButton: 'btn btn-warning',
          }
        }).then(result => {
          if (result.value) {

          }
        });
      } else if (response.tipo == 0) {
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
      } else if (response.tipo == 3) {
        this.onInfoRespuesta(response.mensaje, idEstado);
        this.onListarSolicitudes();
      }
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
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
    });
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
    item.idUsuarioAud = 1;
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

  onEliminar(cab: SolicitudCab, item: SolicitudDet): void {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Desea eliminar el registro '${item.nroDocumento}'?, esta acción no podrá revertirse`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-primary'
      }
    }).then(result => {
      if (result.value) {
        this.utilsService.blockUIStart('Eliminando...');
        this.respuestaPagadorService.eliminarFactura({
          idSolicitudCab: item.idSolicitudCab,
          idSolicitudDet: item.idSolicitudDet,
          idUsuarioAud: 1
        }).subscribe(response => {
          if (response.tipo === 1) {
            cab.solicitudDet = cab.solicitudDet.filter(f => f.idSolicitudDet != item.idSolicitudDet);
            if (cab.solicitudDet.length === 0)
              this.onListarSolicitudes();
            this.utilsService.showNotification('Registro eliminado correctamente', 'Confirmación', 1);
            this.utilsService.blockUIStop();
          } else if (response.tipo === 2) {
            this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
          } else {
            this.utilsService.showNotification(response.mensaje, 'Error', 3);
          }
          this.utilsService.blockUIStop();
        }, error => {
          this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
          this.utilsService.blockUIStop();
        });
      }
    });
  }
}
