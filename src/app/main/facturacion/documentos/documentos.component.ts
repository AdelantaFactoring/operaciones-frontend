import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {DocumentosService} from "./documentos.service";
import {LiquidacionDocumentoCab} from "../../../shared/models/facturacion/liquidaciondocumento-cab";
import {LiquidacionDocumentoDet} from "../../../shared/models/facturacion/liquidaciondocumento-det";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";
import Swal from "sweetalert2";
import {ClientesService} from "../../comercial/clientes/clientes.service";
import {Cliente} from "../../../shared/models/comercial/cliente";
import {User} from 'app/shared/models/auth/user';
import {MaestrosService} from "../../catalogos/maestros/maestros.service";
import {TablaMaestraRelacion} from "../../../shared/models/shared/tabla-maestra-relacion";
import {ContentHeader} from "../../../layout/components/content-header/content-header.component";
import {__spreadArray} from 'tslib';
import {LiquidacionCab} from "../../../shared/models/operaciones/liquidacion-cab";
import {Serie} from "../../../shared/models/facturacion/serie";
import {SunatService} from "../../../shared/services/sunat.service";
import * as fileSaver from 'file-saver';
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit, AfterViewInit {
  @ViewChild('coreCard') coreCard;
  public currentUser: User;
  public contentHeader: ContentHeader;
  public documentos: LiquidacionDocumentoCab[] = [];
  public clientes: Cliente[] = [];
  public detalle: LiquidacionDocumentoDet[] = [];
  public detalleOld: LiquidacionDocumentoDet[] = [];
  public oldDetalle: LiquidacionDocumentoDet;
  public tipoDocumento: TablaMaestra[] = [];
  public tipoDocumentoFiltro: TablaMaestra[] = [];
  public moneda: TablaMaestra[] = [];
  public monedaFiltro: TablaMaestra[] = [];
  public nroComprobante: TablaMaestra[] = [];
  public unidadMedida: TablaMaestra[] = [];
  public conceptosComprobante: TablaMaestra[] = [];
  public tipoNota: TablaMaestra[] = [];
  public tipoOperacion: TablaMaestra[] = [];
  public medioPago: TablaMaestra[] = [];
  public formaPago: TablaMaestra[] = [];
  public tipoAfectacion: TablaMaestra[] = [];
  public medioPagoSunat: TablaMaestra[] = [];
  public bienesServicios: TablaMaestra[] = [];
  public estado: TablaMaestra[] = [];
  public inafectoIGV: TablaMaestra;
  public detracciones: TablaMaestra;
  public documentoForm: FormGroup;
  public oldDocumentoForm: FormGroup;
  public detalleForm: FormGroup;
  public oldDetalleForm: FormGroup;
  public anulacionForm: FormGroup;
  public oldAnulacionForm: FormGroup;
  public filtroForm: FormGroup;
  public oldFiltroForm: FormGroup;
  public cambiarIcono: boolean = false;
  public submitted: boolean = false;
  public submitted2: boolean = false;
  public submitted_Detalle: boolean = false;
  public igv: number = 0;
  public ver: boolean = true;
  public edicion: boolean = false;

  public fila: LiquidacionDocumentoDet;
  public idTipoDocumento: number = 0;

  public search: string = '';
  public page: number = 1;
  public pageSize: number = 10;
  public collectionSize: number;

  public searchCli: string = '';
  public pageCli: number = 1;
  public pageSizeCli: number = 10;
  public collectionSizeCli: number;

  public idTipoOperacion: number = 0;
  public idTipoNota: number = 0;
  public motivo: string = '';
  public idTipoDocumentoReferencia: number = 0;
  public nroDocumentoReferencia: string = '';
  public idEstado: number = 1;
  public idBienServicioDetraccion: number = 0;
  public tasaDetraccion: number = 0;
  public montoDetraccion: number = 0;
  public nroCuentaBcoNacion: string = "";
  public idMedioPagoDetraccion: number = 0;
  public tipoCambioMoneda: number = 0;

  public clearingForm: boolean = false;
  public liquidacionDocCabActual: LiquidacionDocumentoCab;
  public documentosPendientes: LiquidacionDocumentoCab[] = [];
  public disabledDeclarar: boolean = false;
  public declaracionEfectuada: boolean = false;
  public estadoDefault: TablaMaestra[] = [];
  public series: Serie[] = [];

  get ReactiveIUForm(): any {
    return this.documentoForm.controls;
  }

  get ReactiveIUForm_Detalle(): any {
    return this.detalleForm.controls;
  }

  constructor(private utilsService: UtilsService,
              private modalService: NgbModal,
              private documentosService: DocumentosService,
              private formBuilder: FormBuilder,
              private tablaMaestraService: TablaMaestraService,
              private clientesService: ClientesService,
              private maestrosService: MaestrosService,
              private sunatService: SunatService) {
    this.contentHeader = {
      headerTitle: 'Documentos',
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
            name: 'Facturación',
            isLink: false
          },
          {
            name: 'Documentos',
            isLink: false
          }
        ]
      }
    };

    this.estadoDefault.push(
      new TablaMaestra({idColumna: 1, descripcion: 'Pendiente'}),
      new TablaMaestra({idColumna: 2, descripcion: 'Enviado a Declarar'}),
      new TablaMaestra({idColumna: 6, descripcion: 'Enviado a Anular'})
    );

    this.documentoForm = this.formBuilder.group({
      idLiquidacionDocumentoCab: [0],
      idLiquidacionCab: [0],
      tipoDocumento: [null, Validators.required],
      prefijo: [''],
      serie: [0],
      serieFormat: [{value: '', disabled: true}],
      correlativo: [0],
      nroDocumento: [''],
      // tipoOperacion: [null],
      // tipoNota: [null],
      // motivo: [''],
      idCliente: [0],
      codigoLiquidacion: [{value: '', disabled: true}],
      // codigoSolicitud: [{value: '', disabled: true}],
      rucCliente: ['', Validators.required],
      razonSocialCliente: ['', Validators.required],
      direccionCliente: ['', Validators.required],
      fechaEmision: [{
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      }, Validators.required],
      moneda: [1, Validators.required],
      formaPago: [1, Validators.required],
      medioPago: [1],
      fechaVencimiento: [null],
      monto: [{value: 0, disabled: true}],
      montoIGV: [{value: 0, disabled: true}],
      montoTotal: [{value: 0, disabled: true}],
      // tipoDocumentoReferencia: [null],
      // nroDocumentoReferencia: [''],
    });
    this.oldDocumentoForm = this.documentoForm.value;

    this.detalleForm = this.formBuilder.group({
      tipoAfectacion: [null, Validators.required],
      codigo: ['', Validators.required],
      concepto: ['', Validators.required],
      um: ['ZZ', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required]], //, Validators.min(1)
      precioUnitarioIGV: [{value: 0, disabled: true}],
      montoTotal: [{value: 0, disabled: true}],
      nroDocumentoReferencia: [''],
    });
    this.oldDetalleForm = this.detalleForm.value;

    this.anulacionForm = this.formBuilder.group({
      motivo: ['', Validators.required],
    });
    this.oldAnulacionForm = this.anulacionForm.value;

    this.filtroForm = this.formBuilder.group({
      codigoLiquidacion: [''],
      codigoSolicitud: [''],
      cliente: [''],
      moneda: [0],
      fechaEmisionDesde: [null],
      fechaEmisionHasta: [null],
      tipoDocumento: [0],
      nroDocumento: [''],
      estado: [this.estadoDefault],
      montoTotal: [0],
      serie: [null],
      correlativoMin: [0],
      correlativoMax: [0],
    });
    this.oldFiltroForm = this.filtroForm.value;
  }

  onLimpiarFiltro($event: string): void {
    if ($event === 'reload') {
      this.clearingForm = true;
      this.filtroForm.reset(this.oldFiltroForm);
      this.clearingForm = false;
      this.onListarDocumentos();
    }
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.utilsService.blockUIStart('Obteniendo información de maestros...');
    this.tipoDocumento = await this.onListarMaestros(12, 0);
    this.moneda = await this.onListarMaestros(1, 0);
    this.unidadMedida = await this.onListarMaestros(15, 0);
    this.medioPago = await this.onListarMaestros(25, 0);
    this.formaPago = await this.onListarMaestros(20, 0);
    this.tipoAfectacion = await this.onListarMaestros(22, 0);
    this.tipoAfectacion.forEach(f => f.descripcion = `${f.valor} - ${f.descripcion}`);
    this.inafectoIGV = (await this.onListarMaestros(1000, 6))[0];
    this.medioPagoSunat = await this.onListarMaestros(21, 0);
    this.bienesServicios = await this.onListarMaestros(26, 0);
    this.detracciones = (await this.onListarMaestros(1000, 10))[0];
    this.estado = await this.onListarMaestros(13, 0);
    this.tipoDocumentoFiltro = __spreadArray([], this.tipoDocumento);
    this.tipoDocumentoFiltro = this.utilsService.agregarTodos(12, this.tipoDocumentoFiltro);
    this.monedaFiltro = __spreadArray([], this.moneda);
    this.monedaFiltro = this.utilsService.agregarTodos(1, this.monedaFiltro);

    this.utilsService.blockUIStop();
    this.serieCombo();
    this.onListarDocumentos();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.coreCard.collapse();
      this.coreCard.onclickEvent.collapseStatus = true;
    }, 0);
  }

  private serieCombo() {
    this.filtroForm.get("serie").setValue(null);
    this.documentosService.serieCombo({
      idTipoDocumento: this.filtroForm.get("tipoDocumento").value,
    }).subscribe(response => {
      this.series = response;
    }, error => {
      this.utilsService.showNotification('Ha ocurrido un error al obtener la información de series', 'Error', 3);
    });
  }

  onListarDocumentos(): void {
    if (this.clearingForm) return;
    this.utilsService.blockUIStart('Obteniendo información...');
    this.documentosService.listar({
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize,
      codigoLiquidacion: this.filtroForm.get("codigoLiquidacion").value,
      codigoSolicitud: this.filtroForm.get("codigoSolicitud").value,
      cliente: this.filtroForm.get("cliente").value,
      idMoneda: this.filtroForm.get("moneda").value,
      fechaEmisionDesde: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.get("fechaEmisionDesde").value),
      fechaEmisionHasta: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.get("fechaEmisionHasta").value),
      idTipoDocumento: this.filtroForm.get("tipoDocumento").value,
      nroDocumento: this.filtroForm.get("nroDocumento").value,
      montoTotal: Number(this.filtroForm.get("montoTotal").value),
      idsEstados: this.filtroForm.get("estado").value.map(m => String(m.idColumna)).join(','),
      serie: this.filtroForm.get("serie").value ?? 0,
      correlativoMin: Number(this.filtroForm.get("correlativoMin").value),
      correlativoMax: Number(this.filtroForm.get("correlativoMax").value),
    }).subscribe((response: LiquidacionDocumentoCab[]) => {
      response.forEach(el => {
        el.ok = false;
        el.estadoActual = 0;
        el.mensajeRetorno = "";
        el.added = false;
      });
      this.documentos = response;
      this.documentosPendientes.forEach(el => {
        const row = this.documentos.find(f => f.idLiquidacionDocumentoCab === el.idLiquidacionDocumentoCab)
        if (row != null)
          row.added = true;
      });
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  async onListarMaestros(idTabla: number, idColumna: number): Promise<TablaMaestra[]> {
    return await this.tablaMaestraService.listar({
      idTabla: idTabla,
      idColumna: idColumna
    }).then((response: TablaMaestra[]) => response, error => [])
      .catch(error => []);
  }

  onListarClientePagador(): void {
    this.utilsService.blockUIStart('Obteniendo clientes...');
    this.clientesService.listar({
      idTipoOperacion: 0,
      search: this.searchCli,
      pageIndex: this.pageCli,
      pageSize: this.pageSizeCli
    }).subscribe(response => {
      this.clientes = response;
      this.collectionSizeCli = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onSeleccionarCliente(modal, item: Cliente): void {
    this.ReactiveIUForm.idCliente.setValue(item.idCliente);
    this.ReactiveIUForm.rucCliente.setValue(item.ruc);
    this.ReactiveIUForm.razonSocialCliente.setValue(item.razonSocial);
    this.ReactiveIUForm.direccionCliente.setValue(item.direccionFacturacion);
    modal.dismiss();
  }

  onBuscarCliente(modal): void {
    this.searchCli = "";
    this.onListarClientePagador();
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        backdrop: 'static',
        windowClass: 'my-class1',
        animation: true,
        //size: 'lg',

        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onCambiarVisibilidadDetalleTodo(): void {
    this.cambiarIcono = !this.cambiarIcono;
    this.documentos.forEach(el => {
      el.cambiarIcono = this.cambiarIcono;
      document.getElementById('tr' + el.idLiquidacionDocumentoCab).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
      document.getElementById('detail' + el.idLiquidacionDocumentoCab).style.display = (el.cambiarIcono) ? "block" : "none";
    });
  }

  onCambiarVisibilidadDetalle(item: any): void {
    item.cambiarIcono = !item.cambiarIcono;
    document.getElementById('tr' + item.idLiquidacionDocumentoCab).style.visibility = (item.cambiarIcono) ? "visible" : "collapse";
    document.getElementById('detail' + item.idLiquidacionDocumentoCab).style.display = (item.cambiarIcono) ? "block" : "none";
  }

  async onNuevo(modal: any): Promise<void> {
    this.edicion = false;
    this.idEstado = 1;
    this.ver = true;
    this.utilsService.blockUIStart('Obteniendo IGV...');
    this.igv = Number((await this.onListarMaestros(1000, 2))[0].valor);
    this.utilsService.blockUIStop();
    //await this.onRefrescarCorrelativo();

    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        backdrop: 'static',
        windowClass: 'my-class',
        animation: true,
        //size: 'lg',

        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  async onRefrescarCorrelativo(idTipoDocumento: number): Promise<void> {
    this.utilsService.blockUIStart('Obteniendo último correlativo...');
    //this.nroComprobante = await this.onListarMaestros((idTipoDocumento === 1) ? 14 : ((idTipoDocumento === 3) ? 24 : 23), 0);

    // let prefijo = this.nroComprobante.find(f => f.idColumna === 1).valor;
    // let nroDigitosSerie = Number(this.nroComprobante.find(f => f.idColumna === 2).valor);
    // let serie = Number(this.nroComprobante.find(f => f.idColumna === 3).valor);
    // let correlativo = Number(this.nroComprobante.find(f => f.idColumna === 4).valor);

    // serie = correlativo === 99999999 ? serie + 1 : serie;

    // this.ReactiveIUForm.prefijo.setValue(prefijo);
    // this.ReactiveIUForm.serie.setValue(serie);
    // this.ReactiveIUForm.correlativo.setValue(String(correlativo === 99999999 ? 1 : correlativo + 1).padStart(8, '0'));
    // this.ReactiveIUForm.serieFormat.setValue(prefijo + String(serie).padStart(nroDigitosSerie, '0'));
    // this.ReactiveIUForm.nroDocumento.setValue(this.ReactiveIUForm.serieFormat.value + '-' + String(Number(this.ReactiveIUForm.correlativo.value)).padStart(8, '0'));
    this.utilsService.blockUIStop();
  }

  onCambioCorrelativo($event): void {
    this.ReactiveIUForm.nroDocumento.setValue(this.ReactiveIUForm.serieFormat.value + '-' + String(Number($event)).padStart(8, '0'));
  }

  // onCambioMonto($event): void {
  //   this.ReactiveIUForm.montoIGV.setValue(Math.round(((Number($event) * (this.igv / 100)) + Number.EPSILON) * 100) / 100);
  //   this.ReactiveIUForm.montoTotal.setValue(Math.round((
  //     (Number($event) * (1 + (this.igv / 100))) + Number.EPSILON
  //   ) * 100) / 100);
  // }

  onCambioMontoTotal(item: LiquidacionDocumentoDet): void {
    let inafecto = this.inafectoIGV.valor.split(',');
    if (item === null) {
      if (inafecto.includes(String(this.ReactiveIUForm_Detalle.tipoAfectacion.value)))
        this.ReactiveIUForm_Detalle.precioUnitarioIGV.setValue(0)
      else
        this.ReactiveIUForm_Detalle.precioUnitarioIGV.setValue(
          Math.round(((this.ReactiveIUForm_Detalle.precioUnitario.value * (this.igv / 100)) + Number.EPSILON) * 100) / 100
        );

      this.ReactiveIUForm_Detalle.montoTotal.setValue(
        Math.round(((this.ReactiveIUForm_Detalle.cantidad.value * this.ReactiveIUForm_Detalle.precioUnitario.value) + Number.EPSILON) * 100) / 100
      );
    } else {
      if (inafecto.includes(String(item.idTipoAfectacion)))
        item.precioUnitarioIGV = 0;
      else
        item.precioUnitarioIGV = Math.round(((item.precioUnitario * (this.igv / 100)) + Number.EPSILON) * 100) / 100;
      item.montoTotal = item.cantidad * item.precioUnitario;
    }
  }

  async onEditar(modal: any, cab: LiquidacionDocumentoCab): Promise<void> {
    this.edicion = true;
    this.idEstado = cab.idEstado;
    if (cab.idEstado != 1)
      this.documentoForm.disable({onlySelf: true});

    this.ver = cab.idEstado === 1;
    await this.onTipoDocumento(cab.idTipoDocumento);
    this.igv = cab.igv;
    this.ReactiveIUForm.idLiquidacionDocumentoCab.setValue(cab.idLiquidacionDocumentoCab);
    this.ReactiveIUForm.idLiquidacionCab.setValue(cab.idLiquidacionCab);
    this.ReactiveIUForm.codigoLiquidacion.setValue(cab.codigo);
    this.ReactiveIUForm.tipoDocumento.disable();
    this.ReactiveIUForm.tipoDocumento.setValue(cab.idTipoDocumento);
    this.ReactiveIUForm.prefijo.setValue(cab.prefijo);
    this.ReactiveIUForm.serie.setValue(cab.serie);
    this.ReactiveIUForm.serieFormat.setValue(cab.nroDocumento != '' ? cab.nroDocumento.split('-')[0] : '');
    this.ReactiveIUForm.correlativo.setValue(cab.nroDocumento != '' ? cab.nroDocumento.split('-')[1] : 0);
    this.ReactiveIUForm.nroDocumento.setValue(cab.nroDocumento);
    this.idTipoOperacion = cab.idTipoOperacion;
    this.idTipoNota = cab.idTipoNota;
    this.motivo = cab.motivo;
    this.ReactiveIUForm.idCliente.setValue(cab.idCliente);
    this.ReactiveIUForm.rucCliente.setValue(cab.rucCliente);
    this.ReactiveIUForm.razonSocialCliente.setValue(cab.razonSocialCliente);
    this.ReactiveIUForm.direccionCliente.setValue(cab.direccionCliente);
    this.ReactiveIUForm.fechaEmision.setValue(cab.fechaEmision);
    this.ReactiveIUForm.moneda.setValue(cab.idMoneda);
    this.ReactiveIUForm.formaPago.setValue(cab.idFormaPago);
    this.ReactiveIUForm.medioPago.setValue(cab.idMedioPago);
    this.ReactiveIUForm.fechaVencimiento.setValue(cab.fechaVencimiento);
    this.ReactiveIUForm.monto.setValue(cab.monto);
    this.ReactiveIUForm.montoIGV.setValue(cab.montoIGV);
    this.ReactiveIUForm.montoTotal.setValue(cab.montoTotal);
    this.idTipoDocumentoReferencia = cab.idTipoDocumentoReferencia;
    this.nroDocumentoReferencia = cab.nroDocumentoReferencia;
    this.detalle = cab.liquidacionDocumentoDet;

    for (const det of this.detalle) {
      det.total = (det.precioUnitario * det.cantidad) + det.precioUnitarioIGV;
    }

    this.idBienServicioDetraccion = cab.idBienServicioDetraccion;
    this.tasaDetraccion = cab.tasaDetraccion;
    this.montoDetraccion = cab.montoDetraccion;
    this.nroCuentaBcoNacion = cab.nroCuentaBcoNacion;
    this.idMedioPagoDetraccion = cab.idMedioPagoDetraccion;
    this.tipoCambioMoneda = cab.tipoCambioMoneda;

    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        backdrop: 'static',
        windowClass: 'my-class',
        animation: true,
        //size: 'lg',

        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onCancelar(): void {
    this.detalle = [];
    this.submitted = false;
    this.idTipoOperacion = 0;
    this.idTipoNota = 0;
    this.motivo = '';
    this.idTipoDocumentoReferencia = 0;
    this.nroDocumentoReferencia = '';
    this.documentoForm.reset(this.oldDocumentoForm);
    this.documentoForm.enable({onlySelf: true});
    this.documentoForm.controls.serieFormat.disable();
    this.documentoForm.controls['monto'].disable();
    this.documentoForm.controls['montoIGV'].disable();
    this.documentoForm.controls['montoTotal'].disable();
    this.modalService.dismissAll();
    this.onListarDocumentos();
  }

  onGuardar(): void {
    this.submitted = true;
    if (this.documentoForm.invalid) {
      return;
    }

    if (this.idTipoOperacion === 0 && this.idTipoDocumento === 1)
      return;

    if ((this.idTipoNota === 0 || this.motivo === "" || this.idTipoDocumentoReferencia === 0
      || this.nroDocumentoReferencia === "") && this.idTipoDocumento != 1)
      return;

    if ((this.idTipoDocumento === 1 && this.onDetracciones(this.idTipoOperacion)) &&
      (this.idBienServicioDetraccion === 0 || this.tasaDetraccion <= 0 || this.montoDetraccion <= 0
        || this.nroCuentaBcoNacion === "" || this.idMedioPagoDetraccion === 0))
      return;

    if ((this.idTipoDocumento === 1 && this.onDetracciones(this.idTipoOperacion)
      && this.documentoForm.controls.moneda.value > 1) && this.tasaDetraccion <= 0)
      return;

    if (this.detalle.filter(f => f.estado).length === 0) {
      this.utilsService.showNotification("Debe agregar al menos un item al detalle del documento", "Advertencia", 2);
      return;
    }

    this.utilsService.blockUIStart("Guardando...");
    // if (this.detalleOld.length === 0) {
    //   // @ts-ignore
    //   this.detalleOld = [...this.detalle];
    // } else {
    //   this.detalle = [...this.detalleOld];
    // }

    this.documentosService.guardar({
      idEmpresa: this.currentUser.idEmpresa,
      idLiquidacionDocumentoCab: this.documentoForm.controls.idLiquidacionDocumentoCab.value,
      idLiquidacionCab: this.documentoForm.controls.idLiquidacionCab.value,
      idTipoDocumento: this.documentoForm.controls.tipoDocumento.value,
      prefijo: this.documentoForm.controls.prefijo.value,
      serie: this.documentoForm.controls.serie.value,
      correlativo: Number(this.documentoForm.controls.correlativo.value) ?? 0,
      nroDocumento: this.documentoForm.controls.nroDocumento.value,
      idTipoOperacion: this.idTipoOperacion,
      idTipoNota: this.idTipoNota,
      motivo: this.motivo,
      idCliente: this.documentoForm.controls.idCliente.value,
      rucCliente: this.documentoForm.controls.rucCliente.value,
      razonSocialCliente: this.documentoForm.controls.razonSocialCliente.value,
      direccionCliente: this.documentoForm.controls.direccionCliente.value,
      fechaEmisionFormat: this.utilsService.formatoFecha_YYYYMMDD(this.documentoForm.controls.fechaEmision.value),
      idMoneda: this.documentoForm.controls.moneda.value,
      idFormaPago: this.documentoForm.controls.formaPago.value,
      idMedioPago: this.documentoForm.controls.medioPago.value,
      fechaVencimientoFormat: this.utilsService.formatoFecha_YYYYMMDD(this.documentoForm.controls.fechaVencimiento.value),
      monto: this.documentoForm.controls.monto.value,
      idUsuarioAud: this.currentUser.idUsuario,
      idTipoDocumentoReferencia: this.idTipoDocumentoReferencia,
      nroDocumentoReferencia: this.nroDocumentoReferencia,
      idBienServicioDetraccion: this.idBienServicioDetraccion,
      tasaDetraccion: this.tasaDetraccion,
      montoDetraccion: this.montoDetraccion,
      nroCuentaBcoNacion: this.nroCuentaBcoNacion,
      idMedioPagoDetraccion: this.idMedioPagoDetraccion,
      tipoCambioMoneda: this.tipoCambioMoneda,
      liquidacionDocumentoDet: this.detalle.filter(f => f.editado)
    }).subscribe((response: any) => {
      switch (response.tipo) {
        case 1:
          this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
          this.utilsService.blockUIStop();
          this.onCancelar();
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

  onAgregarDetalle(): void {
    if (this.detalle.filter(a => a.edicion).length > 0) {
      this.utilsService.showNotification("Primero debe finalizar la edición del registro actual", 'Alerta', 2);
      return;
    }

    this.submitted_Detalle = true;
    if (this.detalleForm.invalid)
      return;

    this.detalle.push({
      idLiquidacionDocumentoDet: 0,
      idLiquidacionDocumentoCab: 0,
      idTipoAfectacion: this.ReactiveIUForm_Detalle.tipoAfectacion.value,
      codigoTipoAfectacion: this.tipoAfectacion.find(f => f.idColumna === this.ReactiveIUForm_Detalle.tipoAfectacion.value).valor,
      tipoAfectacion: this.tipoAfectacion.find(f => f.idColumna === this.ReactiveIUForm_Detalle.tipoAfectacion.value).descripcion,
      codigo: this.ReactiveIUForm_Detalle.codigo.value,
      concepto: this.ReactiveIUForm_Detalle.concepto.value,
      um: this.ReactiveIUForm_Detalle.um.value,
      uM_Desc: this.unidadMedida.find(f => f.valor == this.ReactiveIUForm_Detalle.um.value).descripcion,
      cantidad: this.ReactiveIUForm_Detalle.cantidad.value,
      precioUnitario: this.ReactiveIUForm_Detalle.precioUnitario.value,
      precioUnitarioIGV: this.ReactiveIUForm_Detalle.precioUnitarioIGV.value,
      montoTotal: this.ReactiveIUForm_Detalle.montoTotal.value,
      total: (this.ReactiveIUForm_Detalle.precioUnitario.value * this.ReactiveIUForm_Detalle.cantidad.value) + this.ReactiveIUForm_Detalle.precioUnitarioIGV.value,
      nroDocumentoReferencia: this.ReactiveIUForm_Detalle.nroDocumentoReferencia.value,
      estado: true,
      idFila: this.utilsService.autoIncrement(this.detalle),
      edicion: false,
      editado: true
    });

    this.ReactiveIUForm.monto.setValue(
      Math.round(
        (this.detalle.reduce((sum, current) => sum + current.montoTotal, 0) + Number.EPSILON)
        * 100
      ) / 100
    );
    this.ReactiveIUForm.montoIGV.setValue(Math.round((this.detalle.reduce((sum, current) => sum + (current.precioUnitarioIGV * current.cantidad), 0) + Number.EPSILON) * 100) / 100);
    this.ReactiveIUForm.montoTotal.setValue(Math.round(((this.ReactiveIUForm.monto.value + this.ReactiveIUForm.montoIGV.value) + Number.EPSILON) * 100) / 100);
    this.detalleForm.reset(this.oldDetalleForm);
    this.submitted_Detalle = false;
  }

  onEditarDetalle(item: LiquidacionDocumentoDet): void {
    if (this.detalle.filter(f => f.edicion).length > 0) {
      this.utilsService.showNotification("Confirme los cambios de la fila actual primero", "Advertencia", 2);
      return;
    }

    this.oldDetalle = {...item};
    item.edicion = true;
  }

  onCancelarDetalle(item: LiquidacionDocumentoDet): void {
    item.idLiquidacionDocumentoDet = this.oldDetalle.idLiquidacionDocumentoDet;
    item.idLiquidacionDocumentoCab = this.oldDetalle.idLiquidacionDocumentoCab;
    item.idTipoAfectacion = this.oldDetalle.idTipoAfectacion;
    item.codigoTipoAfectacion = this.oldDetalle.codigoTipoAfectacion;
    item.tipoAfectacion = this.oldDetalle.tipoAfectacion;
    item.codigo = this.oldDetalle.codigo;
    item.concepto = this.oldDetalle.concepto;
    item.um = this.oldDetalle.um;
    item.uM_Desc = this.oldDetalle.uM_Desc;
    item.cantidad = this.oldDetalle.cantidad;
    item.precioUnitario = this.oldDetalle.precioUnitario;
    item.precioUnitarioIGV = this.oldDetalle.precioUnitarioIGV;
    item.montoTotal = this.oldDetalle.montoTotal;
    item.total = this.oldDetalle.total;
    item.nroDocumentoReferencia = this.oldDetalle.nroDocumentoReferencia;
    item.estado = this.oldDetalle.estado;
    item.idFila = this.oldDetalle.idFila;
    item.edicion = this.oldDetalle.edicion;
    item.editado = this.oldDetalle.editado;
  }

  onConfirmarCambioDetalle(item: LiquidacionDocumentoDet): void {
    item.edicion = false;
    item.editado = true;
    this.ReactiveIUForm.monto.setValue(Math.round((this.detalle.reduce((sum, current) => sum + current.montoTotal, 0)) * 100) / 100);
    this.ReactiveIUForm.montoIGV.setValue(Math.round((this.detalle.reduce((sum, current) => sum + (current.precioUnitarioIGV * current.cantidad), 0) + Number.EPSILON) * 100) / 100);
    this.ReactiveIUForm.montoTotal.setValue(Math.round(((this.ReactiveIUForm.monto.value + this.ReactiveIUForm.montoIGV.value) + Number.EPSILON) * 100) / 100);
    item.uM_Desc = this.unidadMedida.find(f => f.valor == item.um).descripcion;
    item.codigoTipoAfectacion = this.tipoAfectacion.find(f => f.idColumna === item.idTipoAfectacion).valor;
    item.tipoAfectacion = this.tipoAfectacion.find(f => f.idColumna === item.idTipoAfectacion).descripcion;
  }

  onEliminarDetalle(item: LiquidacionDocumentoDet): void {
    if (item.idLiquidacionDocumentoDet == 0) {
      this.detalle = this.detalle.filter(f => f.idFila != item.idFila);
    } else {
      Swal.fire({
        title: 'Confirmación',
        text: `¿Desea eliminar el registro "${item.codigo}"?, esta acción no podrá revertirse`,
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
          item.estado = false;
          item.editado = true;
        }
      });
    }
  }

  onFirmarPublicarDeclarar(cab: LiquidacionDocumentoCab): void {
    this.utilsService.blockUIStart("Enviando información...");
    cab.idEmpresa = this.currentUser.idEmpresa;
    cab.idUsuarioAud = this.currentUser.idUsuario;
    this.documentosService.firmaPublicacionDeclaracion(cab).subscribe((response: any) => {
      switch (response.tipo) {
        case 1:
          this.utilsService.showNotification(`Información enviada correctamente${response.mensaje}`, 'Confirmación', 1);
          this.utilsService.blockUIStop();
          this.onCancelar();
          break;
        case 2:
          this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
          this.utilsService.blockUIStop();
          break;
        case 3:
          this.utilsService.showNotification(response.mensaje, 'Atención', 2);
          this.utilsService.blockUIStop();
          this.onCancelar();
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

  onConsultarEstado(cab: LiquidacionDocumentoCab): void {
    this.utilsService.blockUIStart("Actualizando Estado...");
    cab.idEmpresa = this.currentUser.idEmpresa;
    cab.idUsuarioAud = this.currentUser.idUsuario;
    this.documentosService.consultarEstado(cab).subscribe((response: any) => {
      switch (response.tipo) {
        case 1:
          this.utilsService.showNotification('Información actualizada', 'Confirmación', 1);
          if (response.mensaje.length > 0)
            this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
          this.utilsService.blockUIStop();
          this.onCancelar();
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

  onEliminar(cab: LiquidacionDocumentoCab): void {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Desea eliminar el registro '${cab.codigo}'?, esta acción no podrá revertirse`,
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
        this.utilsService.blockUIStart("Eliminando...");
        this.documentosService.eliminar({
          idLiquidacionDocumentoCab: cab.idLiquidacionDocumentoCab,
          idUsuarioAud: this.currentUser.idUsuario,
        }).subscribe((response: any) => {
          switch (response.tipo) {
            case 1:
              this.utilsService.showNotification('Registro eliminado correctamente', 'Confirmación', 1);
              this.utilsService.blockUIStop();
              this.onCancelar();
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

  async onBuscarConcepto(modal, fila: LiquidacionDocumentoDet): Promise<void> {
    this.utilsService.blockUIStart("Obteniendo conceptos...");
    this.fila = fila;
    this.conceptosComprobante = await this.onListarMaestros(16, 0);
    this.utilsService.blockUIStop();
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        backdrop: 'static',
        //windowClass: 'my-class',
        animation: true,
        //size: 'lg',

        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onCerrarConceptos(modal): void {
    modal.dismiss("");
  }

  async onSeleccionarConcepto(tm: TablaMaestra, modal): Promise<void> {
    let rel: TablaMaestraRelacion = await this.maestrosService.obtenerRelacionAsync({
      idTabla1: 16,
      idColumna1: tm.idColumna
    }).then((response: TablaMaestraRelacion) => response).catch(error => null);

    if (this.fila === null) {
      this.ReactiveIUForm_Detalle.codigo.setValue(tm.valor);
      this.ReactiveIUForm_Detalle.concepto.setValue(tm.descripcion);

      this.ReactiveIUForm_Detalle.tipoAfectacion.setValue(rel != null ? rel.idColumna_2 : null);
    } else {
      this.fila.codigo = tm.valor;
      this.fila.concepto = tm.descripcion;

      this.fila.idTipoAfectacion = rel != null ? rel.idColumna_2 : 0
    }

    modal.dismiss("");
  }

  async onTipoDocumento($event): Promise<void> {
    this.utilsService.blockUIStart('Obteniendo información de maestros...');
    this.idTipoDocumento = $event;
    if ($event === 1) {
      // if (!this.edicion)
      //   await this.onRefrescarCorrelativo($event);

      this.tipoOperacion = await this.onListarMaestros(17, 0);
      this.tipoNota = [];

      this.idTipoNota = 0;
      this.motivo = '';
      this.idTipoOperacion = 1;
      this.ReactiveIUForm.medioPago.setValue(1);
      this.ReactiveIUForm.fechaVencimiento.setValue(this.ReactiveIUForm.fechaEmision.value);
      this.idTipoDocumentoReferencia = 0;
      this.nroDocumentoReferencia = '';
    } else if ($event === 3) {
      // if (!this.edicion)
      //   await this.onRefrescarCorrelativo($event);
      this.tipoNota = await this.onListarMaestros(18, 0);
      this.tipoOperacion = [];

      this.idTipoNota = 1;
      this.onTipoNota(1);
      this.idTipoOperacion = 0;
      this.ReactiveIUForm.fechaVencimiento.setValue(null);
      this.ReactiveIUForm.medioPago.setValue(0);
    } else if ($event === 4) {
      // if (!this.edicion)
      //   await this.onRefrescarCorrelativo($event);
      this.tipoNota = await this.onListarMaestros(19, 0);
      this.tipoOperacion = [];

      this.idTipoNota = 1;
      this.onTipoNota(1);
      this.idTipoOperacion = 0;
      this.ReactiveIUForm.fechaVencimiento.setValue(null);
      this.ReactiveIUForm.medioPago.setValue(0);
    }
    this.utilsService.blockUIStop();
  }

  onTipoNota($event): void {
    this.motivo = this.tipoNota.find(f => f.idColumna === $event).descripcion.toUpperCase();
  }

  onDetracciones(idTipoOperacion: number): boolean {
    return this.detracciones.valor.split(',').includes(String(idTipoOperacion));
  }

  onCambioTipoOperacion($event): void {
    this.idBienServicioDetraccion = $event === 19 ? 20 : 0;
    this.tasaDetraccion = 0;
    this.montoDetraccion = 0;
    this.nroCuentaBcoNacion = "";
    this.idMedioPagoDetraccion = 0;
  }

  onCalcularMonto(): void {
    if (this.ReactiveIUForm.moneda.value > 1)
      this.montoDetraccion = Math.round((((this.ReactiveIUForm.montoTotal.value * (this.tasaDetraccion / 100)) * this.tipoCambioMoneda) + Number.EPSILON) * 100) / 100;
    else
      this.montoDetraccion = Math.round(((this.ReactiveIUForm.montoTotal.value * (this.tasaDetraccion / 100)) + Number.EPSILON) * 100) / 100;
  }

  onCambioMoneda($event): void {
    if ($event === 1) {
      this.tipoCambioMoneda = 0;
    }

    this.onCalcularMonto();
  }

  onAnulacion(cab: LiquidacionDocumentoCab, modal): void {
    this.liquidacionDocCabActual = cab;
    this.anulacionForm.reset(this.oldAnulacionForm);
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        backdrop: 'static',
        windowClass: 'my-class1',
        animation: true,
        //size: 'lg',
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onAnular(modal: any) {
    if (this.anulacionForm.invalid) return;

    this.utilsService.blockUIStart("Enviando a anular...");
    this.liquidacionDocCabActual.idEmpresa = this.currentUser.idEmpresa;
    this.liquidacionDocCabActual.motivoAnulacion = this.anulacionForm.controls.motivo.value;
    this.documentosService.anular(this.liquidacionDocCabActual).subscribe((response: any) => {
      switch (response.tipo) {
        case 1:
          this.utilsService.showNotification('Información enviada correctamente', 'Confirmación', 1);
          this.utilsService.blockUIStop();
          modal.dismiss();
          this.onCancelar();
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

  onBuscarDocumento(): void {
    this.submitted2 = true;
    if (this.idTipoDocumentoReferencia === 0 || this.nroDocumentoReferencia === '')
      return;

    this.utilsService.blockUIStart("Buscando documento...");
    this.documentosService.obtenerPorNroDocumento({
      idTipoDocumento: this.idTipoDocumentoReferencia,
      nroDocumento: this.nroDocumentoReferencia
    }).subscribe((response: LiquidacionDocumentoCab) => {
      if (response != null) {
        this.documentoForm.controls.idCliente.setValue(response.idCliente);
        this.documentoForm.controls.rucCliente.setValue(response.rucCliente);
        this.documentoForm.controls.razonSocialCliente.setValue(response.razonSocialCliente);
        this.documentoForm.controls.direccionCliente.setValue(response.direccionCliente);
        this.documentoForm.controls.moneda.setValue(response.idMoneda);
        this.documentoForm.controls.formaPago.setValue(response.idFormaPago);
        this.documentoForm.controls.monto.setValue(response.monto);
        this.documentoForm.controls.montoIGV.setValue(response.montoIGV);
        this.documentoForm.controls.montoTotal.setValue(response.montoTotal);

        this.detalle = [];
        for (const item of response.liquidacionDocumentoDet) {
          this.detalle.push({
            idLiquidacionDocumentoDet: 0,
            idLiquidacionDocumentoCab: 0,
            idTipoAfectacion: item.idTipoAfectacion,
            codigoTipoAfectacion: item.codigoTipoAfectacion,
            tipoAfectacion: item.tipoAfectacion,
            codigo: item.codigo,
            concepto: item.concepto,
            um: item.um,
            uM_Desc: item.uM_Desc,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            precioUnitarioIGV: item.precioUnitarioIGV,
            montoTotal: item.montoTotal,
            total: (item.precioUnitario * item.cantidad) + item.precioUnitarioIGV,
            nroDocumentoReferencia: item.nroDocumentoReferencia,
            estado: true,
            idFila: this.utilsService.autoIncrement(this.detalle),
            edicion: false,
            editado: true
          });
        }
      } else
        this.utilsService.showNotification('No se encontró información asociado a este número de documento', 'Información', 4);
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onLimpiarFechaFiltro(hasta: boolean) {
    if (hasta)
      this.filtroForm.get("fechaEmisionHasta").setValue(null);
    else
      this.filtroForm.get("fechaEmisionDesde").setValue(null);
  }

  onDeclaracionMultiple(modal: any): void {
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        backdrop: 'static',
        size: 'xl',
        animation: true,
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onAgregarDeclaracionMasiva(cab: LiquidacionDocumentoCab): void {
    if (this.documentosPendientes.find(f => f.idLiquidacionDocumentoCab === cab.idLiquidacionDocumentoCab) != null) {
      this.utilsService.showNotification("El documento ya ha sido agregado", "Validación", 2);
      return;
    }

    this.documentosPendientes.push({...cab});
    this.documentos.find(f => f.idLiquidacionDocumentoCab === cab.idLiquidacionDocumentoCab).added = true;
    this.utilsService.showNotification("Agregado correctamente", "Información", 4)
  }

  async onDeclararMultiple(): Promise<void> {
    if (this.documentosPendientes.length === 0)
      return;

    this.disabledDeclarar = true;
    this.declaracionEfectuada = true;
    for (const cab of this.documentosPendientes) {
      cab.estadoActual = 1;
    }

    for (const cab of this.documentosPendientes) {
      cab.estadoActual = 2;
      cab.idEmpresa = this.currentUser.idEmpresa;
      cab.idUsuarioAud = this.currentUser.idUsuario;
      const response = await this.documentosService.firmaPublicacionDeclaracionAsync(cab)
        .catch(error => {
          return {tipo: 0, mensaje: error.message};
        });
      cab.ok = response.tipo === 1;
      cab.estadoActual = 3;
      cab.mensajeRetorno = (cab.ok ? "Envío a declaración satisfactorio" : "") + response.mensaje;
    }
    this.disabledDeclarar = false;
  }

  onEstado(id: number): string {
    switch (id) {
      case 0:
        return "No iniciado";
      case 1:
        return "En espera...";
      case 2:
        return "En proceso...";
      case 3:
        return "Finalizado";
    }
  }

  onLimpiarDeclaracion() {
    this.documentosPendientes = [];
    this.declaracionEfectuada = false;
  }

  onLimpiar(item: LiquidacionDocumentoCab) {
    this.documentosPendientes = this.documentosPendientes.filter(f => f.idLiquidacionDocumentoCab !== item.idLiquidacionDocumentoCab);
    this.documentos.find(f => f.idLiquidacionDocumentoCab === item.idLiquidacionDocumentoCab).added = false;

    if (this.documentosPendientes.length === 0)
      this.declaracionEfectuada = false;
  }

  onCancelarDeclaracion(modal: any) {
    this.onListarDocumentos();
    modal.dismiss();
  }

  onEnviarCorreo(cab: LiquidacionDocumentoCab): void {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Está seguro de enviar la notificación del documento '${cab.nroDocumento}'?`,
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
        this.utilsService.blockUIStart('Enviando correo...');
        this.documentosService.enviarCorreo(cab).subscribe(response => {
          if (response.tipo === 1) {
            this.utilsService.showNotification('Correo enviado correctamente', 'Confirmación', 1);
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

  onBuscarLiquidacion(modal: NgbModal): void {
    this.modalService.open(modal, {
      scrollable: true,
      backdrop: 'static',
      windowClass: 'my-class',
      animation: true,
      //size: 'lg',
    });
  }

  onCancelarModal(modal: NgbModalRef): void {
    modal.close();
  }

  onSelectLiquidacion($event: LiquidacionCab, modal: NgbModalRef): void {
    const {
      idLiquidacionCab,
      codigo: codigoLiquidacion,
      idCliente,
      rucCliente,
      razonSocialCliente,
      direccionFacturacionCliente: direccionCliente
    } = $event;
    const patchValues = {
      idLiquidacionCab,
      codigoLiquidacion,
      idCliente,
      rucCliente,
      razonSocialCliente,
      direccionCliente
    };
    this.documentoForm.patchValue(patchValues);
    this.utilsService.showNotification(`Liquidación ${codigoLiquidacion} seleccionada`, 'Información', 4);
    modal.close();
  }

  onManual(rucCliente: HTMLInputElement): void {
    Swal.fire({
      title: 'Confirmación',
      text: `Se cambiará el cliente del documento de forma manual. Con tan solo confirmar, se perderá la referencia y afectará al envío de correo. ¿Desea continuar?`,
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
        this.ReactiveIUForm.idCliente.setValue(0);
        setTimeout(() => {
          rucCliente.focus();
        }, 500);
      }
    });
  }

  onFTipoDocumentoChange(): void {
    this.serieCombo();
    this.onListarDocumentos();
  }

  onActualizarDireccion(): void {
    const idCliente = this.ReactiveIUForm.idCliente.value;
    const rucCliente = this.ReactiveIUForm.rucCliente.value;
    if (idCliente === 0) return;
    if (rucCliente === '') {
      this.utilsService.showNotification('Ingrese el RUC del cliente', 'Error', 3);
      return;
    }
    // this.clientesService.obtener({idCliente})
    //   .subscribe(response => {
    //     this.documentoForm.controls.direccionCliente.setValue(response.cliente.direccionFacturacion);
    //   }, error => {
    //     this.utilsService.showNotification("Ocurrió un error al obtener los datos del cliente", 'Error', 3);
    //   });

    this.utilsService.blockUIStart('Consultando...');

    this.sunatService.getToken({
      usuario: 'sunat',
      clave: 'cX5sZnNpJf9gbhmPUL'
    }).subscribe(response => {
      if (response.ok) {
        this.utilsService.showNotification('Token generado correctamente', 'Confirmación', 1);
        this.sunatService.getData({
          ruc: this.ReactiveIUForm.rucCliente.value,
          token: response.data
        }).subscribe(res => {
          if (res.ok) {
            if (res.data.length) {
              this.utilsService.showNotification('Datos obtenidos correctamente', 'Confirmación', 1);
              this.ReactiveIUForm.razonSocialCliente.setValue(res.data[0].nombreRazonSocial);
              let direccion = this.utilsService.getSunat_Direccion(res.data[0]);
              this.ReactiveIUForm.direccionCliente.setValue(direccion.trim());
              this.clientesService.actualizarDireccion({
                idCliente: this.ReactiveIUForm.idCliente.value,
                direccionPrincipal: direccion,
                idUsuarioAud: this.currentUser.idUsuario
              }).subscribe(response => {
                this.utilsService.showNotification('Dirección del cliente actualizada', 'Confirmación', 1);
              }, error => {
                this.utilsService.showNotification('Ocurrió un error al actualizar la dirección del cliente', 'Error', 3);
              });
            }
            else
            {
              this.utilsService.showNotification(`No se encotrarón datos para el RUC: ${this.ReactiveIUForm.rucCliente.value}`, 'Alerta', 2);
            }

            this.utilsService.blockUIStop();
          } else {
            this.utilsService.showNotification(res.mensaje, 'Error', 3);
          }

          this.utilsService.blockUIStop();
        }, error => {
          this.utilsService.showNotification('[F]: Error al obtener los datos del RUC', 'Error', 3);
          this.utilsService.blockUIStop();
        });
      } else if (response.tipo === 2) {
        this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
      } else {
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
      }
    }, error => {
      this.utilsService.showNotification('[F]: Error al obtener el token', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onDownload() {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.documentosService.descargar({
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize,
      codigoLiquidacion: this.filtroForm.get("codigoLiquidacion").value,
      codigoSolicitud: this.filtroForm.get("codigoSolicitud").value,
      cliente: this.filtroForm.get("cliente").value,
      idMoneda: this.filtroForm.get("moneda").value,
      fechaEmisionDesde: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.get("fechaEmisionDesde").value),
      fechaEmisionHasta: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.get("fechaEmisionHasta").value),
      idTipoDocumento: this.filtroForm.get("tipoDocumento").value,
      nroDocumento: this.filtroForm.get("nroDocumento").value,
      montoTotal: Number(this.filtroForm.get("montoTotal").value),
      idsEstados: this.filtroForm.get("estado").value.map(m => String(m.idColumna)).join(','),
      serie: this.filtroForm.get("serie").value ?? 0,
      correlativoMin: Number(this.filtroForm.get("correlativoMin").value),
      correlativoMax: Number(this.filtroForm.get("correlativoMax").value),
    }).subscribe((response) => {
      let blob: any = new Blob([response], {type: 'application/zip'});
      //const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, `documents_${formatDate(new Date(), 'yyyyMMddHHmmss', 'en-US')}`);
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }
}
