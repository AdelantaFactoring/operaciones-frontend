import {Component, OnInit, ViewEncapsulation} from '@angular/core';
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

@Component({
  selector: 'app-liquidaciones',
  templateUrl: './liquidaciones.component.html',
  styleUrls: ['./liquidaciones.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class LiquidacionesComponent implements OnInit {
  public contentHeader: object;
  public submitted: boolean = false;
  public seleccionarTodoSolicitud: boolean = false;
  public cambiarIconoSolicitud: boolean = false;
  public solicitudes: SolicitudCab[] = [];
  public liquidaciones: LiquidacionCab[] = [];
  public seleccionarTodo: boolean = false;
  public cambiarIcono: boolean = false;
  public solicitudForm: FormGroup;
  public liquidacionForm: FormGroup;
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

  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  public searchSolicitud: string = '';
  public collectionSizeSolicitud: number = 0;
  public pageSizeSolicitud: number = 10;
  public pageSolicitud: number = 1;

  public codigo: string;
  public deudaAnterior: number = 0;
  public observacion: string = '';

  get ReactiveIUForm(): any {
    return this.liquidacionForm.controls;
  }

  constructor(
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private solicitudesService: SolicitudesService,
    private liquidacionesService: LiquidacionesService,
    private tablaMaestraService: TablaMaestraService,
    private formBuilder: FormBuilder,) {
    this.contentHeader = {
      headerTitle: 'Liquidaciones',
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
            name: 'Liquidaciones',
            isLink: false
          }
        ]
      }
    };
    this.solicitudForm = this.formBuilder.group({
      idSolicitudCab: [0],
      idTipoOperacion: [0],
      codigo: [{value: '', disabled: true}],
      rucCliente: [{value: '', disabled: true}],
      razonSocialCliente: [{value: '', disabled: true}],
      rucPagProv: [{value: '', disabled: true}],
      razonSocialPagProv: [{value: '', disabled: true}],
      moneda: [{value: '', disabled: true}],
      tipoOperacion: [{value: '', disabled: true}],
      tasaNominalMensual: [{value: 0, disabled: true}],
      tasaNominalAnual: [{value: 0, disabled: true}],
      tasaNominalMensualMora: [{value: 0, disabled: true}],
      tasaNominalAnualMora: [{value: 0, disabled: true}],
      financiamiento: [{value: 0, disabled: true}],
      comisionEstructuracion: [{value: 0, disabled: true}],
      usarGastosContrato: [{value: false, disabled: true}],
      gastosContrato: [{value: 0, disabled: true}],
      comisionCartaNotarial: [{value: 0, disabled: true}],
      servicioCobranza: [{value: 0, disabled: true}],
      servicioCustodia: [{value: 0, disabled: true}],
      usarGastoVigenciaPoder: [{value: false, disabled: true}],
      gastoVigenciaPoder: [{value: 0, disabled: true}],
      nombreContacto: [{value: '', disabled: true}],
      telefonoContacto: [{value: '', disabled: true}],
      correoContacto: [{value: '', disabled: true}],
      conCopiaContacto: [{value: '', disabled: true}],
      titularCuentaBancariaDestino: [{value: '', disabled: true}],
      monedaCuentaBancariaDestino: [{value: '', disabled: true}],
      bancoDestino: [{value: '', disabled: true}],
      nroCuentaBancariaDestino: [{value: '', disabled: true}],
      cciDestino: [{value: '', disabled: true}],
      tipoCuentaBancariaDestino: [{value: '-', disabled: true}],
      idTipoCT: [{value: 0, disabled: true}],
      montoCT: [{value: 0, disabled: true}],
      montoSolicitudCT: [{value: 0, disabled: true}],
      diasPrestamoCT: [{value: 0, disabled: true}],
      fechaPagoCT: [{value: 0, disabled: true}],
      montoDescontarCT: [{value: 0, disabled: true}],
      interesConIGVCT: [{value: 0, disabled: true}],
      gastosConIGVCT: [{value: 0, disabled: true}],
      totFacurarConIGVCT: [{value: 0, disabled: true}],
      totDesembolsarConIGVCT: [{value: 0, disabled: true}],
      fondoResguardo:  [{value: 0, disabled: true}],
      netoSolicitado:  [{value: 0, disabled: true}],
      interesIncluidoIGV:  [{value: 0, disabled: true}],
      gastosIncluidoIGV:  [{value: 0, disabled: true}],
      totalFacturarIGV:  [{value: 0, disabled: true}],
      totalDesembolso:  [{value: 0, disabled: true}]
    });
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
    });
  }

  async ngOnInit(): Promise<void> {
    this.utilsService.blockUIStart('Obteniendo información de maestros...');
    this.tipoCT = await this.onListarMaestros(5, 0);
    this.tiposArchivos = await this.onListarMaestros(8, 0);
    this.utilsService.blockUIStop();
    this.onListarLiquidaciones();
  }

  async onListarMaestros(idTabla: number, idColumna: number): Promise<TablaMaestra[]> {
    return await this.tablaMaestraService.listar({
      idTabla: idTabla,
      idColumna: idColumna
    }).then((response: TablaMaestra[]) => response, error => [])
      .catch(error => []);
  }

  onListarSolicitudes(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesService.listar({
      idConsulta: 5,
      idSubConsulta: 0,
      search: this.searchSolicitud,
      pageIndex: this.pageSolicitud,
      pageSize: this.pageSizeSolicitud
    }).subscribe((response: SolicitudCab[]) => {
      this.solicitudes = response;
      this.collectionSizeSolicitud = response.length > 0 ? response[0].totalRows : 0;

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onListarLiquidaciones(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.liquidacionesService.listar({
      idConsulta: 1,
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: LiquidacionCab[]) => {
      this.liquidaciones = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
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

  onRefrescarSolicitud() {
    this.onListarSolicitudes();
  }

  onGenerarLiquidaciones(modal): void {
    this.searchSolicitud = '';
    this.onListarSolicitudes();
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

  onVerDetalleSolicitud(item: SolicitudCab, modal: any) {
    this.solicitudForm.controls.idSolicitudCab.setValue(item.idSolicitudCab);
    this.solicitudForm.controls.idTipoOperacion.setValue(item.idTipoOperacion);
    this.idTipoOperacion = item.idTipoOperacion;
    this.solicitudForm.controls.codigo.setValue(item.codigo);
    this.codigoSolicitud = item.codigo;
    this.solicitudForm.controls.rucCliente.setValue(item.rucCliente);
    this.solicitudForm.controls.razonSocialCliente.setValue(item.razonSocialCliente);
    this.solicitudForm.controls.rucPagProv.setValue(item.rucPagProv);
    this.solicitudForm.controls.razonSocialPagProv.setValue(item.razonSocialPagProv);
    this.solicitudForm.controls.moneda.setValue(item.moneda);
    this.solicitudForm.controls.tipoOperacion.setValue(item.tipoOperacion);
    this.solicitudForm.controls.tasaNominalMensual.setValue(item.tasaNominalMensual);
    this.solicitudForm.controls.tasaNominalAnual.setValue(item.tasaNominalAnual);
    this.solicitudForm.controls.tasaNominalMensualMora.setValue(item.tasaNominalMensualMora);
    this.solicitudForm.controls.tasaNominalAnualMora.setValue(item.tasaNominalAnualMora);
    this.solicitudForm.controls.financiamiento.setValue(item.financiamiento);
    this.solicitudForm.controls.comisionEstructuracion.setValue(item.comisionEstructuracion);
    this.solicitudForm.controls.usarGastosContrato.setValue(item.usarGastosContrato);
    this.solicitudForm.controls.gastosContrato.setValue(item.gastosContrato);
    this.solicitudForm.controls.usarGastoVigenciaPoder.setValue(item.usarGastoVigenciaPoder);
    this.solicitudForm.controls.gastoVigenciaPoder.setValue(item.gastoVigenciaPoder);
    this.solicitudForm.controls.comisionCartaNotarial.setValue(item.comisionCartaNotarial);
    this.solicitudForm.controls.servicioCobranza.setValue(item.servicioCobranza);
    this.solicitudForm.controls.servicioCustodia.setValue(item.servicioCustodia);
    this.solicitudForm.controls.nombreContacto.setValue(item.nombreContacto);
    this.solicitudForm.controls.telefonoContacto.setValue(item.telefonoContacto);
    this.solicitudForm.controls.correoContacto.setValue(item.correoContacto);
    this.solicitudForm.controls.titularCuentaBancariaDestino.setValue(item.titularCuentaBancariaDestino);
    this.solicitudForm.controls.monedaCuentaBancariaDestino.setValue(item.monedaCuentaBancariaDestino);
    this.solicitudForm.controls.bancoDestino.setValue(item.bancoDestino);
    this.solicitudForm.controls.nroCuentaBancariaDestino.setValue(item.nroCuentaBancariaDestino);
    this.solicitudForm.controls.cciDestino.setValue(item.cciDestino);
    this.solicitudForm.controls.tipoCuentaBancariaDestino.setValue(item.tipoCuentaBancariaDestino);
    this.solicitudForm.controls.idTipoCT.setValue(item.idTipoCT);
    this.solicitudForm.controls.montoCT.setValue(item.montoCT);
    this.solicitudForm.controls.montoSolicitudCT.setValue(item.montoSolicitudCT);
    this.solicitudForm.controls.diasPrestamoCT.setValue(item.diasPrestamoCT);
    this.solicitudForm.controls.fechaPagoCT.setValue(item.fechaPagoCT);

    this.detalleSolicitud = item.solicitudDet;
    this.sustentosSolicitud = item.solicitudCabSustento;
    this.onCalcularCT(item);

    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        //size: 'lg',
        windowClass: 'my-class1',
        animation: true,
        centered: false,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onCalcularCT(item: SolicitudCab): void{
    let TNM, TNA, nroDias, intereses, montoSolicitado, totFacturar, fondoResguardo = 0;
    let contrato, servicioCustodia, servicioCobranza, cartaNotarial, gDiversonsSIgv, gDiversonsCIgv, gastoIncluidoIGV;
    let netoSolicitado = 0, igvCT,  financiamiento;

    contrato = this.solicitudForm.controls.gastosContrato.value;
    servicioCustodia = this.solicitudForm.controls.servicioCustodia.value;
    servicioCobranza = this.solicitudForm.controls.servicioCobranza.value;
    cartaNotarial = this.solicitudForm.controls.comisionCartaNotarial.value;
    TNM = this.solicitudForm.controls.tasaNominalMensual.value;
    TNA = this.solicitudForm.controls.tasaNominalAnual.value;
    nroDias = this.solicitudForm.controls.diasPrestamoCT.value;
    montoSolicitado = this.solicitudForm.controls.montoSolicitudCT.value;
    gDiversonsSIgv = contrato + servicioCustodia + servicioCobranza + cartaNotarial;
    igvCT = item.igvct / 100;
    financiamiento = item.financiamiento;
    if (item.idTipoCT == 1) {
      netoSolicitado = ((360 * montoSolicitado) + (360 * (gDiversonsSIgv * (igvCT + 1)))) / (360 - ((nroDias * ((TNM / 100) * 12)) * (igvCT + 1)));
      intereses = netoSolicitado * ((TNA / 100) / 360) * nroDias * (igvCT + 1);
      gDiversonsCIgv = gDiversonsSIgv * igvCT;
      gastoIncluidoIGV = gDiversonsSIgv + gDiversonsCIgv;
      totFacturar = intereses + gastoIncluidoIGV;

      this.solicitudForm.controls.fondoResguardo.setValue(Math.round((fondoResguardo + Number.EPSILON) * 100)/100);
      this.solicitudForm.controls.netoSolicitado.setValue(Math.round((netoSolicitado + Number.EPSILON) * 100)/100);
      this.solicitudForm.controls.interesIncluidoIGV.setValue(Math.round((intereses + Number.EPSILON) * 100)/100);
      this.solicitudForm.controls.gastosIncluidoIGV.setValue(Math.round((gastoIncluidoIGV + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.totalFacturarIGV.setValue(Math.round((totFacturar + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.totalDesembolso.setValue(Math.round((montoSolicitado + Number.EPSILON) * 100) / 100);
    }
    else
    {
      fondoResguardo = montoSolicitado - ((montoSolicitado * financiamiento) / 100);
      netoSolicitado = montoSolicitado - fondoResguardo;

      gDiversonsCIgv = gDiversonsSIgv * igvCT;
      intereses = netoSolicitado * ((TNA / 100) / 360) * (nroDias) * (igvCT + 1);
      gastoIncluidoIGV = gDiversonsSIgv + gDiversonsCIgv;
      totFacturar = intereses + gastoIncluidoIGV;

      this.solicitudForm.controls.fondoResguardo.setValue(Math.round((fondoResguardo + Number.EPSILON) * 100)/100);
      this.solicitudForm.controls.netoSolicitado.setValue(Math.round((netoSolicitado + Number.EPSILON) * 100)/100);
      this.solicitudForm.controls.interesIncluidoIGV.setValue(Math.round((intereses + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.gastosIncluidoIGV.setValue(Math.round((gastoIncluidoIGV + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.totalFacturarIGV.setValue(Math.round((totFacturar + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.totalDesembolso.setValue(Math.round(((netoSolicitado + Number.EPSILON) - totFacturar) * 100) / 100);
    }
  }

  onAprobar(idEstado: number): void {
    // @ts-ignore
    let liquidaciones = [...this.liquidaciones.filter(f => f.seleccionado)];

    if (liquidaciones.length === 0) {
      this.utilsService.showNotification("Seleccione una o varias liquidaciones", "", 2);
      return;
    }

    liquidaciones.forEach(el => {
      el.idEstado = idEstado;
      el.idUsuarioAud = 1;
    });

    this.utilsService.blockUIStart('Aprobando...');
    this.liquidacionesService.cambiarEstado(liquidaciones).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Aprobación Satisfactoria', 'Confirmación', 1);
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
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onGenerar(modal: any): void {
    let solicitudes = this.solicitudes.filter(f => f.seleccionado);
    if (solicitudes.length == 0) {
      this.utilsService.showNotification("Seleccione una o varias solicitudes", "", 2);
      return;
    }

    solicitudes.forEach(el => {
      el.idEstado = 1;
      el.idUsuarioAud = 1;
    });

    this.utilsService.blockUIStart('Generando...');
    this.liquidacionesService.pdf(solicitudes).subscribe(response => {

      if (response.comun.tipo == 1) {
        this.utilsService.showNotification('Información registrada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();

        modal.dismiss();
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

    this.liquidacionesService.generar(solicitudes).subscribe(response => {
      if (response.comun.tipo == 1) {
        this.utilsService.showNotification('Información registrada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();

        Swal.fire({
          title: 'Información',
          html: `
            <p style="text-align: justify">Resultado de la generación de liquidacion(es)</p>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                <tr>
                  <th>N° Liquidación</th>
                  <th>Superó Monto Mínimo</th>
                  <th>Correo Enviado</th>
                </tr>
                </thead>
                <tbody>
                ${this.onFilas(response.liquidacionCabValidacion)}
                </tbody>
              </table>
            </div>
            <p style="text-align: justify">Consulte las facturas de las solicitudes para verificar su estado. Utilice el código de respuesta como referencia para su validación.</p>`,
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

        modal.dismiss();
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

  onFilas(liquidaciones: any): string {
    let filas = "";
    for (const item of liquidaciones) {
      filas += `<tr><td>${item.codigo}</td>
                <td>${item.montoSuperado ? '<i class="text-success cursor-pointer" data-feather="check"></i>' :
                      '<i class="text-danger cursor-pointer" data-feather="slash"></i>'}</td>
                <td>${item.correoEnviado === 1  ? '<i class="text-success cursor-pointer" data-feather="check"></i>' :
                                    (item.correoEnviado === 0 ? '<i class="text-danger cursor-pointer" data-feather="slash"></i>' :
                                      '<i class="text-danger cursor-pointer" data-feather="minus-circle"></i>')}</td>
                </tr>`
    }
    return filas;
  }

  onCambiarFechaOperacion($event: any, cab: LiquidacionCab, item: LiquidacionDet) {
    item.fechaOperacionFormat = `${String($event.day).padStart(2, '0')}/${String($event.month).padStart(2, '0')}/${$event.year}`;
    item.editado = true;
    this.onCalcular(cab, item);
  }

  onEditar(item: LiquidacionDet): void {
    this.oldLiquidacionDet = {...item};
    item.edicion = true;
  }

  onCancelar(item: LiquidacionDet): void {
    if (!item.cambioConfirmado) {
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
      item.edicion = false;
      item.editado = false;
    } else {
      item.edicion = false;
    }
  }

  onConfirmarCambio(item: LiquidacionDet): void {
    item.edicion = false;
    item.editado = true;
    item.cambioConfirmado = true;
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
    let itemActual = { ...item };
    if (itemActual.liquidacionDet.filter(f => f.cambioConfirmado).length == 0) return;

    itemActual.idUsuarioAud = 1;
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
    this.codigo = cab.codigo;
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
    this.sustentos = cab.liquidacionCabSustento.filter(x => x.idTipoSustento === 1);

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
      this.liquidacionForm.controls.montoTotal.value - this.deudaAnterior
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
          idTipoSustento : 1,
          nombre: item.file.name,
          tamanio: `${(item.file.size / 1024 / 1024).toLocaleString('es-pe', {minimumFractionDigits: 2})} MB`,
          base64: base64
        });
      }
    }
  }

  onEliminarArchivo(item): void{
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
    if (this.sustentosOld.length === 0)
      for (let item of this.sustentos) {
        this.sustentosOld.push({
          idLiquidacionCabSustento: item.idLiquidacionCabSustento,
          idLiquidacionCab: item.idLiquidacionCab,
          idTipoSustento: 2,
          idTipo: item.idTipo,
          tipo: item.tipo,
          archivo: item.archivo,
          base64: item.base64,
          rutaArchivo: item.rutaArchivo,
          estado: item.estado,
          editado: item.editado
        });
      }
    else {
      this.sustentos = []
      for (let item of this.sustentosOld) {
        this.sustentos.push({
          idLiquidacionCabSustento: item.idLiquidacionCabSustento,
          idLiquidacionCab: item.idLiquidacionCab,
          idTipoSustento: 2,
          idTipo: item.idTipo,
          tipo: item.tipo,
          archivo: item.archivo,
          base64: item.base64,
          rutaArchivo: item.rutaArchivo,
          estado: item.estado,
          editado: item.editado
        });
      }
    }

    for (let item of this.archivos) {
      this.sustentos.push({
        idLiquidacionCabSustento: 0,
        idLiquidacionCab: 0,
        idTipoSustento: 2,
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
      deudaAnterior: this.deudaAnterior,
      nuevoMontoTotal: this.liquidacionForm.controls.nuevoMontoTotal.value,
      observacion: this.observacion,
      idUsuarioAud: 1,
      liquidacionCabSustento: this.sustentos.filter(f => f.editado)
    }).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
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
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onCancelarCab(): void {
    this.submitted = false;
    this.sustentosOld = [];
    this.liquidacionForm.reset();
    this.onListarLiquidaciones();
    this.archivos = [];
    this.codigo = "";
    this.archivosSustento.clearQueue();
    this.modalService.dismissAll();
  }
}
