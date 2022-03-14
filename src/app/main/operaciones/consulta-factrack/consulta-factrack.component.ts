import {Component, OnInit} from '@angular/core';
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {UtilsService} from "../../../shared/services/utils.service";
import {ConsultaFactrackService} from "./consulta-factrack.service";
import Swal from "sweetalert2";
import {SolicitudDet} from "../../../shared/models/comercial/solicitudDet";

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

  onEliminar(cab: SolicitudCab, item: SolicitudDet): void {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Desea eliminar el registro '${item.nroDocumento}'?, esta acción no podrá revertirse`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary'
      }
    }).then(result => {
      if (result.value) {
        this.utilsService.blockUIStart('Eliminando...');
        this.consultaFactrackService.eliminarFactura({
          idSolicitudCab: item.idSolicitudCab,
          idSolicitudDet: item.idSolicitudDet,
          usuarioAud: 'superadmin'
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

  onConfirmar(idEstado: number): void {
    let solicitudes = this.solicitudes.filter(f => f.seleccionado);
    if (solicitudes.length == 0) {
      this.utilsService.showNotification("Seleccione una o varias solicitudes", "", 2);
      return;
    }

    solicitudes.forEach(el => {
      el.idEstado = idEstado;
      el.usuarioAud = "superadmin";
    });

    this.utilsService.blockUIStart('Confirmando...');
    this.consultaFactrackService.cambiarEstado(solicitudes).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Información registrada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarSolicitudes();
      } else if (response.tipo == 2) {
        this.utilsService.blockUIStop();
        let codigo = response.mensaje.split(',');
        Swal.fire({
          title: 'Adertencia',
          html: `<p style="text-align: justify">La(s) siguiente(s) solicitude(s) contiene(n) factura(s) en estado de disconformidad:</p>
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
      } else {
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
      }
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }
}
