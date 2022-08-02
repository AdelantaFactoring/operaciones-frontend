import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {LiquidacionCab} from "../../../shared/models/operaciones/liquidacion-cab";
import {UtilsService} from "../../../shared/services/utils.service";
import {RegistroPagosService} from "./registro-pagos.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LiquidacionDet} from "../../../shared/models/operaciones/liquidacion-det";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {LiquidacionPago} from 'app/shared/models/cobranza/liquidacion-pago';
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";
import { User } from 'app/shared/models/auth/user';
import {
  LiquidacionObtenerestadopagoFactoringregular
} from "../../../shared/models/cobranza/liquidacion-obtenerestadopago-factoringregular";
import Swal from "sweetalert2";

@Component({
  selector: 'app-registro-pagos',
  templateUrl: './registro-pagos.component.html',
  styleUrls: ['./registro-pagos.component.scss']
})
export class RegistroPagosComponent implements OnInit, AfterViewInit {
  @ViewChild('coreCard') coreCard;

  public currentUser: User;
  public contentHeader: object;
  public cambiarIcono: boolean = false;
  public cobranza: LiquidacionCab[] = [];
  public pagos: LiquidacionPago[] = [];
  public liquidacionForm: FormGroup;
  public pagoInfoForm: FormGroup;
  public oldPagoInfoForm: FormGroup;
  public filtroForm: FormGroup;
  public oldFiltroForm: FormGroup;
  public submitted: boolean = false;
  public ocultarPagoForm: boolean = false;
  public fechaMaxima: any;

  public idLiquidacionCab: number = 0;
  public idLiquidacionDet: number = 0;
  public idSolicitudDet: number = 0;
  public codigo: string = '';
  public nroDocumento: string = '';

  public currency: TablaMaestra[] = [];
  public operationType: TablaMaestra[] = [];
  public state: TablaMaestra[] = [];

  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  private liquidacionCabItem: LiquidacionCab;
  private idsLiquidacionCab: number[] = [];
  private inicioPagosRows: any[] = [];
  private countPagador: number = 0;
  private countCliente: number = 0;
  private seleccionarTodoInicioPagos: boolean = false;

  get ReactiveIUForm() {
    return this.pagoInfoForm.controls;
  }

  constructor(private modalService: NgbModal,
              private utilsService: UtilsService,
              private registroPagosService: RegistroPagosService,
              private formBuilder: FormBuilder,
              private tablaMaestraService: TablaMaestraService) {
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
      rucPagProv: [{value: '', disabled: true}],
      razonSocialPagProv: [{value: '', disabled: true}],
      nroDocumento: [{value: '', disabled: true}],
      fechaConfirmada: [{value: '', disabled: true}],
      netoConfirmado: [{value: 0, disabled: true}],
      interesRestanteServicio: [{value: 0, disabled: true}],
      fondoResguardo: [{value: 0, disabled: true}]
    });
    this.pagoInfoForm = this.formBuilder.group({
      nuevaFechaConfirmada: [{value: '', disabled: true}],
      fecha: [{ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }],
      diasMora: [{value: 0, disabled: true}],
      interes: [{value: 0, disabled: true}],
      gastos: [{value: 0, disabled: true}],
      saldoDeuda: [{value: 0, disabled: true}],
      tipoPago: [true],
      flagInicioCliente: [false],
      flagForzarGeneracion: [false],
      flagPagoHabilitado: [false],
      fechaPago: ['', Validators.required],
      montoPago: [0, [Validators.required, Validators.min(1)]],
      observacion: ['']
    });
    this.oldPagoInfoForm = this.pagoInfoForm.value;
    this.filtroForm = this.formBuilder.group({
      codigoLiquidacion: [''],
      codigoSolicitud: [''],
      cliente: [''],
      pagadorProveedor: [''],
      moneda: [''],
      tipoOperacion: [0],
      estado: [0],
      pagadorProveedorDet: [''],
      nroDocumento: [''],
      fechaOperacion: [null]
    });
    this.oldFiltroForm = this.filtroForm.value;
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.utilsService.blockUIStart('Obteniendo información de maestros...');
    this.currency = await this.onListarMaestros(1, 0);
    this.operationType = await this.onListarMaestros(4, 0);
    this.state = await this.onListarMaestros(7, 0);
    this.currency = this.utilsService.agregarTodos(1, this.currency);
    this.operationType = this.utilsService.agregarTodos(4, this.operationType);
    this.state = this.utilsService.agregarTodos(7, this.state);
    this.utilsService.blockUIStop();
    this.onListarCobranza();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.coreCard.collapse();
      this.coreCard.onclickEvent.collapseStatus = true;
    }, 0);
  }

  async onListarMaestros(idTabla: number, idColumna: number): Promise<TablaMaestra[]> {
    return await this.tablaMaestraService.listar({
      idTabla: idTabla,
      idColumna: idColumna
    }).then((response: TablaMaestra[]) => response, error => [])
      .catch(error => []);
  }

  async onListarCobranza(): Promise<void> {
    this.utilsService.blockUIStart('Obteniendo información...');

    const response = await this.registroPagosService.listar({
      idConsulta: 3,
      codigoLiquidacion: this.filtroForm.controls.codigoLiquidacion.value,
      codigoSolicitud: this.filtroForm.controls.codigoSolicitud.value,
      cliente: this.filtroForm.controls.cliente.value,
      pagProv: this.filtroForm.controls.pagadorProveedor.value,
      moneda: this.filtroForm.controls.moneda.value,
      idTipoOperacion: this.filtroForm.controls.tipoOperacion.value,
      idEstado: this.filtroForm.controls.estado.value,
      pagProvDet: this.filtroForm.controls.pagadorProveedorDet.value,
      nroDocumento: this.filtroForm.controls.nroDocumento.value,
      fechaOperacion: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.controls.fechaOperacion.value) ?? "",
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).toPromise().catch(error => {
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    if (response) {
      this.cobranza = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
    }

    this.utilsService.blockUIStop();

    //   .subscribe((response: LiquidacionCab[]) => {
    //   this.cobranza = response;
    //   this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
    //   this.utilsService.blockUIStop();
    // }, error => {
    //   this.utilsService.blockUIStop();
    //   this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    // });
  }

  onCambiarVisibilidadDetalleTodo(): void {
    if (!this.cambiarIcono) {
      this.idsLiquidacionCab = [];
      for (const item of this.cobranza) {
        this.idsLiquidacionCab.push(item.idLiquidacionCab)
      }
    };

    this.cambiarIcono = !this.cambiarIcono;
    this.cobranza.forEach(el => {
      el.cambiarIcono = this.cambiarIcono;
      document.getElementById('trL' + el.idLiquidacionCab).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
      document.getElementById('detailL' + el.idLiquidacionCab).style.display = (el.cambiarIcono) ? "block" : "none";
    });
  }

  onCambiarVisibilidadDetalle(item: LiquidacionCab): void {
    if (!this.idsLiquidacionCab.some(a => a == item.idLiquidacionCab)) {
      if (!item.cambiarIcono) {
        this.idsLiquidacionCab.push(item.idLiquidacionCab);
      }
    } else {
      if (item.cambiarIcono) {
        for (let i = 0; i < this.idsLiquidacionCab.length; i++) {
          if (this.idsLiquidacionCab[i] == item.idLiquidacionCab) {
            this.idsLiquidacionCab.splice(i, 1);
          }
        }
      }
    }

    item.cambiarIcono = !item.cambiarIcono;
    document.getElementById('trL' + item.idLiquidacionCab).style.visibility = (item.cambiarIcono) ? "visible" : "collapse";
    document.getElementById('detailL' + item.idLiquidacionCab).style.display = (item.cambiarIcono) ? "block" : "none";
  }

  onInfoPago(idLiquidacionDet: number, fecha: string, tipoPago: boolean): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.registroPagosService.infoPago({
      idLiquidacionDet: idLiquidacionDet,
      fecha: fecha,
      tipoPago: tipoPago
    }).subscribe((response: LiquidacionPago) => {
      this.pagoInfoForm.controls.nuevaFechaConfirmada.setValue(response.fechaConfirmada);
      this.pagoInfoForm.controls.diasMora.setValue(response.diasMora);
      this.pagoInfoForm.controls.interes.setValue(response.interes);
      this.pagoInfoForm.controls.gastos.setValue(response.gastos);
      this.pagoInfoForm.controls.saldoDeuda.setValue(response.saldoDeuda);
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
      this.ocultarPagoForm = response.filter(f => f.tipoPago == "Total").length > 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  async onObtenerEstadoPagoFacturingRegular(idLiquidacionCab: number, idLiquidacionDet: number): Promise<void> {
    const response: LiquidacionObtenerestadopagoFactoringregular[] = await this.registroPagosService.obtenerEstadoPagoFactoringRegular({
      idLiquidacionCab: idLiquidacionCab,
      idLiquidacionDet: idLiquidacionDet
    }).toPromise().catch(error => {
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    if (response) {
      if (response.length > 0) {
        this.pagoInfoForm.controls.flagInicioCliente.setValue(response[0].flagInicioCliente);
        this.pagoInfoForm.controls.flagForzarGeneracion.setValue(response[0].flagForzarGeneracion);
        this.liquidacionForm.controls.interesRestanteServicio.setValue(response[0].interesRestanteServicio);
      }
    }
  }

  async onGenerarComprobanteEspecialFactoringRegular(idLiquidacionCab: number): Promise<void> {
    this.utilsService.blockUIStart('Generando información solicitada...');

    const response: any = await this.registroPagosService.generarComprobanteEspecialFactoringRegular({
      idLiquidacionCab: idLiquidacionCab,
      liquidacionPagoFactoringRegularGenerar: this.inicioPagosRows,
      idUsuarioAud: this.currentUser.idUsuario
    }).toPromise().catch(error => {
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    if (response) {
      // await this.onObtenerEstadoPagoFacturingRegular(this.idLiquidacionCab, this.idLiquidacionDet);
      // this.onInfoPago(this.idLiquidacionDet, '', this.pagoInfoForm.controls.tipoPago.value);

      this.utilsService.showNotification('Operación completada satisfactoriamente', 'Confirmación', 1);
    }

    this.utilsService.blockUIStop();
  }

  // async onGenerar(): Promise<void> {
  //   await this.onGenerarComprobanteEspecialFactoringRegular(this.idLiquidacionCab);
  // }

  async onPagar(modal: any, cab: LiquidacionCab, det: LiquidacionDet): Promise<void> {
    this.fechaMaxima = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.liquidacionForm.controls.idLiquidacionCab.setValue(cab.idLiquidacionCab);
    this.codigo = cab.codigo;
    this.nroDocumento = det.nroDocumento;
    this.liquidacionForm.controls.rucCliente.setValue(cab.rucCliente);
    this.liquidacionForm.controls.razonSocialCliente.setValue(cab.razonSocialCliente);
    this.liquidacionForm.controls.rucPagProv.setValue(cab.idTipoOperacion != 3 ? cab.rucPagProv : det.rucPagProv);
    this.liquidacionForm.controls.razonSocialPagProv.setValue(cab.idTipoOperacion != 3 ? cab.razonSocialPagProv : det.razonSocialPagProv);
    this.liquidacionForm.controls.nroDocumento.setValue(det.nroDocumento);
    this.liquidacionForm.controls.fechaConfirmada.setValue(det.fechaConfirmado);
    this.liquidacionForm.controls.netoConfirmado.setValue(det.netoConfirmado);
    this.liquidacionForm.controls.interesRestanteServicio.setValue(det.interesRestanteServicio);
    this.liquidacionForm.controls.fondoResguardo.setValue(det.fondoResguardo);

    this.idLiquidacionCab = cab.idLiquidacionCab;
    this.idLiquidacionDet = det.idLiquidacionDet;
    this.idSolicitudDet = det.idSolicitudDet;
    this.onInfoPago(det.idLiquidacionDet, '', this.pagoInfoForm.controls.tipoPago.value);
    this.onListarPago(det.idLiquidacionDet);

    this.liquidacionCabItem = cab;

    await this.onObtenerEstadoPagoFacturingRegular(this.idLiquidacionCab, this.idLiquidacionDet);
    this.pagoInfoForm.controls.flagPagoHabilitado.setValue(det.flagPagoHabilitado);

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

  async onCancelarPago(): Promise<void> {
    this.pagoInfoForm.reset(this.oldPagoInfoForm);
    this.modalService.dismissAll();

    await this.onListarCobranza();
    setTimeout(() => {
      for (const item of this.cobranza) {
        if (this.idsLiquidacionCab.some(a => a == item.idLiquidacionCab)) {
          item.cambiarIcono = false;
          this.onCambiarVisibilidadDetalle(item);
        }
      }
    }, 0);
  }

  onGuardarPago(): void {
    this.submitted = true;
    if (this.pagoInfoForm.invalid)
      return;

    this.utilsService.blockUIStart('Guardando...');
    this.registroPagosService.insertarPago({
      idEmpresa: this.currentUser.idEmpresa,
      idLiquidacionPago: 0,
      idLiquidacionCab: this.idLiquidacionCab,
      idLiquidacionDet: this.idLiquidacionDet,
      idSolicitudDet: this.idSolicitudDet,
      fechaPago: this.utilsService.formatoFecha_YYYYMMDD(this.pagoInfoForm.controls.fechaPago.value),
      montoPago: this.pagoInfoForm.controls.montoPago.value,
      _TipoPago: this.pagoInfoForm.controls.tipoPago.value,
      observacion: this.pagoInfoForm.controls.observacion.value,
      idUsuarioAud: this.currentUser.idUsuario
    }).subscribe(async (response) => {
      switch (response.tipo) {
        case 1:
          this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);

          if (this.pagoInfoForm.controls.flagForzarGeneracion.value) await this.onObtenerEstadoPagoFacturingRegular(this.idLiquidacionCab, this.idLiquidacionDet);

          this.utilsService.blockUIStop();
          this.pagoInfoForm.reset(this.oldPagoInfoForm);
          this.pagoInfoForm.controls.fecha.setValue({ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() });
          this.onInfoPago(this.idLiquidacionDet, '', true);
          this.onListarPago(this.idLiquidacionDet);
          this.submitted = false;

          break;
        case 2:
          this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
          this.utilsService.blockUIStop();
          break;
        default:
          this.utilsService.showNotification(response.mensaje, 'Error', 3);
          this.utilsService.blockUIStop();
          break;
      }
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onCambioTipoPago($event: boolean): void {
    this.onInfoPago(this.idLiquidacionDet, this.utilsService.formatoFecha_YYYYMMDD(this.pagoInfoForm.controls.fecha.value), $event);
  }

  onCambioFecha($event: any) {
    this.onInfoPago(this.idLiquidacionDet, this.utilsService.formatoFecha_YYYYMMDD($event), this.pagoInfoForm.controls.tipoPago.value);
  }

  porcentajePagoTotal(value: number): number {
    return value > 100 ? 100 : value;
  }

  saldo(value: number): number {
    return value < 0 ? 0 : value;
  }

  onCambioFechaOperacion(): void {
    this.filtroForm.controls.fechaOperacion.setValue(null);
  }

  onLimpiarFiltro($event): void {
    if ($event === 'reload') {
      this.filtroForm.reset(this.oldFiltroForm);
    }
  }

  onRefrescar(): void {
    this.idsLiquidacionCab = [];
    this.onListarCobranza();
  }

  onBuscar(): void {
    this.idsLiquidacionCab = [];
    this.onListarCobranza();
  }

  onShowInicioPagos(modal: NgbModal, cab: LiquidacionCab): void {
    this.codigo = cab.codigo;
    this.idLiquidacionCab = cab.idLiquidacionCab;
    this.seleccionarTodoInicioPagos = false;

    this.inicioPagosRows = JSON.parse(JSON.stringify(cab.liquidacionDet));

    this.updateInicioPagosTotales();

    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        size: 'lg',
        // windowClass: 'my-class',
        animation: true,
        // centered: true,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  updateInicioPagosTotales(): void {
    let countPagador = 0;
    let countCliente = 0;

    for (const row of this.inicioPagosRows) {
      if (row.flagInicioCliente) {
        countCliente++;
      } else {
        countPagador++;
      }
    }

    this.countPagador = countPagador;
    this.countCliente = countCliente;
  }

  onSeleccionarTodoInicioPagos(): void {
    this.inicioPagosRows.forEach(el => {
        el.seleccionado = this.seleccionarTodoInicioPagos;
    });
  }

  async onGuardarEstados(): Promise<void> {
    if (this.inicioPagosRows.filter(a => a.seleccionado && !a.flagPagoHabilitado).length <= 0) {
      this.utilsService.showNotification('Debe seleccionar por lo menos un documento habilitado', 'Alerta', 2);
      return;
    }

    Swal.fire({
      title: 'Confirmación',
      text: `¿Desea continuar con la operación?, esta acción no podrá revertirse`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      }
    }).then(async result => {
      if (result.value) {
        await this.onGenerarComprobanteEspecialFactoringRegular(this.idLiquidacionCab);

        await this.onListarCobranza();
        setTimeout(() => {
          for (const item of this.cobranza) {
            if (this.idsLiquidacionCab.some(a => a == item.idLiquidacionCab)) {
              item.cambiarIcono = false;
              this.onCambiarVisibilidadDetalle(item);
            }
          }
        }, 0);

        this.modalService.dismissAll();
      }
    });
  }
}
