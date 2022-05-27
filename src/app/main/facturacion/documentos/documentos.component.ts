import { Component, OnInit } from '@angular/core';
import {LiquidacionCab} from "../../../shared/models/operaciones/liquidacion-cab";
import {UtilsService} from "../../../shared/services/utils.service";
import {DocumentosService} from "./documentos.service";
import {LiquidacionDocumentoCab} from "../../../shared/models/facturacion/liquidaciondocumento-cab";
import {LiquidacionDocumentoDet} from "../../../shared/models/facturacion/liquidaciondocumento-det";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {
  public contentHeader: object;
  public documentos: LiquidacionDocumentoCab[] = [];
  public detalle: LiquidacionDocumentoDet[] = [];
  public detalleOld: LiquidacionDocumentoDet[] = [];
  public oldDetalle: LiquidacionDocumentoDet;
  public tipoDocumento: TablaMaestra[] = [];
  public moneda: TablaMaestra[] = [];
  public nroComprobante: TablaMaestra[] = [];
  public documentoForm: FormGroup;
  public oldDocumentoForm: FormGroup;
  public detalleForm: FormGroup;
  public oldDetalleForm: FormGroup;
  public cambiarIcono: boolean = false;
  public ver: boolean = false;
  public submitted: boolean = false;
  public submitted_Detalle: boolean = false;
  public igv: number = 0;

  public search: string = '';
  public page: number = 1;
  public pageSize: number = 10;
  public collectionSize: number;

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
              private tablaMaestraService: TablaMaestraService) {
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
      tipoDocumento: ['', Validators.required],
      prefijo: [''],
      serie: [0],
      serieFormat: [{value: '', disabled: true}],
      correlativo: [0, [Validators.required, Validators.min(1), Validators.max(99999999)]],
      nroDocumento: [''],
      idCliente: [0],
      // codigo: [{value: '', disabled: true}],
      // codigoSolicitud: [{value: '', disabled: true}],
      rucCliente: ['', Validators.required],
      razonSocialCliente: ['', Validators.required],
      direccionCliente: ['', Validators.required],
      fechaEmision: [{ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }, Validators.required],
      moneda: [1, Validators.required],
      formaPago: ['', Validators.required],
      fechaVencimiento: [null],
      monto: [{value: 0, disabled: true}],
      montoIGV: [{value: 0, disabled: true}],
      montoTotal: [{value: 0, disabled: true}]
    });
    this.oldDocumentoForm = this.documentoForm.value;
    this.detalleForm = this.formBuilder.group({
      codigo: ['', Validators.required],
      concepto: ['', Validators.required],
      um: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(1)]],
      precioUnitarioIGV: [{value: 0, disabled: true}],
      montoTotal: [{value: 0, disabled: true}]
    });
    this.oldDetalleForm = this.detalleForm.value;
  }

  async ngOnInit(): Promise<void> {
    this.utilsService.blockUIStart('Obteniendo información de maestros...');
    this.tipoDocumento = await this.onListarMaestros(12, 0);
    this.moneda = await this.onListarMaestros(1, 0);
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
    this.utilsService.blockUIStart('Obteniendo IGV...');
    this.igv = Number((await this.onListarMaestros(1000, 2))[0].valor);
    this.utilsService.blockUIStop();
    await this.onRefrescarCorrelativo();

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

  async onRefrescarCorrelativo(): Promise<void> {
    this.utilsService.blockUIStart('Obteniendo último correlativo...');
    this.nroComprobante = await this.onListarMaestros(14, 0);

    let prefijo = this.nroComprobante.find(f => f.idColumna === 1).valor;
    let nroDigitosSerie = Number(this.nroComprobante.find(f => f.idColumna === 2).valor);
    let serie = Number(this.nroComprobante.find(f => f.idColumna === 3).valor);
    let correlativo = Number(this.nroComprobante.find(f => f.idColumna === 4).valor);

    serie = correlativo === 99999999 ? serie + 1 : serie;

    this.ReactiveIUForm.prefijo.setValue(prefijo);
    this.ReactiveIUForm.serie.setValue(serie);
    this.ReactiveIUForm.correlativo.setValue(String(correlativo === 99999999 ? 1 : correlativo + 1).padStart(8, '0'));
    this.ReactiveIUForm.serieFormat.setValue(prefijo + String(serie).padStart(nroDigitosSerie, '0'));
    this.ReactiveIUForm.nroDocumento.setValue(this.ReactiveIUForm.serieFormat.value + '-' + String(Number(this.ReactiveIUForm.correlativo.value)).padStart(8, '0'));
    this.utilsService.blockUIStop();
  }

  onCambioCorrelativo($event): void {
    this.ReactiveIUForm.nroDocumento.setValue(this.ReactiveIUForm.serieFormat.value + '-' + String(Number($event)).padStart(8, '0'));
  }

  onCambioMonto($event): void {
    this.ReactiveIUForm.montoIGV.setValue(Math.round(((Number($event) * (this.igv / 100)) + Number.EPSILON) * 100) / 100);
    this.ReactiveIUForm.montoTotal.setValue(Math.round((
      (Number($event) * (1 + (this.igv / 100))) + Number.EPSILON
    ) * 100) / 100);
  }

  onCambioMontoTotal(item: LiquidacionDocumentoDet): void {
    if (!item) {
      console.log('onCambioMontoTotal');
      this.ReactiveIUForm_Detalle.precioUnitarioIGV.setValue(
        Math.round(((this.ReactiveIUForm_Detalle.precioUnitario.value * (this.igv / 100)) + Number.EPSILON) * 100) / 100
      );
      this.ReactiveIUForm_Detalle.montoTotal.setValue(
        Math.round(((this.ReactiveIUForm_Detalle.cantidad.value * this.ReactiveIUForm_Detalle.precioUnitario.value) + Number.EPSILON) * 100) / 100
      );
    } else {
      item.precioUnitarioIGV = Math.round(((item.precioUnitario * (this.igv / 100)) + Number.EPSILON) * 100) / 100;
      item.montoTotal = item.cantidad * item.precioUnitario;
    }
  }

  onEditar(modal: any, cab: LiquidacionDocumentoCab): void {
    this.igv = cab.igv;
    this.ReactiveIUForm.idLiquidacionDocumentoCab.setValue(cab.idLiquidacionDocumentoCab);
    this.ReactiveIUForm.idLiquidacionCab.setValue(cab.idLiquidacionCab);
    this.ReactiveIUForm.tipoDocumento.setValue(cab.idTipoDocumento);
    this.ReactiveIUForm.prefijo.setValue(cab.prefijo);
    this.ReactiveIUForm.serie.setValue(cab.serie);
    this.ReactiveIUForm.serieFormat.setValue(cab.nroDocumento.split('-')[0]);
    this.ReactiveIUForm.correlativo.setValue(cab.nroDocumento.split('-')[1]);
    this.ReactiveIUForm.nroDocumento.setValue(cab.nroDocumento);
    this.ReactiveIUForm.idCliente.setValue(cab.idCliente);
    this.ReactiveIUForm.rucCliente.setValue(cab.rucCliente);
    this.ReactiveIUForm.razonSocialCliente.setValue(cab.razonSocialCliente);
    this.ReactiveIUForm.direccionCliente.setValue(cab.direccionCliente);
    this.ReactiveIUForm.fechaEmision.setValue(cab.fechaEmision);
    this.ReactiveIUForm.moneda.setValue(cab.idMoneda);
    this.ReactiveIUForm.formaPago.setValue(cab.formaPago);
    this.ReactiveIUForm.fechaVencimiento.setValue(cab.fechaVencimiento);
    this.ReactiveIUForm.monto.setValue(cab.monto);
    this.ReactiveIUForm.montoIGV.setValue(cab.montoIGV);
    this.ReactiveIUForm.montoTotal.setValue(cab.montoTotal);
    this.detalle = cab.liquidacionDocumentoDet;

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
    this.documentoForm.reset(this.oldDocumentoForm);
    this.modalService.dismissAll();
    this.onListarDocumentos();
  }

  onGuardar(): void {
    this.submitted = true;
    if (this.documentoForm.invalid)
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
      idEmpresa: 1,
      idLiquidacionDocumentoCab: this.documentoForm.controls.idLiquidacionDocumentoCab.value,
      idLiquidacionCab: this.documentoForm.controls.idLiquidacionCab.value,
      idTipoDocumento: this.documentoForm.controls.tipoDocumento.value,
      prefijo: this.documentoForm.controls.prefijo.value,
      serie: this.documentoForm.controls.serie.value,
      correlativo: Number(this.documentoForm.controls.correlativo.value),
      nroDocumento: this.documentoForm.controls.nroDocumento.value,
      idCliente: this.documentoForm.controls.idCliente.value,
      rucCliente: this.documentoForm.controls.rucCliente.value,
      razonSocialCliente: this.documentoForm.controls.razonSocialCliente.value,
      direccionCliente: this.documentoForm.controls.direccionCliente.value,
      fechaEmisionFormat: this.utilsService.formatoFecha_YYYYMMDD(this.documentoForm.controls.fechaEmision.value),
      idMoneda: this.documentoForm.controls.moneda.value,
      formaPago: this.documentoForm.controls.formaPago.value,
      fechaVencimientoFormat: this.utilsService.formatoFecha_YYYYMMDD(this.documentoForm.controls.fechaVencimiento.value),
      monto: this.documentoForm.controls.monto.value,
      idUsuarioAud: 1,
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
      codigo: this.ReactiveIUForm_Detalle.codigo.value,
      concepto: this.ReactiveIUForm_Detalle.concepto.value,
      um: this.ReactiveIUForm_Detalle.um.value,
      cantidad: this.ReactiveIUForm_Detalle.cantidad.value,
      precioUnitario: this.ReactiveIUForm_Detalle.precioUnitario.value,
      precioUnitarioIGV: this.ReactiveIUForm_Detalle.precioUnitarioIGV.value,
      montoTotal: this.ReactiveIUForm_Detalle.montoTotal.value,
      estado: true,
      idFila: this.utilsService.autoIncrement(this.detalle),
      edicion: false,
      editado: true
    });
    this.ReactiveIUForm.monto.setValue(this.detalle.reduce((sum, current) => sum + current.montoTotal, 0));
    this.detalleForm.reset(this.oldDetalleForm);
    this.submitted_Detalle = false;
  }

  onEditarDetalle(item: LiquidacionDocumentoDet): void {
    if (this.detalle.filter(f => f.edicion && f.idFila != item.idFila).length > 0) {
      this.utilsService.showNotification("Guarda o confirma los cambios primero", "Advertencia", 2);
      return;
    }

    this.oldDetalle = { ...item };
    item.edicion = true;
  }

  onCancelarDetalle(item: LiquidacionDocumentoDet): void {
    item.idLiquidacionDocumentoDet = this.oldDetalle.idLiquidacionDocumentoDet;
    item.idLiquidacionDocumentoCab = this.oldDetalle.idLiquidacionDocumentoCab;
    item.codigo = this.oldDetalle.codigo;
    item.concepto = this.oldDetalle.concepto;
    item.um = this.oldDetalle.um;
    item.cantidad = this.oldDetalle.cantidad;
    item.precioUnitario = this.oldDetalle.precioUnitario;
    item.precioUnitarioIGV = this.oldDetalle.precioUnitarioIGV;
    item.montoTotal = this.oldDetalle.montoTotal;
    item.estado = this.oldDetalle.estado;
    item.idFila = this.oldDetalle.idFila;
    item.edicion = this.oldDetalle.edicion;
    item.editado = this.oldDetalle.editado;
  }

  onConfirmarCambioDetalle(item: LiquidacionDocumentoDet): void {
    item.edicion = false;
    item.editado = true;
    this.ReactiveIUForm.monto.setValue(this.detalle.reduce((sum, current) => sum + current.montoTotal, 0));
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

  onFirmarPublicar(cab: LiquidacionDocumentoCab): void {
    this.utilsService.blockUIStart("Enviando información al servicio de Bizlinks...");
    cab.idEmpresa = 1;
    this.documentosService.firmaPublicacion(cab).subscribe((response: any) => {
      switch (response.tipo) {
        case 1:
          this.utilsService.showNotification('Información evniada correctamente', 'Confirmación', 1);
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
}
