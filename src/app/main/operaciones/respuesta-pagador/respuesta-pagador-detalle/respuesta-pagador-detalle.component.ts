import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { User } from 'app/shared/models/auth/user';
import { SolicitudCab } from 'app/shared/models/comercial/solicitudCab';
import { SolicitudDet } from 'app/shared/models/comercial/solicitudDet';
import { UtilsService } from 'app/shared/services/utils.service';
import Swal from "sweetalert2";
import { RespuestaPagadorService } from '../respuesta-pagador.service';

@Component({
  selector: 'app-respuesta-pagador-detalle',
  templateUrl: './respuesta-pagador-detalle.component.html',
  styleUrls: ['./respuesta-pagador-detalle.component.scss']
})
export class RespuestaPagadorDetalleComponent implements OnInit {
  @Input() solicitud: SolicitudCab;
  @Output() regresarEvent: EventEmitter<unknown> = new EventEmitter<unknown>();
  public currentUser: User;

  contentHeader: ContentHeader;
  data: SolicitudDet[] = [];
  oldSolicitudDet: SolicitudDet[];

  constructor(
    private utilsService: UtilsService,
    private respuestaPagadorService: RespuestaPagadorService
  ) {
    this.contentHeader = {
      headerTitle: 'Respuesta Pagador - Detalle',
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
          },
          {
            name: 'Detalle',
            isLink: false
          }
        ]
      }
    };
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.oldSolicitudDet = this.solicitud.solicitudDet.map(det => ({...det}));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.solicitud.previousValue !== changes.solicitud.currentValue) {
      this.data = this.solicitud.solicitudDet;
    }
  }

  onBuscar({ target }: Event) {
    const _value = target['value'].toLowerCase();
    this.data = this.solicitud?.solicitudDet.filter(f =>
      Object.values(f).some(
        value => String(value)
          .toLowerCase()
          .includes(_value)
      )
    );
  }

  onRegresar(): void {
    this.regresarEvent.emit();
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
      } else if (el.netoConfirmado > el.montoConIGV) {
        this.utilsService.showNotification(`El monto neto confirmado no debe ser mayor a ${Intl.NumberFormat('es-PE').format(el.montoConIGV)} para el documento ${el.nroDocumento}`, "", 2);
        valido = false;
        return;
      }
    }

    if (!valido) return;
    item.idUsuarioAud = this.currentUser.idUsuario;
    item.solicitudDet = item.solicitudDet.filter(f => f.editado);

    this.utilsService.blockUIStart('Guardando...');
    this.respuestaPagadorService.confirmarPago(item).subscribe(response => {
      if (response.tipo == 1) {
        item.solicitudDet.forEach(res => {
          res.editado = false;
        });

        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        // this.onListarSolicitudes();
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
        let newCab = { ...cab };
        newCab.solicitudDet = newCab.solicitudDet.filter(f => f.idSolicitudDet === item.idSolicitudDet);
        newCab.idUsuarioAud = this.currentUser.idUsuario;
        this.respuestaPagadorService.eliminarFactura(newCab).subscribe(response => {
          if (response.tipo === 1) {
            cab.solicitudDet = cab.solicitudDet.filter(f => f.idSolicitudDet != item.idSolicitudDet);
            if (cab.solicitudDet.length === 0)
              // this.onListarSolicitudes();
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

  onCambiarFechaConfirmado($event: any, item: SolicitudDet): void {
    item.fechaConfirmadoFormat = `${String($event.day).padStart(2, '0')}/${String($event.month).padStart(2, '0')}/${$event.year}`;
    item.editado = true;
  }

  onCambiarMontoConfirmado(item: SolicitudDet, cab: SolicitudCab) {
    item.editado = true;
    let porcentajeFR = (100 - cab.financiamiento) / 100;
    item.fondoResguardo = item.netoConfirmado * porcentajeFR;
  }

  onDeshacerCambios(): void {
    // this.solicitud = { ...this.oldSolicitud };
    const solicitudDetEdit = this.solicitud.solicitudDet.filter(x => x.editado); 
    for (const item of solicitudDetEdit) {
      this.oldSolicitudDet.forEach(x => {
        if (item.idSolicitudDet === x.idSolicitudDet) {
          item.netoConfirmado = x.netoConfirmado;
          item.fechaConfirmado = x.fechaConfirmado;
          item.editado = false;
        }
      });
    }
  }
}
