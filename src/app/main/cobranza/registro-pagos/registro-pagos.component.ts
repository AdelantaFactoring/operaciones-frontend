import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {LiquidacionCab} from "../../../shared/models/operaciones/liquidacion-cab";
import {UtilsService} from "../../../shared/services/utils.service";
import {RegistroPagosService} from "./registro-pagos.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LiquidacionDet} from "../../../shared/models/operaciones/liquidacion-det";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LiquidacionPago} from 'app/shared/models/cobranza/liquidacion-pago';
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";
import {User} from 'app/shared/models/auth/user';
import {
  LiquidacionObtenerestadopagoFactoringregular
} from "../../../shared/models/cobranza/liquidacion-obtenerestadopago-factoringregular";
import Swal from "sweetalert2";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-registro-pagos',
  templateUrl: './registro-pagos.component.html',
  styleUrls: ['./registro-pagos.component.scss']
})
export class RegistroPagosComponent implements OnInit, AfterViewInit {
  @ViewChild('coreCard') coreCard;

  public currentUser: User;
  public mostrar: string = 'false';

  public contentHeader: object;
  public cambiarIcono: boolean = false;
  public cobranza: LiquidacionCab[] = [];
  public pagos: LiquidacionPago[] = [];
  public liquidacionForm: FormGroup;
  public pagoInfoForm: FormGroup;
  public paiForm: FormGroup;
  public oldPagoInfoForm: FormGroup;
  public filtroForm: FormGroup;
  public oldFiltroForm: FormGroup;
  public submitted: boolean = false;
  public ocultarPagoForm: boolean = false;
  public fechaMaxima: any;
  public fechaMinima: any;

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
  private liquidacionDetItem: LiquidacionDet;
  private idsLiquidacionCab: number[] = [];
  private inicioPagosRows: any[] = [];
  private countPagador: number = 0;
  private countCliente: number = 0;
  private countClienteSeleccionado: number = 0;
  private seleccionarTodoInicioPagos: boolean = false;

  public pagoPersonalizado: boolean = false;

  get ReactiveIUForm() {
    return this.pagoInfoForm.controls;
  }

  get ReactiveIUFormPAI() {
    return this.paiForm.controls;
  }

  constructor(private route: ActivatedRoute,
              private modalService: NgbModal,
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
      fondoResguardo: [{value: 0, disabled: true}],

      interesServicio: [{value: 0, disabled: true}],
      gastosServicio: [{value: 0, disabled: true}],
      montoTotalFacturar: [{value: 0, disabled: true}]
    });
    this.pagoInfoForm = this.formBuilder.group({
      nuevaFechaConfirmada: [{value: '', disabled: true}],
      fecha: [{year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()}],
      diasMora: [{value: 0, disabled: true}],
      interes: [{value: 0, disabled: true}],
      gastos: [{value: 0, disabled: true}],
      saldoDeuda: [{value: 0, disabled: true}],
      tipoPago: [true],
      flagInicioCliente: [false],
      flagForzarGeneracion: [false],
      flagPagoHabilitado: [false],
      tipoRegistro: [false],
      fechaPago: ['', Validators.required],
      montoPago: [0, [Validators.required, Validators.min(1)]],
      interesPago: [0, [Validators.required, Validators.min(0)]],
      gastosPago: [0, [Validators.required, Validators.min(0)]],
      observacion: [''],
      descuentoFR: [0],
      excesoFR: [0],
      flagPagoInteresConfirming: false
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
      fechaOperacion: [null],
      netoConfirmado: [0]
    });
    this.oldFiltroForm = this.filtroForm.value;

    this.paiForm = this.formBuilder.group({
      interesConIGV_Total: [{value: 0, disabled: true}],
      gastosDiversosConIGV_Total: [{value: 0, disabled: true}],
      montoFacturado_Total: [{value: 0, disabled: true}],
      fecha_PAI: ['', Validators.required],
      monto_PAI: [{value: 0, disabled: true}, [Validators.required, Validators.min(1)]],
      observacion_PAI: ['']
    });
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
    this.fechaMaxima = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
    this.route.params.subscribe(s => {
      this.mostrar = s.mostrar;
      this.filtroForm.controls.estado.setValue((this.mostrar === 'false' ? 7 : 0));
      if (this.mostrar === 'false')
        this.filtroForm.controls.estado.disable();
      else
        this.filtroForm.controls.estado.enable();
      this.onListarCobranza();
    });
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
      idConsulta: this.mostrar === 'true' ? 3 : 4,
      codigoLiquidacion: this.filtroForm.controls.codigoLiquidacion.value,
      codigoSolicitud: this.filtroForm.controls.codigoSolicitud.value,
      cliente: this.filtroForm.controls.cliente.value,
      pagProv: this.filtroForm.controls.pagadorProveedor.value,
      moneda: this.filtroForm.controls.moneda.value,
      idTipoOperacion: this.filtroForm.controls.tipoOperacion.value,
      idEstado: this.filtroForm.controls.estado.value,
      netoConfirmadoTotal: 0,
      pagProvDet: this.filtroForm.controls.pagadorProveedorDet.value,
      nroDocumento: this.filtroForm.controls.nroDocumento.value,
      fechaOperacion: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.controls.fechaOperacion.value) ?? "",
      netoConfirmado: this.filtroForm.controls.netoConfirmado.value === '' ? 0 : this.filtroForm.controls.netoConfirmado.value,
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
    }

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
      this.pagoInfoForm.controls.descuentoFR.setValue(this.utilsService.round(response.saldoDeuda - this.liquidacionDetItem.fondoResguardo));
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
      this.ocultarPagoForm = response.filter(f => f.tipoPago == "Total").length > 0 || this.mostrar === 'false';
      if (response.length > 0) {
        let first = response.sort((a, b) => b.idLiquidacionPago - a.idLiquidacionPago)[0];
        this.fechaMinima = {
          year: parseInt(first.fechaPago.split('/')[2]),
          month: parseInt(first.fechaPago.split('/')[1]),
          day: parseInt(first.fechaPago.split('/')[0]),
        };
      } else {
        this.fechaMinima = null;
      }
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
        this.pagoInfoForm.controls.flagPagoHabilitado.setValue(response[0].flagPagoHabilitado);
      }
    }
  }

  async onGenerarComprobanteEspecialFactoringRegular(idLiquidacionCab: number): Promise<void> {
    this.utilsService.blockUIStart('Generando información solicitada...');

    const response: any = await this.registroPagosService.generarComprobanteEspecialFactoringRegular({
      idLiquidacionCab: idLiquidacionCab,
      liquidacionPagoFactoringRegularGenerar: this.inicioPagosRows.filter(a => a.seleccionado),
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
    this.fechaMaxima = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
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

    this.liquidacionForm.controls.interesServicio.setValue(det.interesConIGV);
    this.liquidacionForm.controls.gastosServicio.setValue(det.gastosDiversosConIGV);
    this.liquidacionForm.controls.montoTotalFacturar.setValue(det.montoTotalFacturado);

    this.idLiquidacionCab = cab.idLiquidacionCab;
    this.idLiquidacionDet = det.idLiquidacionDet;
    this.idSolicitudDet = det.idSolicitudDet;
    this.onInfoPago(det.idLiquidacionDet, '', this.pagoInfoForm.controls.tipoPago.value);
    this.onListarPago(det.idLiquidacionDet);

    this.liquidacionCabItem = cab;
    this.liquidacionDetItem = det;

    if (det.flagPagoInteresConfirming) {
      this.pagoInfoForm.controls.flagPagoInteresConfirming.disable();
    } else {
      this.pagoInfoForm.controls.flagPagoInteresConfirming.enable();
    }

    await this.onObtenerEstadoPagoFacturingRegular(this.idLiquidacionCab, this.idLiquidacionDet);

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
    this.pagoPersonalizado = false;

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

  onCheckPagoInteresConfirming(): void {
    if (this.pagos.filter(a => a.flagPagoInteresConfirming).length > 0) {
      this.pagoInfoForm.controls.flagPagoInteresConfirming.disable();
    } else {
      this.pagoInfoForm.controls.flagPagoInteresConfirming.enable();
    }
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
      tipoRegistro: this.pagoInfoForm.controls.tipoRegistro.value,
      fechaPago: this.utilsService.formatoFecha_YYYYMMDD(this.pagoInfoForm.controls.fechaPago.value),
      montoPago: this.pagoInfoForm.controls.montoPago.value,
      interesPago: this.pagoInfoForm.controls.interesPago.value,
      gastosPago: this.pagoInfoForm.controls.gastosPago.value,
      _TipoPago: this.pagoInfoForm.controls.tipoPago.value,
      observacion: this.pagoInfoForm.controls.observacion.value,
      flagPagoInteresConfirming: this.pagoInfoForm.controls.flagPagoInteresConfirming.value,
      idUsuarioAud: this.currentUser.idUsuario
    }).subscribe(async (response) => {
      switch (response.tipo) {
        case 1:
          this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);

          this.utilsService.blockUIStop();
          this.pagoInfoForm.reset(this.oldPagoInfoForm);
          this.pagoInfoForm.controls.fecha.setValue({
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate()
          });
          this.onInfoPago(this.idLiquidacionDet, '', true);
          this.onListarPago(this.idLiquidacionDet);
          this.submitted = false;

          await this.onObtenerEstadoPagoFacturingRegular(this.idLiquidacionCab, this.idLiquidacionDet);

          this.onCheckPagoInteresConfirming();

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

  onCambioTipoPago2($event: boolean): void {
    if ($event) {
      this.pagoInfoForm.controls.montoPago.setValue(this.liquidacionForm.controls.montoTotalFacturar.value);
      this.pagoInfoForm.controls.montoPago.disable();
    } else {
      this.pagoInfoForm.controls.montoPago.setValue(0);
      this.pagoInfoForm.controls.montoPago.enable();
    }
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

  onShowPAI(modal: NgbModal, cab: LiquidacionCab): void {
    this.fechaMaxima = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
    this.codigo = cab.codigo;
    this.idLiquidacionCab = cab.idLiquidacionCab;

    this.liquidacionCabItem = cab;

    this.utilsService.blockUIStart('Obteniendo información...');
    this.registroPagosService.getPAI({
      idLiquidacionCab: this.idLiquidacionCab
    }).subscribe((response: LiquidacionCab) => {
      this.paiForm.controls.interesConIGV_Total.setValue(response[0].interesConIGV_Total);
      this.paiForm.controls.gastosDiversosConIGV_Total.setValue(response[0].gastosDiversosConIGV_Total);
      this.paiForm.controls.montoFacturado_Total.setValue(response[0].montoFacturado_Total);

      let fechaPago = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      };

      if (response[0].fecha_PAI != '') {
        let split = response[0].fecha_PAI.split('/');
        fechaPago.day = parseInt(split[0]);
        fechaPago.month = parseInt(split[1]);
        fechaPago.year = parseInt(split[2]);
      }

      this.paiForm.controls.fecha_PAI.setValue(fechaPago);
      this.paiForm.controls.monto_PAI.setValue((response[0].monto_PAI == 0) ? response[0].montoFacturado_Total : response[0].monto_PAI);
      this.paiForm.controls.observacion_PAI.setValue(response[0].observacion_PAI);

      if (cab.flagPagoInteresConfirming) {
        this.paiForm.controls.fecha_PAI.disable();
        this.paiForm.controls.observacion_PAI.disable();
      } else {
        this.paiForm.controls.fecha_PAI.enable();
        this.paiForm.controls.observacion_PAI.enable();
      }

      this.utilsService.blockUIStop();

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
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onGuardarPAI(): void {
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
        this.utilsService.blockUIStart('Guardando información...');
        this.registroPagosService.updatePAI({
          idLiquidacionCab: this.idLiquidacionCab,
          fecha_PAI: this.utilsService.formatoFecha_YYYYMMDD(this.paiForm.controls.fecha_PAI.value),
          monto_PAI: this.paiForm.controls.monto_PAI.value,
          observacion_PAI: this.paiForm.controls.observacion_PAI.value,
          idUsuarioAud: this.currentUser.idUsuario
        }).subscribe((response: LiquidacionCab) => {
          this.utilsService.showNotification('Operación realizada satisfactoriamente', 'Confirmación', 1)

          this.modalService.dismissAll();

          this.utilsService.blockUIStop();

          this.onListarCobranza();
        }, error => {
          this.utilsService.blockUIStop();
          this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
        });

        this.modalService.dismissAll();
      }
    });
  }

  updateInicioPagosTotales(): void {
    let countPagador = 0;
    let countCliente = 0;
    let countClienteSeleccionado = 0;

    for (const row of this.inicioPagosRows) {
      if (row.flagInicioCliente) {
        countCliente++;
      } else {
        countPagador++;
      }

      if (row.seleccionado && row.flagInicioCliente && !row.flagPagoHabilitado) {
        countClienteSeleccionado++;
      }
    }

    this.countPagador = countPagador;
    this.countCliente = countCliente;
    this.countClienteSeleccionado = countClienteSeleccionado;
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

  onMontoPagoCambiar($event: any): void {
    let dif: number = this.utilsService.round(this.pagoInfoForm.controls.saldoDeuda.value - ($event + this.liquidacionDetItem.fondoResguardo));
    if (dif <= 0)
      this.pagoInfoForm.controls.excesoFR.setValue(this.utilsService.round(dif * -1));
    else
      this.pagoInfoForm.controls.excesoFR.setValue(0);
  }

  onSeleccionarTodo(cab: LiquidacionCab): void {
    cab.verOpcionesPagoDetalle = cab.seleccionarTodo;
    for (let el of cab.liquidacionDet) {
      if (el.pagoTotal
        || (cab.idTipoOperacion == 1 && !cab.alterno && !el.flagPagoHabilitado)
        || (cab.idTipoOperacion == 3 && !cab.flagPagoInteresConfirming)) continue;
      el.fechaPago = {
        year: parseInt(el.fechaConfirmado.split('/')[2]),
        month: parseInt(el.fechaConfirmado.split('/')[1]),
        day: parseInt(el.fechaConfirmado.split('/')[0]),
      }
      el.montoPago = el.saldo > 0 ? el.saldo : el.netoConfirmado;
      el.verOpcionesPago = el.seleccionado = cab.seleccionarTodo;
    }
  }

  onSeleccionado(cab: LiquidacionCab, item: LiquidacionDet): void {
    cab.verOpcionesPagoDetalle = cab.liquidacionDet.filter(f => f.seleccionado).length > 0;
    item.fechaPago = {
      year: parseInt(item.fechaConfirmado.split('/')[2]),
      month: parseInt(item.fechaConfirmado.split('/')[1]),
      day: parseInt(item.fechaConfirmado.split('/')[0]),
    }
    item.montoPago = item.saldo > 0 ? item.saldo : item.netoConfirmado;
    item.verOpcionesPago = item.seleccionado;
  }

  onPagoMasivo(cab: LiquidacionCab): void {
    if (cab.liquidacionDet.filter(f => f.seleccionado).length === 0) {
      this.utilsService.showNotification("Seleccione al menos una fila", "Advertencia", 2);
      return;
    }

    for (const el of cab.liquidacionDet) {
      if (el.seleccionado) {
        if (el.fechaPago === null) {
          this.utilsService.showNotification(`Seleccione una fecha de pago. (Doc. ${el.nroDocumento})`, "Advertencia", 2);
          return;
        } else if (el.montoPago <= 0) {
          this.utilsService.showNotification(`El monto de pago debe ser mayor a cero. (Doc. ${el.nroDocumento})`, "Advertencia", 2);
          return;
        }

        el.fechaPagoFormat = this.utilsService.formatoFecha_YYYYMMDD(el.fechaPago);
      }
    }

    const pagos = {...cab};
    let liqDet: LiquidacionDet[] = [];
    for (const det of cab.liquidacionDet.filter(f => f.seleccionado)) {
      const newDet = { ...det };
      newDet.fechaPago = "";
      liqDet.push(newDet);
    }
    // pagos.liquidacionCabSustento = null;
    // // @ts-ignore
    // pagos.liquidacionDet = [...cab.liquidacionDet.filter(f => f.seleccionado)]
    // pagos.idEmpresa = this.currentUser.idEmpresa;
    // pagos.idUsuarioAud = this.currentUser.idUsuario;

    this.utilsService.blockUIStart('Guardando...');
    // @ts-ignore
    this.registroPagosService.insertarPagoMasivo({
      idEmpresa: this.currentUser.idEmpresa,
      idLiquidacionCab: pagos.idLiquidacionCab,
      liquidacionDet: liqDet,
      idUsuarioAud: this.currentUser.idUsuario
    }).subscribe((response: any) => {
        switch (response.tipo) {
          case 1:
            this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
            this.utilsService.blockUIStop();
            this.onListarCobranza();
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

  onEliminarPago(item: LiquidacionPago): void {
    Swal.fire({
      title: 'Advertencia',
      html: `Está intentando eliminar un pago. Tenga en cuenta que, esta acción no podrá revertise y no eliminará comprobantes de pago y/o devoluciones generados que estén asociados a este pago.<br>¿Está seguro de eliminar el pago N° ${item.nro}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      }
    }).then(result => {
      if (result.value) {
        this.utilsService.blockUIStart("Eliminando...");
        this.registroPagosService.eliminarPago({
          idLiquidacionPago: item.idLiquidacionPago,
          idLiquidacionDet: item.idLiquidacionDet,
          idUsuarioAud: this.currentUser.idUsuario
        }).subscribe((response: any) => {
          switch (response.tipo) {
            case 1:
              this.utilsService.showNotification('Pago eliminado.', 'Confirmación', 1);
              this.utilsService.blockUIStop();
              this.onListarPago(item.idLiquidacionDet);
              this.onInfoPago(this.idLiquidacionDet, this.utilsService.formatoFecha_YYYYMMDD(this.pagoInfoForm.controls.fecha.value), this.pagoInfoForm.controls.tipoPago.value);
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
    });
  }

  onDeshabilitar(nro: number): boolean {
    return this.pagos.filter(f => f.nro > nro).length > 0;
  }

  onCambioTipoRegistro($event: any): void {
    this.pagoPersonalizado = !this.pagoPersonalizado
  }
}
