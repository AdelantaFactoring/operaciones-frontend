import {Component, OnInit} from '@angular/core';
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {UtilsService} from "../../../shared/services/utils.service";
import {ConsultaFactrackService} from "./consulta-factrack.service";
import Swal from "sweetalert2";
import {SolicitudDet} from "../../../shared/models/comercial/solicitudDet";
import {User} from "../../../shared/models/auth/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-consulta-factrack',
  templateUrl: './consulta-factrack.component.html',
  styleUrls: ['./consulta-factrack.component.scss']
})
export class ConsultaFactrackComponent implements OnInit {
  public currentUser: User;
  public contentHeader: object;
  public solicitudes: SolicitudCab[];
  public seleccionarTodo: boolean = false;
  public cambiarIcono: boolean = false;
  public search: string = '';

  public solicitud: SolicitudCab;

  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;
  public verDetalle: boolean;

  constructor(private utilsService: UtilsService,
              private consultaFactrackService: ConsultaFactrackService,
              private router: Router) {
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
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.onListarSolicitudes();
  }

  onListarSolicitudes(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.consultaFactrackService.listar({
      idConsulta: 3,
      idSubConsulta: 0,
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
    this.solicitudes.filter(f => f.idEstado === 3).forEach(el => {
      el.seleccionado = this.seleccionarTodo;
    })
  }

  onRefrescar(): void {
    this.onListarSolicitudes();
  }

  onCambiarVisibilidadDetalle(item: SolicitudCab) {
    this.solicitud = item;
    this.verDetalle = true;
    // this.consultaFactrackService.setSolicitud(item);
    // this.router.navigateByUrl('/operaciones/consultaFactrack/detalle');
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
        // @ts-ignore
        let newCab = {...cab};
        newCab.solicitudDet = newCab.solicitudDet.filter(f => f.idSolicitudDet === item.idSolicitudDet);
        newCab.idUsuarioAud = this.currentUser.idUsuario;
        this.consultaFactrackService.eliminarFactura(newCab).subscribe(response => {
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
    // @ts-ignore
    let solicitudes = [...this.solicitudes.filter(f => f.seleccionado)];
    if (solicitudes.length == 0) {
      this.utilsService.showNotification("Seleccione una o varias solicitudes", "", 2);
      return;
    }

    solicitudes.forEach(el => {
      el.idEstado = idEstado;
      el.idUsuarioAud = this.currentUser.idUsuario
    });

    this.utilsService.blockUIStart('Confirmando...');
    this.consultaFactrackService.cambiarEstado(solicitudes).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Información registrada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarSolicitudes();
      } else if (response.tipo == 2) {
        this.utilsService.blockUIStop();

        Swal.fire({
          title: 'Advertencia',
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

  onActualizarEstadoFactura(): void {
    this.utilsService.blockUIStart("Actualizando...");
    this.consultaFactrackService.consultarConformidad({
      idUsuarioAud: this.currentUser.idUsuario
    }).subscribe(response => {
      if (response.tipo === 1) {
        this.onListarSolicitudes();
        this.utilsService.showNotification('Información Actualizada', 'Confirmación', 1);
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

  onRegresar() {
    this.solicitud = null;
    this.verDetalle = false;
  }
}
