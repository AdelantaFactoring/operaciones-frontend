import {Component, OnInit} from '@angular/core';
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {UtilsService} from "../../../shared/services/utils.service";
import {CheckListService} from "./check-list.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SolicitudDet} from "../../../shared/models/comercial/solicitudDet";
import {FileUploader} from "ng2-file-upload";
import {environment} from "../../../../environments/environment";
import {SOLICITUD} from "../../../shared/helpers/url/comercial";

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.scss']
})
export class CheckListComponent implements OnInit {
  public contentHeader: object;
  public solicitudes: SolicitudCab[];
  public detalle: SolicitudDet[];
  public solicitudForm: FormGroup;
  public seleccionarTodo: boolean = false;
  public cambiarIcono: boolean = false;
  public search: string = '';
  public submitted: boolean;

  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  public hasBaseDropZoneOver: boolean = false;
  public archivoDeudaCoactiva: FileUploader = new FileUploader({
    url: `${environment.apiUrl}${SOLICITUD.upload}`,
    queueLimit: 2,
    isHTML5: true
  });

  public archivosSustento: FileUploader = new FileUploader({
    url: `${environment.apiUrl}${SOLICITUD.upload}`,
    isHTML5: true
  });

  get ReactiveIUForm(): any {
    return this.solicitudForm.controls;
  }

  constructor(private utilsService: UtilsService,
              private checkListService: CheckListService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,) {
    this.contentHeader = {
      headerTitle: 'Check list',
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
            name: 'Comercial',
            isLink: false
          },
          {
            name: 'Check list',
            isLink: false
          }
        ]
      }
    };
    this.solicitudForm = this.formBuilder.group({
      idSolicitudCab: [0],
      codigo: [{value: '', disabled: true}],
      rucCedente: [{value: '', disabled: true}],
      razonSocialCedente: [{value: '', disabled: true}],
      rucAceptante: [{value: '', disabled: true}],
      razonSocialAceptante: [{value: '', disabled: true}],
      moneda: [{value: '', disabled: true}],
      tipoOperacion: [{value: '', disabled: true}],
      comisionEstructuracion: [{value: 0, disabled: true}],
      gastosContrato: [{value: 0, disabled: true}],
      comisionCartaNotarial: [{value: 0, disabled: true}],
      servicioCobranza: [{value: 0, disabled: true}],
      servicioCustodia: [{value: 0, disabled: true}],
      gastoVigenciaPoder: [0],
      nombreContacto: [{value: '', disabled: true}],
      telefonoContacto: [{value: '', disabled: true}],
      correoContacto: [{value: '', disabled: true}],
      conCopiaContacto: [''],
      titularCuentaBancariaDestino: [{value: '', disabled: true}],
      monedaCuentaBancariaDestino: [{value: '', disabled: true}],
      bancoDestino: [{value: '', disabled: true}],
      nroCuentaBancariaDestino: [{value: '', disabled: true}],
      cciDestino: [{value: '', disabled: true}],
      tipoCuentaBancariaDestino: [{value: '', disabled: true}],
      deudaCoactiva: [false],
      archivoDeudaCoactiva: [''],
      deudaCoactivaRegularizada: [false],
      archivoDeudaCoactivaRegularizada: [''],
      archivoReporteSentinel: [''],
      archivoCartaConfirming: [''],
      archivoChequeGarantia: ['']
    });
  }

  ngOnInit(): void {
    this.onListarSolicitudes();
  }

  onListarSolicitudes(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.checkListService.listar({
      idConsulta: 4,
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

  onCambiarFondoResguardo(item: SolicitudDet) {
    item.editado = true;
  }

  onRefrescar(): void {
    this.onListarSolicitudes();
  }

  onCambiarVisibilidadDetalleTodo(): void {
    this.cambiarIcono = !this.cambiarIcono;
    this.solicitudes.forEach(el => {
      el.cambiarIcono = this.cambiarIcono;
      document.getElementById('tr' + el.idSolicitudCab).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
      document.getElementById('detail' + el.idSolicitudCab).style.display = (el.cambiarIcono) ? "block" : "none";
    })
  }

  onCambiarVisibilidadDetalle(item: any): void {
    item.cambiarIcono = !item.cambiarIcono;
    document.getElementById('tr' + item.idSolicitudCab).style.visibility = (item.cambiarIcono) ? "visible" : "collapse";
    document.getElementById('detail' + item.idSolicitudCab).style.display = (item.cambiarIcono) ? "block" : "none";
  }

  onValidar(item: SolicitudCab, modal: any): void {
    //this.solicitudForm.controls.idSolicitudCab.setValue(item.idSolicitudCab);
    // this.clienteForm.controls.ruc.setValue(item.ruc);
    // this.clienteForm.controls.razonSocial.setValue(item.razonSocial);
    // this.clienteForm.controls.direccionPrincipal.setValue(item.direccionPrincipal);
    // this.clienteForm.controls.direccionFacturacion.setValue(item.direccionFacturacion);
    // this.clienteForm.controls.cedente.setValue(item.cedente);
    // this.clienteForm.controls.aceptante.setValue(item.aceptante);
    // this.clienteForm.controls.capitalTrabajo.setValue(item.capitalTrabajo);
    this.detalle = item.solicitudDet;
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        //size: 'lg',
        windowClass: 'my-class',
        animation: true,
        centered: false,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onCancelar(): void {
    this.modalService.dismissAll();
  }

  onGuardar(): void {
    console.log(this.solicitudForm.controls.archivoDeudaCoactiva.value);
  }

  onCambioArchivoDeudaCoactiva(): void {
    console.log(this.archivosSustento.queue);
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  onSeleccioneContacto(modal): void {
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        //size: 'lg',
        windowClass: 'my-class',
        animation: true,
        centered: false,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onSeleccioneCuenta(modal): void {
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        //size: 'lg',
        windowClass: 'my-class',
        animation: true,
        centered: false,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onCancelarContacto(modal): void {
    modal.dismiss('Cross click');
  }
}
