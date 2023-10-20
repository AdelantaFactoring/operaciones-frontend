import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnInit, Output,
  ViewChild,
} from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {SolicitudesService} from "../../comercial/solicitudes/solicitudes.service";
import {LiquidacionesService} from "./liquidaciones.service";
import {LiquidacionCab} from "../../../shared/models/operaciones/liquidacion-cab";
import {FormBuilder, FormGroup} from "@angular/forms";
import {SolicitudDet} from "../../../shared/models/comercial/solicitudDet";
import {SolicitudCabSustento} from "../../../shared/models/comercial/solicitudCab-sustento";
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";
import {LiquidacionDet} from "../../../shared/models/operaciones/liquidacion-det";
import Swal from "sweetalert2";
import {FileUploader} from "ng2-file-upload";
import {Archivo} from "../../../shared/models/comercial/archivo";
import {LiquidacionCabSustento} from "../../../shared/models/operaciones/LiquidacionCab-Sustento";
import {ActivatedRoute} from "@angular/router";
import {User} from 'app/shared/models/auth/user';
import {Audit} from "../../../shared/models/shared/audit";
import * as fileSaver from 'file-saver';
import {ContentHeader} from "../../../layout/components/content-header/content-header.component";
import {NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {SolicitudCabAdelanto} from "../../../shared/models/comercial/solicitud-cab-adelanto";
import {CheckListService} from "../../comercial/check-list/check-list.service";

@Component({
  selector: 'app-liquidaciones',
  templateUrl: './liquidaciones.component.html',
  styleUrls: ['./liquidaciones.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class LiquidacionesComponent implements OnInit, AfterViewInit {
  @Input() isModal: boolean = false;
  @ViewChild('coreCard') coreCard;
  @ViewChild('desdeFC') desdeFC: ElementRef;
  @Output() selectEvent: EventEmitter<LiquidacionCab> = new EventEmitter<LiquidacionCab>();

  public currentUser: User;
  public mostrar: string = 'false';

  public contentHeader: ContentHeader;
  public audit: Audit = new Audit();
  public submitted: boolean = false;
  public seleccionarTodoSolicitud: boolean = false;
  public cambiarIconoSolicitud: boolean = false;
  public solicitudes: SolicitudCab[] = [];
  public liquidaciones: LiquidacionCab[] = [];
  public seleccionarTodo: boolean = false;
  public cambiarIcono: boolean = false;
  public liquidacionForm: FormGroup;
  public filtroForm: FormGroup;
  public oldFiltroForm: FormGroup;
  public oldLiquidacionForm: FormGroup;
  public codigoSolicitud: string = '';
  public idTipoOperacion: number = 0;
  public detalleSolicitud: SolicitudDet[] = [];
  public sustentosSolicitud: SolicitudCabSustento[] = [];
  public tipoCT: TablaMaestra[] = [];
  public oldLiquidacionDet: LiquidacionDet;
  public archivos: Archivo[] = [];
  public hasBaseDropZoneOver: boolean = false;
  public archivosSustento: FileUploader = new FileUploader({
    isHTML5: true
  });
  public tiposArchivos: TablaMaestra[] = [];
  public sustentos: LiquidacionCabSustento[] = [];
  public sustentosOld: LiquidacionCabSustento[] = [];

  public currency: TablaMaestra[] = [];
  public operationType: TablaMaestra[] = [];
  public state: TablaMaestra[] = [];

  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  public codigo: string;
  public nroDocumento: string;
  public deudaAnterior: number = 0;
  public observacion: string = '';
  public ver: boolean = false;
  public montoTotalFacturadoMinimoTM: TablaMaestra[] = [];

  public dataCabecera: LiquidacionCab;
  public dataDetalle: LiquidacionDet;

  public mostrarFiltroExportacion: boolean = false;

  get ReactiveIUForm(): any {
    return this.liquidacionForm.controls;
  }

  public fechaMinima: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };
  public activeId: any = 2;
  public adelantos: SolicitudCabAdelanto[] = [];

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private solicitudesService: SolicitudesService,
    private liquidacionesService: LiquidacionesService,
    private tablaMaestraService: TablaMaestraService,
    private checkListService: CheckListService,
    private formBuilder: FormBuilder,
    private calendar: NgbCalendar) {
    this.contentHeader = {
      headerTitle: 'Aprobación',
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
            name: 'Liquidación',
            isLink: false
          },
          {
            name: 'Aprobación',
            isLink: false
          }
        ]
      }
    };

    this.liquidacionForm = this.formBuilder.group({
      idLiquidacionCab: [0],
      codigo: [{value: '', disabled: true}],
      rucCliente: [{value: '', disabled: true}],
      razonSocialCliente: [{value: '', disabled: true}],
      rucPagProv: [{value: '', disabled: true}],
      razonSocialPagProv: [{value: '', disabled: true}],
      moneda: [{value: '', disabled: true}],
      montoTotal: [{value: 0, disabled: true}],
      //deudaAnterior: [0],
      nuevoMontoTotal: [{value: 0, disabled: true}],
      //observacion: [''],
      flagPagoInteresAdelantado: false,
      observacionSolicitud: [{value: ''}],
    });
    this.oldLiquidacionForm = this.liquidacionForm.value;
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
      fechaConfirmadaDesde: [null],
      fechaConfirmadaHasta: [null],
      desdeFC: this.calendar.getToday(),
      hastaFC: this.calendar.getToday()
    });
    this.oldFiltroForm = this.filtroForm.value;
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.utilsService.blockUIStart('Obteniendo información de maestros...');
    this.tipoCT = await this.onListarMaestros(5, 0);
    this.tiposArchivos = await this.onListarMaestros(8, 0);
    this.montoTotalFacturadoMinimoTM = await this.onListarMaestros(1000, 3);
    this.currency = await this.onListarMaestros(1, 0);
    this.operationType = await this.onListarMaestros(4, 0);
    this.state = await this.onListarMaestros(7, 0);
    this.currency = this.utilsService.agregarTodos(1, this.currency);
    this.operationType = this.utilsService.agregarTodos(4, this.operationType);
    this.state = this.utilsService.agregarTodos(7, this.state);
    this.utilsService.blockUIStop();
    this.route.params.subscribe(s => {
      this.mostrar = s.mostrar;
      this.contentHeader.headerTitle = this.contentHeader.breadcrumb.links[2].name = this.mostrar === 'false' ? 'Historial' : "Aprobación";
      this.onListarLiquidaciones();
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

  onListarLiquidaciones(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.liquidacionesService.listar({
      idConsulta: this.mostrar === 'true' ? 1 : 0,
      codigoLiquidacion: this.filtroForm.controls.codigoLiquidacion.value,
      codigoSolicitud: this.filtroForm.controls.codigoSolicitud.value,
      cliente: this.filtroForm.controls.cliente.value,
      pagProv: this.filtroForm.controls.pagadorProveedor.value,
      moneda: this.filtroForm.controls.moneda.value,
      idTipoOperacion: this.filtroForm.controls.tipoOperacion.value,
      idEstado: this.filtroForm.controls.estado.value,
      pagProvDet: this.filtroForm.controls.pagadorProveedorDet.value,
      nroDocumento: this.filtroForm.controls.nroDocumento.value,
      fechaConfirmadaDesde: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.controls.fechaConfirmadaDesde.value) ?? "",
      fechaConfirmadaHasta: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.controls.fechaConfirmadaHasta.value) ?? "",
      netoConfirmado: 0,
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: LiquidacionCab[]) => {
      for (const row of response) {
        row.sumTotalInteres = row.liquidacionDet.reduce((sum, current) => sum + current.interesConIGV, 0);
        row.sumTotalGastos = row.liquidacionDet.reduce((sum, current) => sum + current.gastosDiversosConIGV, 0);
        row.sumTotalFacturado = row.liquidacionDet.reduce((sum, current) => sum + current.montoTotalFacturado, 0);
      }
      this.mostrarFiltroExportacion = false;
      this.liquidaciones = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;

      let fechaOperacionOrgSplit;
      for (const row of this.liquidaciones) {
        fechaOperacionOrgSplit = row.fechaOperacion_Global_ORG.split('/');
        row.fechaOperacion_Global_MOD = {
          year: parseInt(fechaOperacionOrgSplit[2]),
          month: parseInt(fechaOperacionOrgSplit[1]),
          day: parseInt(fechaOperacionOrgSplit[0])
        }
      }

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onCambiarVisibilidadDetalleTodo(): void {
    this.cambiarIcono = !this.cambiarIcono;
    this.liquidaciones.forEach(el => {
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

  onCambiarVisibilidadDetalleTodoSolicitud(): void {
    this.cambiarIconoSolicitud = !this.cambiarIconoSolicitud;
    this.solicitudes.forEach(el => {
      el.cambiarIcono = this.cambiarIconoSolicitud;
      document.getElementById('trS' + el.idSolicitudCab).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
      document.getElementById('detailS' + el.idSolicitudCab).style.display = (el.cambiarIcono) ? "block" : "none";
    });
  }

  onCambiarVisibilidadDetalleSolicitud(item: SolicitudCab): void {
    item.cambiarIcono = !item.cambiarIcono;
    document.getElementById('trS' + item.idSolicitudCab).style.visibility = (item.cambiarIcono) ? "visible" : "collapse";
    document.getElementById('detailS' + item.idSolicitudCab).style.display = (item.cambiarIcono) ? "block" : "none";
  }

  onSeleccionarTodo(): void {
    this.liquidaciones.filter(f => f.idEstado === 1).forEach(el => {
      el.seleccionado = this.seleccionarTodo;
    });
  }

  onSeleccionarTodoSolicitud(): void {
    this.solicitudes.forEach(el => {
      if (el.checkList)
        el.seleccionado = this.seleccionarTodoSolicitud;
    });
  }

  onAprobar(idEstado: number): void {
    // @ts-ignore
    let liquidaciones = [...this.liquidaciones.filter(f => f.seleccionado)];

    if (liquidaciones.length === 0) {
      this.utilsService.showNotification("Seleccione una o varias liquidaciones", "", 2);
      return;
    }

    for (const el of liquidaciones) {
      if (!el.correoValidacionEnviado) {
        this.utilsService.showNotification(`Aún no se ha enviado el correo de validación para la liquidación '${el.codigo}'`, "Advertencia", 2);
        return;
      }

      if (el.liquidacionCabSustento.filter(f => f.idTipoSustento === 1 && f.idTipo === 1).length === 0) {
        this.utilsService.showNotification(`La liquidación '${el.codigo}' seleccionada no contiene un archivo de sustento de aprobación`, "Advertencia", 2);
        return;
      }

      if (el.flagPagoInteresAdelantado && el.liquidacionCabSustento.filter(f => f.idTipoSustento === 1 && (f.idTipo === 3 || f.idTipo === 4)).length === 0) {
        this.utilsService.showNotification(`(Pago de intereses y gastos adelantados) Debe subir la confirmación del cliente y del pago`, "Advertencia", 2);
        return;
      }
    }

    liquidaciones.forEach(el => {
      el.idEstado = idEstado;
      el.idUsuarioAud = this.currentUser.idUsuario;
    });

    this.utilsService.blockUIStart('Aprobando...');
    this.liquidacionesService.cambiarEstado(liquidaciones).subscribe(response => {
      if (response.comun.tipo == 1) {
        this.utilsService.showNotification('Aprobación Satisfactoria', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarLiquidaciones();
      } else if (response.comun.tipo == 2) {
        this.utilsService.showNotification(response.comun.mensaje, 'Validación', 2);
        this.utilsService.blockUIStop();
        this.onListarLiquidaciones();
      } else if (response.comun.tipo == 0) {
        this.utilsService.showNotification(response.comun.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
      }
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onFilas(liquidaciones: any, ocultar: boolean = false, ocultar2: boolean = false): string {
    let filas = "";
    for (const item of liquidaciones) {
      filas += `<tr><td>${item.codigo}</td>
                  ${!ocultar2 ? `
                  <td>${item.montoSuperado ? '<i class="text-success cursor-pointer fa fa-check"></i>' :
          '<i class="text-danger fa fa-ban"></i>'}</td>`
        : ''}
                  ${!ocultar ? `
                  <td>${item.correoEnviado === 1 ? '<i class="text-success fa fa-check"></i>' :
        (item.correoEnviado === 0 ? '<i class="text-danger cursor-pointer fa fa-ban"></i>' :
          '<i class="text-secondary cursor-pointer fa fa-minus-circle"></i>')}</td>` : ''}
                </tr>`
    }
    return filas;
  }

  onFilas2(liquidaciones: LiquidacionCab[]): string {
    let filas = "";
    for (const cab of liquidaciones) {
      filas += `<tr>
                    <td>${cab.codigo}</td>
                </tr>
                `
    }
    return filas;
  }

  onCambiarFechaOperacion($event: any, cab: LiquidacionCab, item: LiquidacionDet) {
    item.fechaOperacionFormat = `${String($event.day).padStart(2, '0')}/${String($event.month).padStart(2, '0')}/${$event.year}`;
    item.editado = true;
    this.onCalcular(cab, item);
  }

  onEditar(cab: LiquidacionCab, item: LiquidacionDet, modal: object): void {
    this.oldLiquidacionDet = {...item};
    item.edicion = true;

    this.codigo = cab.codigo;
    this.nroDocumento = item.nroDocumento;
    this.dataCabecera = cab;
    this.dataDetalle = item;

    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        //size: 'lg',
        windowClass: 'my-class2',
        animation: true,
        centered: false,
        backdrop: "static",
        keyboard: false,
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onCancelar(item: LiquidacionDet, modal: any): void {
    item.fechaOperacion = this.oldLiquidacionDet.fechaOperacion;
    item.fechaOperacionFormat = this.oldLiquidacionDet.fechaOperacionFormat;
    item.diasEfectivo = this.oldLiquidacionDet.diasEfectivo;
    item.interes = this.oldLiquidacionDet.interes;
    item.interesIGV = this.oldLiquidacionDet.interesIGV;
    item.interesConIGV = this.oldLiquidacionDet.interesConIGV;
    item.gastosContrato = this.oldLiquidacionDet.gastosContrato;
    item.gastoVigenciaPoder = this.oldLiquidacionDet.gastoVigenciaPoder;
    item.servicioCustodia = this.oldLiquidacionDet.servicioCustodia;
    item.servicioCobranza = this.oldLiquidacionDet.servicioCobranza;
    item.comisionCartaNotarial = this.oldLiquidacionDet.comisionCartaNotarial;
    item.gastosDiversos = this.oldLiquidacionDet.gastosDiversos;
    item.gastosDiversosIGV = this.oldLiquidacionDet.gastosDiversosIGV;
    item.gastosDiversosConIGV = this.oldLiquidacionDet.gastosDiversosConIGV;
    item.montoTotalFacturado = this.oldLiquidacionDet.montoTotalFacturado;
    item.montoDesembolso = this.oldLiquidacionDet.montoDesembolso;
    item.edicion = this.oldLiquidacionDet.edicion;
    item.editado = this.oldLiquidacionDet.editado;
    item.cambioConfirmado = this.oldLiquidacionDet.cambioConfirmado;

    modal.dismiss("");
  }

  onConfirmarCambio(item: LiquidacionDet, modal: any): void {
    item.edicion = false;
    item.editado = true;
    item.cambioConfirmado = true;

    modal.dismiss("");
  }

  onCalcular(cab: LiquidacionCab, det: LiquidacionDet): void {
    let diasEfectivo = det.diasEfectivo;
    if (cab.idTipoOperacion != 2) {
      const fecConfirmado = new Date(parseInt(det.fechaConfirmado.split('/')[2]),
        parseInt(det.fechaConfirmado.split('/')[1]) - 1,
        parseInt(det.fechaConfirmado.split('/')[0]), 0, 0, 0);
      const fecOperacion = new Date(parseInt(det.fechaOperacionFormat.split('/')[2]),
        parseInt(det.fechaOperacionFormat.split('/')[1]) - 1,
        parseInt(det.fechaOperacionFormat.split('/')[0]), 0, 0, 0);

      const diffTime = Math.abs(fecOperacion.getTime() - fecConfirmado.getTime());
      diasEfectivo = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    det.diasEfectivo = diasEfectivo;

    if (cab.idTipoOperacion != 2) {
      det.interes = det.montoCobrar * ((det.tasaNominalAnual / 100) / 360) * det.diasEfectivo;
      det.interesIGV = det.interes * (det.igv / 100);
      det.interesConIGV = det.interes + det.interesIGV;
    }
    det.gastosDiversos = det.gastosContrato + det.gastoVigenciaPoder + det.servicioCustodia
      + det.servicioCobranza + det.comisionCartaNotarial;
    det.gastosDiversosIGV = det.gastosDiversos * (det.igv / 100);
    det.gastosDiversosConIGV = det.gastosDiversos + det.gastosDiversosIGV;
    det.montoTotalFacturado = det.gastosDiversosConIGV + det.interesConIGV;
    if (cab.idTipoCT != 1)
      det.montoDesembolso = (det.montoCobrar - det.montoTotalFacturado - det.comisionEstructuracionConIGV) + det.montoNotaCreditoDevolucion;

    det.editado = true;
  }

  onGuardarCambios(item: LiquidacionCab): void {
    let itemActual = {...item};
    if (itemActual.liquidacionDet.filter(f => f.cambioConfirmado).length == 0) return;

    itemActual.idDestino = 2;
    itemActual.idUsuarioAud = this.currentUser.idUsuario;
    itemActual.liquidacionDet = itemActual.liquidacionDet.filter(f => f.cambioConfirmado);

    this.utilsService.blockUIStart('Guardando...');
    this.liquidacionesService.actualizar(itemActual).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarLiquidaciones();
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

  onDeshacerCambios(): void {
    this.onListarLiquidaciones();
  }

  onEditarCab(cab: LiquidacionCab, modal): void {
    if (cab.liquidacionDet.filter(f => f.edicion || f.editado).length > 0) {
      this.utilsService.showNotification("Guarda o cancela los cambios primero", "Advertencia", 2);
      return;
    }

    this.ver = cab.idEstado != 1 ? true : false;

    this.liquidacionForm.controls.idLiquidacionCab.setValue(cab.idLiquidacionCab);
    this.codigo = cab.codigo;
    this.idTipoOperacion = cab.idTipoOperacion;
    this.liquidacionForm.controls.rucCliente.setValue(cab.rucCliente);
    this.liquidacionForm.controls.razonSocialCliente.setValue(cab.razonSocialCliente);
    this.liquidacionForm.controls.rucPagProv.setValue(cab.rucPagProv);
    this.liquidacionForm.controls.razonSocialPagProv.setValue(cab.razonSocialPagProv);
    this.liquidacionForm.controls.moneda.setValue(cab.moneda);
    this.liquidacionForm.controls.montoTotal.setValue(cab.montoTotal);
    //this.liquidacionForm.controls.deudaAnterior.setValue(cab.deudaAnterior);
    this.deudaAnterior = cab.deudaAnterior;
    this.liquidacionForm.controls.nuevoMontoTotal.setValue(cab.nuevoMontoTotal);
    //this.liquidacionForm.controls.observacion.setValue(cab.observacion);
    this.observacion = cab.observacion ?? '';
    this.liquidacionForm.controls.observacionSolicitud.setValue(cab.observacionSolicitud);
    this.sustentos = cab.liquidacionCabSustento.filter(x => x.idTipoSustento === 1);

    this.liquidacionForm.controls.flagPagoInteresAdelantado.setValue(cab.flagPagoInteresAdelantado);

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

  onDeudaAnteriorCambio($event): void {
    if ($event === '') this.deudaAnterior = 0;
    this.liquidacionForm.controls.nuevoMontoTotal.setValue(
      Math.round((this.liquidacionForm.controls.montoTotal.value - this.deudaAnterior) * 100) / 100
    );
  }

  async onArchivoABase64(file): Promise<any> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async fileOverBase(e: any): Promise<void> {
    this.hasBaseDropZoneOver = e;
    if (e === false) {
      let cola = this.archivosSustento.queue;

      // for (const item of this.archivosSustento.queue) {
      //   if (!item?.file?.name.includes(".eml")) {
      //     item.remove();
      //     this.utilsService.showNotification("Solo se permite archivos de correo con extensión '.eml'", "Advertencia", 2);
      //   }
      // }

      let nombres = cola.map(item => item?.file?.name)
        .filter((value, index, self) => self.indexOf(value) === index)
      let sinDuplicado = [];
      for (let el of cola) {
        let duplicado = cola.filter(f => f?.file?.name === el.file.name);
        if (duplicado.length > 1) {
          if (sinDuplicado.filter(f => f?.file?.name === el.file.name).length === 0) {
            let ultimo = duplicado.sort((a, b) => b._file.lastModified - a._file.lastModified)[0]
            sinDuplicado.push(ultimo);
          }
        } else {
          sinDuplicado.push(duplicado[0]);
        }
      }

      this.archivosSustento.queue = sinDuplicado;
      this.archivos = [];
      for (let item of sinDuplicado) {
        let base64 = await this.onArchivoABase64(item._file);
        this.archivos.push({
          idFila: this.utilsService.autoIncrement(this.archivos),
          idTipo: 1,
          idTipoSustento: 1,
          nombre: item.file.name,
          tamanio: `${(item.file.size / 1024 / 1024).toLocaleString('es-pe', {minimumFractionDigits: 2})} MB`,
          base64: base64
        });
      }
    }
  }

  onEliminarArchivo(item): void {
    //item.remove();
    let archivo = item.nombre;
    let id = 0;
    for (const arch of this.archivosSustento.queue) {
      if (arch?.file?.name == archivo) {
        arch.remove();
        break;
      }
    }

    for (const row of this.archivos) {
      if (row.nombre === archivo) {
        this.archivos.splice(id, 1)
      }
      id = id + 1;
    }
  }

  onEliminarArchivoAdjunto(item: LiquidacionCabSustento): void {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Desea eliminar el archivo "${item.archivo}"?`,
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
        item.editado = true;
        item.estado = false;
      }
    });
  }

  onGuardar(): void {
    this.submitted = true;
    if (this.deudaAnterior > 0 && this.observacion === '')
      return;

    this.utilsService.blockUIStart("Guardando...");
    if (this.sustentosOld.length === 0) {
      this.sustentosOld = [...this.sustentos];
    } else {
      this.sustentos = [...this.sustentosOld];
    }

    for (let item of this.archivos) {
      this.sustentos.push({
        idLiquidacionCabSustento: 0,
        idLiquidacionCab: 0,
        idTipoSustento: 1,
        idTipo: item.idTipo,
        tipo: "",
        archivo: item.nombre,
        base64: item.base64,
        rutaArchivo: "",
        estado: true,
        editado: true
      });
    }

    this.liquidacionesService.actualizar({
      idDestino: 1, //1: cab | 2: det
      idLiquidacionCab: this.liquidacionForm.controls.idLiquidacionCab.value,
      codigo: this.codigo,
      deudaAnterior: this.deudaAnterior,
      nuevoMontoTotal: this.liquidacionForm.controls.nuevoMontoTotal.value,
      observacion: this.observacion,
      idUsuarioAud: this.currentUser.idUsuario,
      liquidacionCabSustento: this.sustentos.filter(f => f.editado)
    }).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarLiquidaciones();
        this.onCancelarCab();
      } else if (response.tipo == 2) {
        this.utilsService.showNotification(response.mensaje, 'Validación', 2);
        this.utilsService.blockUIStop();
        this.sustentos = [...this.sustentosOld];
      } else if (response.tipo == 0) {
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
        this.sustentos = [...this.sustentosOld];
      }
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onCancelarCab(): void {
    this.submitted = false;
    this.sustentosOld = [];
    this.liquidacionForm.reset(this.oldLiquidacionForm);
    this.onListarLiquidaciones();
    this.archivos = [];
    this.codigo = "";
    this.archivosSustento.clearQueue();
    this.modalService.dismissAll();
  }

  onEnviar(idTipo: number, cab: LiquidacionCab): void {
    let liquidaciones = idTipo == 1 ? [...this.liquidaciones.filter(f => f.seleccionado)] : [{...cab}];

    if (idTipo == 1) {
      if (liquidaciones.length === 0) {
        this.utilsService.showNotification("Seleccione una o varias liquidaciones", "", 2);
        return;
      }
    }

    if (liquidaciones.filter(f => f.liquidacionDet.filter(f => f.edicion || f.editado).length > 0).length > 0) {
      this.utilsService.showNotification("Guarda o cancela los cambios primero", "Advertencia", 2);
      return;
    }

    if (liquidaciones.filter(f =>
      f.liquidacionDet.filter(f1 =>
        f1.montoTotalFacturado < Number(this.montoTotalFacturadoMinimoTM[0].valor)).length > 0).length > 0) {
      Swal.fire({
        title: 'Advertencia',
        html: `
            <p style="text-align: justify">La(s) siguiente(s) liquidacion(es) no supera(n) el monto total facturado mínimo de ${this.montoTotalFacturadoMinimoTM[0].valor}. ¿Desea continuar?</p>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                <tr>
                  <th>N° Liquidación</th>
                </tr>
                </thead>
                <tbody>
                ${this.onFilas2(liquidaciones)}
                </tbody>
              </table>
            </div>`,
        icon: 'warning',
        width: '500px',
        showCancelButton: true,
        confirmButtonText: '<i class="fa fa-check"></i> Sí',
        cancelButtonText: '<i class="fa fa-times"></i> No',
        customClass: {
          confirmButton: 'btn btn-warning',
          cancelButton: 'btn btn-secondary'
        },
      }).then(result => {
        if (result.value) {
          this._OnEnviar(liquidaciones);
        }
      });
    } else
      this._OnEnviar(liquidaciones);
  }

  private _OnEnviar(liquidaciones: any): void {
    liquidaciones.forEach(el => {
      el.idEmpresa = this.currentUser.idEmpresa;
      el.idUsuarioAud = this.currentUser.idUsuario;
      el.tipoNotificacion = 1;
    });

    this.utilsService.blockUIStart('Enviando...');
    this.liquidacionesService.pdf(liquidaciones).subscribe(response => {

      if (response.comun.tipo == 1) {
        this.utilsService.showNotification('Información registrada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();

        Swal.fire({
          title: 'Información',
          html: `
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                <tr>
                  <th>N° Liquidación</th>
<!--                  <th>Superó Monto Mínimo (${this.montoTotalFacturadoMinimoTM[0].valor})</th>-->
                  <th>Correo Enviado</th>
                </tr>
                </thead>
                <tbody>
                ${this.onFilas(response.liquidacionCabValidacion, false, true)}
                </tbody>
              </table>
            </div>
            <p style="text-align: right"><i class="text-success cursor-pointer fa fa-check"></i> : Enviado &nbsp;&nbsp;
            <i class="text-danger cursor-pointer fa fa-ban"></i> : No Enviado</p>`,
          icon: 'info',
          width: '750px',
          showCancelButton: false,
          confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
          customClass: {
            confirmButton: 'btn btn-info',
          },
        }).then(result => {
          if (result.value) {
          }
        });
        this.onListarLiquidaciones();
      } else if (response.comun.tipo == 0) {
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
      }

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onEliminar(cab: LiquidacionCab): void {
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
        this.utilsService.blockUIStart('Eliminando...');
        this.liquidacionesService.eliminar({
          idLiquidacionCab: cab.idLiquidacionCab,
          idUsuarioAud: this.currentUser.idUsuario
        }).subscribe(response => {
          if (response.tipo === 1) {
            this.utilsService.showNotification('Registro eliminado correctamente', 'Confirmación', 1);
            this.utilsService.blockUIStop();
            this.onListarLiquidaciones();
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

  onCambioFechaConfirmada(desde: boolean): void {
    if (desde) {
      this.filtroForm.controls.fechaConfirmadaDesde.setValue(null);
    } else {
      this.filtroForm.controls.fechaConfirmadaHasta.setValue(null);
    }
  }

  onLimpiarFiltro($event): void {
    if ($event === 'reload') {
      this.filtroForm.reset(this.oldFiltroForm);
    }
  }

  onAuditoria(cab: LiquidacionCab, modal: any) {
    this.codigo = cab.codigo;
    this.audit = {
      usuarioCreacion: cab.usuarioCreacion,
      fechaCreacion: cab.fechaCreacion,
      usuarioModificacion: cab.usuarioModificacion,
      fechaModificacion: cab.fechaModificacion
    };
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        size: 'sm',
        animation: true,
        centered: false,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onSaveFechaOperacionGlobal(cab: LiquidacionCab) {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Confirma el cambio de fecha de operación para todos los documentos?`,
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
        this.utilsService.blockUIStart('Guardando fecha de operación...');
        this.liquidacionesService.cambiarFechaOperacionGlobal({
          idLiquidacionCab: cab.idLiquidacionCab,
          fechaOperacion_Global_MOD: `${cab.fechaOperacion_Global_MOD.year.toString()}${cab.fechaOperacion_Global_MOD.month.toString().padStart(2, '0')}${cab.fechaOperacion_Global_MOD.day.toString().padStart(2, '0')}`,
          idUsuarioAud: this.currentUser.idUsuario
        }).subscribe(response => {
          if (response.tipo == 1) {
            this.utilsService.showNotification('Información registrada correctamente', 'Confirmación', 1);
            this.utilsService.blockUIStop();

            this.onListarLiquidaciones();
          } else if (response.tipo == 2) {
            this.utilsService.showNotification(response.mensaje, 'Validación', 2);
            this.utilsService.blockUIStop();
          } else if (response.tipo == 0) {
            this.utilsService.showNotification(response.mensaje, 'Error', 3);
            this.utilsService.blockUIStop();
          }
        }, error => {
          this.utilsService.blockUIStop();
          this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
        });
      }
    });
  }

  checkFechaOperacionGlobal(cab: LiquidacionCab): boolean {
    if (cab.idEstado != 1) {
      return true;
    }

    let fechaOperacionGlobalModFormatted = `${cab.fechaOperacion_Global_MOD.day.toString().padStart(2, '0')}/${cab.fechaOperacion_Global_MOD.month.toString().padStart(2, '0')}/${cab.fechaOperacion_Global_MOD.year.toString()}`;

    return fechaOperacionGlobalModFormatted == cab.fechaOperacion_Global_ORG;
  }

  onExportar(tipo: number): void {
    const desde = this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.controls.desdeFC.value);
    const hasta = this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.controls.hastaFC.value);

    switch (tipo) {
      case 1:
        this.mostrarFiltroExportacion = false;
        this.utilsService.blockUIStart('Exportando archivo...');
        this.liquidacionesService.exportar({
          idConsulta: this.mostrar === 'true' ? 1 : 0,
          codigoLiquidacion: this.filtroForm.controls.codigoLiquidacion.value,
          codigoSolicitud: this.filtroForm.controls.codigoSolicitud.value,
          cliente: this.filtroForm.controls.cliente.value,
          pagProv: this.filtroForm.controls.pagadorProveedor.value,
          moneda: this.filtroForm.controls.moneda.value,
          idTipoOperacion: this.filtroForm.controls.tipoOperacion.value,
          idEstado: this.filtroForm.controls.estado.value,
          pagProvDet: this.filtroForm.controls.pagadorProveedorDet.value,
          nroDocumento: this.filtroForm.controls.nroDocumento.value,
          fechaConfirmadaDesde: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.controls.fechaConfirmadaDesde.value) ?? "",
          fechaConfirmadaHasta: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.controls.fechaConfirmadaHasta.value) ?? "",
          desde,
          hasta,
          search: this.search
        }).subscribe(s => {
          let blob: any = new Blob([s], {type: 'application/vnd.ms-excel'});
          const url = window.URL.createObjectURL(blob);
          fileSaver.saveAs(blob, `Liquidaciones_${desde}_${hasta}.xlsx`);
          this.utilsService.showNotification('Exportación satisfactoria', 'Confirmación', 1);
          this.utilsService.blockUIStop();
        }, error => {
          this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
          this.utilsService.blockUIStop();
        });
        break;
      case 2:
        this.mostrarFiltroExportacion = false;
        this.utilsService.blockUIStart('Exportando archivo...');
        this.liquidacionesService.exportarFC({
          idConsulta: this.mostrar === 'true' ? 1 : 0,
          codigoLiquidacion: this.filtroForm.controls.codigoLiquidacion.value,
          codigoSolicitud: this.filtroForm.controls.codigoSolicitud.value,
          cliente: this.filtroForm.controls.cliente.value,
          pagProv: this.filtroForm.controls.pagadorProveedor.value,
          moneda: this.filtroForm.controls.moneda.value,
          idTipoOperacion: this.filtroForm.controls.tipoOperacion.value,
          idEstado: this.filtroForm.controls.estado.value,
          pagProvDet: this.filtroForm.controls.pagadorProveedorDet.value,
          nroDocumento: this.filtroForm.controls.nroDocumento.value,
          fechaConfirmadaDesde: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.controls.fechaConfirmadaDesde.value) ?? "",
          fechaConfirmadaHasta: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.controls.fechaConfirmadaHasta.value) ?? "",
          desde,
          hasta,
          search: this.search
        }).subscribe(s => {
          let blob: any = new Blob([s], {type: 'application/vnd.ms-excel'});
          const url = window.URL.createObjectURL(blob);
          fileSaver.saveAs(blob, `Liquidaciones_FC_${desde}_${hasta}.xlsx`);
          this.utilsService.showNotification('Exportación satisfactoria', 'Confirmación', 1);
          this.utilsService.blockUIStop();
        }, error => {
          this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
          this.utilsService.blockUIStop();
        });
        break;
      default:
        break;
    }
  }

  onExpandirExportar(): void {
    this.mostrarFiltroExportacion = true;
    setTimeout(() => {
      this.coreCard.collapse();
      this.coreCard.onclickEvent.collapseStatus = false;
    }, 0);
    setTimeout(() => this.desdeFC.nativeElement.focus(), 500);
  }

  onVerAdelanto(cab: LiquidacionCab, modal: any) {
    this.utilsService.blockUIStart("Obteniendo información...");
    this.checkListService.listarAdelanto({
      idSolicitudCab: cab.idSolicitudCab
    }).subscribe((response: SolicitudCabAdelanto[]) => {
      this.adelantos = response;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

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

  onVistaPrevia(cab: LiquidacionCab): void {
    const liq = {...cab};
    liq.idEmpresa = this.currentUser.idEmpresa;
    liq.idUsuarioAud = this.currentUser.idUsuario;
    this.utilsService.blockUIStart('Previsualizando...');
    this.liquidacionesService.vistaPrevia(liq).subscribe(s => {
      let blob: any = new Blob([s], {type: 'application/pdf'});
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      // fileSaver.saveAs(blob, `${cab.codigo}.pdf`);
      this.utilsService.showNotification('Previsualización satisfactoria', 'Confirmación', 1);
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onSelect(cab: LiquidacionCab): void {
    this.selectEvent.emit(cab);
  }
}
