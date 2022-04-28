import {Component, OnInit} from '@angular/core';
import {LiquidacionCab} from "../../../shared/models/operaciones/liquidacion-cab";
import {UtilsService} from "../../../shared/services/utils.service";
import {RegistroPagosService} from "./registro-pagos.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LiquidacionDet} from "../../../shared/models/operaciones/liquidacion-det";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {LiquidacionPago} from 'app/shared/models/cobranza/liquidacion-pago';

@Component({
  selector: 'app-registro-pagos',
  templateUrl: './registro-pagos.component.html',
  styleUrls: ['./registro-pagos.component.scss']
})
export class RegistroPagosComponent implements OnInit {
  public contentHeader: object;
  public cambiarIcono: boolean = false;
  public cobranza: LiquidacionCab[] = [];
  public pagos: LiquidacionPago[] = [];
  public liquidacionForm: FormGroup;
  public pagoInfoForm: FormGroup;
  public oldPagoInfoForm: FormGroup;
  public submitted: boolean = false;

  public idLiquidacionDet: number = 0;
  public codigo: string = '';
  public nroDocumento: string = '';

  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  get ReactiveIUForm() {
    return this.pagoInfoForm.controls;
  }

  constructor(private modalService: NgbModal,
              private utilsService: UtilsService,
              private registroPagosService: RegistroPagosService,
              private formBuilder: FormBuilder,) {
    this.contentHeader = {
      headerTitle: 'Registro de Pagos',
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
            name: 'Registro de Pagos',
            isLink: false
          }
        ]
      }
    };
    this.liquidacionForm = this.formBuilder.group({
      idLiquidacionCab: [0],
      idLiquidacionDet: [0],
      rucCliente: [{value: '', disabled: true}],
      razonSocialCliente: [{value: '', disabled: true}],
      nroDocumento: [{value: '', disabled: true}],
      fechaConfirmada: [{value: '', disabled: true}],
      netoConfirmado: [{value: 0, disabled: true}],
      fondoResguardo: [{value: 0, disabled: true}]
    });
    this.pagoInfoForm = this.formBuilder.group({
      nuevaFechaConfirmada: [{value: '', disabled: true}],
      diasMora: [{value: 0, disabled: true}],
      interes: [{value: 0, disabled: true}],
      gastos: [{value: 0, disabled: true}],
      saldoDeuda: [{value: 0, disabled: true}],
      fondoResguardo: [{value: 0, disabled: true}],
      saldoDeudaRestante: [{value: 0, disabled: true}],
      defecto: [{value: 0, disabled: true}],
      tipoPago: [true],
      fechaPago: ['', Validators.required],
      montoPago: [0, [Validators.required, Validators.min(1)]]
    });
    this.oldPagoInfoForm = this.pagoInfoForm.value;
  }

  ngOnInit(): void {
    this.onListarCobranza();
  }

  onListarCobranza(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.registroPagosService.listar({
      idConsulta: 3,
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: LiquidacionCab[]) => {
      this.cobranza = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onCambiarVisibilidadDetalleTodo(): void {
    this.cambiarIcono = !this.cambiarIcono;
    this.cobranza.forEach(el => {
      el.cambiarIcono = this.cambiarIcono;
      document.getElementById('trL' + el.idLiquidacionCab).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
      document.getElementById('detailL' + el.idLiquidacionCab).style.display = (el.cambiarIcono) ? "block" : "none";
    });
  }

  onCambiarVisibilidadDetalle(item: LiquidacionCab): void {
    item.cambiarIcono = !item.cambiarIcono;
    document.getElementById('trL' + item.idLiquidacionCab).style.visibility = (item.cambiarIcono) ? "visible" : "collapse";
    document.getElementById('detailL' + item.idLiquidacionCab).style.display = (item.cambiarIcono) ? "block" : "none";
  }

  onInfoPago(idLiquidacionDet: number, tipoPago: boolean): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.registroPagosService.infoPago({
      idLiquidacionDet,
      tipoPago
    }).subscribe((response: LiquidacionPago) => {
      this.pagoInfoForm.controls.nuevaFechaConfirmada.setValue(response.fechaConfirmada);
      this.pagoInfoForm.controls.diasMora.setValue(response.diasMora);
      this.pagoInfoForm.controls.interes.setValue(response.interes);
      this.pagoInfoForm.controls.gastos.setValue(response.gastos);
      this.pagoInfoForm.controls.saldoDeuda.setValue(response.saldoDeuda);
      this.pagoInfoForm.controls.fondoResguardo.setValue(response.fondoResguardo);
      this.pagoInfoForm.controls.saldoDeudaRestante.setValue(response.saldoDeudaRestante);
      this.pagoInfoForm.controls.defecto.setValue(response.defecto);

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onListarPago(idLiquidacionDet: number): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.registroPagosService.listarPago({
      idLiquidacionDet: idLiquidacionDet,
    }).subscribe((response: LiquidacionPago[]) => {
      this.pagos = response;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onPagar(modal: any, cab: LiquidacionCab, det: LiquidacionDet): void {
    this.liquidacionForm.controls.idLiquidacionCab.setValue(cab.idLiquidacionCab);
    this.codigo = cab.codigo;
    this.nroDocumento = det.nroDocumento;
    this.liquidacionForm.controls.rucCliente.setValue(cab.rucCliente);
    this.liquidacionForm.controls.razonSocialCliente.setValue(cab.razonSocialCliente);
    this.liquidacionForm.controls.nroDocumento.setValue(det.nroDocumento);
    this.liquidacionForm.controls.fechaConfirmada.setValue(det.fechaConfirmado);
    this.liquidacionForm.controls.netoConfirmado.setValue(det.netoConfirmado);
    this.liquidacionForm.controls.fondoResguardo.setValue(det.fondoResguardo);

    this.idLiquidacionDet = det.idLiquidacionDet;
    this.onInfoPago(det.idLiquidacionDet, this.pagoInfoForm.controls.tipoPago.value);
    this.onListarPago(det.idLiquidacionDet);

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

  onCancelarPago(): void {
    this.pagoInfoForm.reset(this.oldPagoInfoForm);
    this.modalService.dismissAll();
  }

  onGuardarPago(): void {
    this.submitted = true;
    if (this.pagoInfoForm.invalid)
      return;
  }

  onCambioTipoPago($event: boolean): void {
    this.onInfoPago(this.idLiquidacionDet, $event);
  }
}
