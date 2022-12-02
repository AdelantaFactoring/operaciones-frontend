import {Component, OnInit} from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {DocumentosService} from "./documentos.service";
import {LiquidacionDocumentoCab} from "../../../shared/models/facturacion/liquidaciondocumento-cab";
import {LiquidacionDocumentoDet} from "../../../shared/models/facturacion/liquidaciondocumento-det";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";
import Swal from "sweetalert2";
import {ClientesService} from "../../comercial/clientes/clientes.service";
import {Cliente} from "../../../shared/models/comercial/cliente";
import {User} from 'app/shared/models/auth/user';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {
  public currentUser: User;
  public contentHeader: object;
  public documentos: LiquidacionDocumentoCab[] = [];
  public clientes: Cliente[] = [];
  public detalle: LiquidacionDocumentoDet[] = [];
  public detalleOld: LiquidacionDocumentoDet[] = [];
  public oldDetalle: LiquidacionDocumentoDet;
  public tipoDocumento: TablaMaestra[] = [];
  public moneda: TablaMaestra[] = [];
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
  public inafectoIGV: TablaMaestra;
  public detracciones: TablaMaestra;
  public documentoForm: FormGroup;
  public oldDocumentoForm: FormGroup;
  public detalleForm: FormGroup;
  public oldDetalleForm: FormGroup;
  public anulacionForm: FormGroup;
  public oldAnulacionForm: FormGroup;
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

  public liquidacionDocCabActual: LiquidacionDocumentoCab;

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
              private clientesService: ClientesService,) {
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
      // codigo: [{value: '', disabled: true}],
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
    this.utilsService.blockUIStop();
    this.onListarDocumentos();
  }

  onListarDocumentos(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.documentosService.listar({
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: LiquidacionDocumentoCab[]) => {
      this.documentos = response;
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
    if (this.detalle.filter(f => f.edicion && f.idFila != item.idFila).length > 0) {
      this.utilsService.showNotification("Guarda o confirma los cambios primero", "Advertencia", 2);
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
          this.utilsService.showNotification('Información enviada correctamente', 'Confirmación', 1);
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

  onConsultarEstado(cab: LiquidacionDocumentoCab): void {
    this.utilsService.blockUIStart("Actualizando Estado...");
    cab.idEmpresa = this.currentUser.idEmpresa;
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

  onSeleccionarConcepto(tm: TablaMaestra, modal): void {
    if (this.fila === null) {
      this.ReactiveIUForm_Detalle.codigo.setValue(tm.valor);
      this.ReactiveIUForm_Detalle.concepto.setValue(tm.descripcion);
    } else {
      this.fila.codigo = tm.valor;
      this.fila.concepto = tm.descripcion;
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
        this.documentoForm.controls.formaPago.setValue(response.idFormaPago),
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
}
