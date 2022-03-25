import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitudCab } from 'app/shared/models/comercial/solicitudCab';
import { SolicitudDet } from 'app/shared/models/comercial/solicitudDet';
import { UtilsService } from 'app/shared/services/utils.service';
import Swal from 'sweetalert2';
import { SolicitudesService } from '../solicitudes.service';

@Component({
  selector: 'app-solicitudes-grilla',
  templateUrl: './solicitudes-grilla.component.html',
  styleUrls: ['./solicitudes-grilla.component.scss']
})
export class SolicitudesGrillaComponent implements OnInit {

  @Input() paramsURL: any;

  public submitted: boolean;
  public cambiarIcono: boolean = false;
  public solicitudes: SolicitudCab[];
  public solicitudDet: SolicitudDet[] = [];
  public solicitudDetForm: FormGroup;
  public rucPagProv: string;
  public pagProv: string;
  public search: string = '';
  public searchCli: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  get ReactiveDetForm(): any {
    return this.solicitudDetForm.controls;
  }

  constructor(private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private solicitudesService: SolicitudesService,
    private modalService: NgbModal
    ) { 
    this.solicitudDetForm = this.formBuilder.group({
      nroSolicitud: [''],
      moneda: [''],
      cedente: [''],
      rucCedente: [''],
      aceptante: [''],
      rucAceptante: [''],
      tipoOperacion: [''],
      bancoD: [''],
      ctaBancariaD: [''],
      tipoCtaBancariaD: [''],
      titularCtaBancariaD: [''],
      comisionCN: [''],
      comisionE: [''],
      financiamiento: [''],
      servicioCob: [''],
      servicioCus: [''],
      tnm: [''],
      tna: [''],
      tnmm: [''],
      tnam: [''],
      totalDesCIgv: [''],
      totalFacCIgv: [''],
      nombreC: [''],
      correoC: [''],
      correoConCopiaC: [''],
      telefonoC: [''],
      estado: ['']
    });
  }

  ngOnInit(): void {
    this.onListarSolicitudes(this.paramsURL);
  }

  onRefrescar(): void {
    this.onListarSolicitudes(this.paramsURL);
  }
  onListarSolicitudes(idSubConsulta): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesService.listar({
      idConsulta: 1,
      idSubConsulta: idSubConsulta,
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: SolicitudCab[]) => {
      this.solicitudes = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      console.log('list', response);
      
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onCambiarVisibilidadDetalleTodo() {
    this.cambiarIcono = !this.cambiarIcono;
    this.solicitudes.forEach(el => {
     // if(el.idTipoOperacion != 2)
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

  onDetalle(item, modal): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    //this.idTipoOperacion = item.idTipoOperacion;
    this.solicitudDet = item.solicitudDet;
    this.rucPagProv = item.idTipoOperacion == 1 ? "Ruc Pagador" : "Ruc Proveedor"
    this.pagProv = item.idTipoOperacion == 1 ? "Razón Social Pagador" : "Razón Social Proveedor"

    this.solicitudDetForm.controls.nroSolicitud.setValue(item.codigo);
    this.solicitudDetForm.controls.moneda.setValue(item.moneda);
    this.solicitudDetForm.controls.cedente.setValue(item.razonSocialCliente);
    this.solicitudDetForm.controls.rucCedente.setValue(item.rucCliente);
    this.solicitudDetForm.controls.aceptante.setValue(item.razonSocialPagProv);
    this.solicitudDetForm.controls.rucAceptante.setValue(item.rucPagProv);
    
    this.solicitudDetForm.controls.tipoOperacion.setValue(item.tipoOperacion);
    this.solicitudDetForm.controls.bancoD.setValue(item.bancoDestino);
    this.solicitudDetForm.controls.ctaBancariaD.setValue(item.nroCuentaBancariaDestino);
    this.solicitudDetForm.controls.tipoCtaBancariaD.setValue(item.tipoCuentaBancariaDestino);
    this.solicitudDetForm.controls.comisionCN.setValue(item.comisionCartaNotarial);
    
    this.solicitudDetForm.controls.comisionE.setValue(item.comisionEstructuracion);
    this.solicitudDetForm.controls.financiamiento.setValue(item.financiamiento);
    this.solicitudDetForm.controls.servicioCob.setValue(item.servicioCobranza);
    this.solicitudDetForm.controls.servicioCus.setValue(item.servicioCustodia);
    this.solicitudDetForm.controls.tnm.setValue(item.tasaNominalMensual);
    
    this.solicitudDetForm.controls.tna.setValue(item.tasaNominalAnual);
    this.solicitudDetForm.controls.tnmm.setValue(item.tasaNominalMensualMora);
    this.solicitudDetForm.controls.tnam.setValue(item.tasaNominalAnualMora);
    this.solicitudDetForm.controls.totalDesCIgv.setValue(item.totalDesembolsoConIGV);
    this.solicitudDetForm.controls.totalFacCIgv.setValue(item.totalFacConIGV);
    
    this.solicitudDetForm.controls.nombreC.setValue(item.nombreContacto);
    this.solicitudDetForm.controls.correoC.setValue(item.correoContacto);
    this.solicitudDetForm.controls.correoConCopiaC.setValue(item.conCopiaContacto);
    this.solicitudDetForm.controls.telefonoC.setValue(item.telefonoContacto);
    this.solicitudDetForm.controls.estado.setValue(item.estado);
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        size: 'lg',
        windowClass: 'my-class',
        animation: true,
        centered: false,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
    this.utilsService.blockUIStop();
  }

  onEliminar(idSolicitudCab, nroSolicitud): void {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Desea eliminar el registro '${nroSolicitud}'?, esta acción no podrá revertirse`,
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
        this.solicitudesService.eliminar({
          idSolicitudCab: idSolicitudCab,
          //idSolicitudDet: item.idSolicitudDet,
          idUsuarioAud: 1
        }).subscribe(response => {
          if (response.tipo === 1) {
            this.onListarSolicitudes(this.paramsURL);
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
  onEliminarDet(cab: SolicitudCab, item: SolicitudDet): void {
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
        this.solicitudesService.eliminarFactura({
          idSolicitudCab: item.idSolicitudCab,
          idSolicitudDet: item.idSolicitudDet,
          idUsuarioAud: 1
        }).subscribe(response => {
          if (response.tipo === 1) {
            cab.solicitudDet = cab.solicitudDet.filter(f => f.idSolicitudDet != item.idSolicitudDet);
            if (cab.solicitudDet.length === 0)
              this.onListarSolicitudes(this.paramsURL);
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
  onCancelar(): void {
    this.submitted = false;
    this.modalService.dismissAll();
  }
}
