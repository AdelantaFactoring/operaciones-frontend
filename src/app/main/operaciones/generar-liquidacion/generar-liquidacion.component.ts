import {Component, OnInit} from '@angular/core';
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UtilsService} from "../../../shared/services/utils.service";
import {SolicitudesService} from "../../comercial/solicitudes/solicitudes.service";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import Swal from "sweetalert2";
import {LiquidacionesService} from "../liquidaciones/liquidaciones.service";
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {SolicitudDet} from "../../../shared/models/comercial/solicitudDet";
import {SolicitudCabSustento} from "../../../shared/models/comercial/solicitudCab-sustento";
import { User } from 'app/shared/models/auth/user';

@Component({
  selector: 'app-generar-liquidacion',
  templateUrl: './generar-liquidacion.component.html',
  styleUrls: ['./generar-liquidacion.component.scss']
})
export class GenerarLiquidacionComponent implements OnInit {
  public currentUser: User;
  public contentHeader: object;
  public solicitudes: SolicitudCab[] = [];
  public tipoCT: TablaMaestra[] = [];
  public montoTotalFacturadoMinimoTM: TablaMaestra[] = [];
  public cambiarIconoSolicitud: boolean = false;
  public seleccionarTodoSolicitud: boolean = false;
  public solicitudForm: FormGroup;
  public codigoSolicitud: string = '';
  public idTipoOperacion: number = 0;
  public detalleSolicitud: SolicitudDet[] = [];
  public sustentosSolicitud: SolicitudCabSustento[] = [];

  public searchSolicitud: string = '';
  public collectionSizeSolicitud: number = 0;
  public pageSizeSolicitud: number = 10;
  public pageSolicitud: number = 1;

  public motivoRechazo: string = '';
  public solicitudCabItem: SolicitudCab;

  constructor(private modalService: NgbModal,
              private utilsService: UtilsService,
              private solicitudesService: SolicitudesService,
              private liquidacionesService: LiquidacionesService,
              private tablaMaestraService: TablaMaestraService,
              private formBuilder: FormBuilder,) {
    this.contentHeader = {
      headerTitle: 'Generar',
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
            name: 'Generar',
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
      fondoResguardo: [{value: 0, disabled: true}],
      netoSolicitado: [{value: 0, disabled: true}],
      interesIncluidoIGV: [{value: 0, disabled: true}],
      gastosIncluidoIGV: [{value: 0, disabled: true}],
      totalFacturarIGV: [{value: 0, disabled: true}],
      totalDesembolso: [{value: 0, disabled: true}]
    });
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.utilsService.blockUIStart('Obteniendo información de maestros...');
    this.tipoCT = await this.onListarMaestros(5, 0);
    this.montoTotalFacturadoMinimoTM = await this.onListarMaestros(1000, 3);
    this.utilsService.blockUIStop();
    this.onListarSolicitudes();
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
      idUsuario: 0,
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

  onSeleccionarTodoSolicitud(): void {
    this.solicitudes.forEach(el => {
      if (el.checkList)
        el.seleccionado = this.seleccionarTodoSolicitud;
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

  onGenerar(): void {
    let solicitudes = this.solicitudes.filter(f => f.seleccionado);
    if (solicitudes.length == 0) {
      this.utilsService.showNotification("Seleccione una o varias solicitudes", "", 2);
      return;
    }

    solicitudes.forEach(el => {
      el.idEmpresa = this.currentUser.idEmpresa;
      el.idUsuarioAud = this.currentUser.idUsuario;
    });

    this.utilsService.blockUIStart('Generando...');
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
                  <th>Superó Monto Mínimo (${this.montoTotalFacturadoMinimoTM[0].valor})</th>
                </tr>
                </thead>
                <tbody>
                ${this.onFilas(response.liquidacionCabValidacion, true)}
                </tbody>
              </table>
            </div>
            <p style="text-align: right"><i class="text-success cursor-pointer fa fa-check"></i> : Satisfactorio&nbsp;&nbsp;
            <i class="text-danger cursor-pointer fa fa-ban"></i> : Incorrecto</p>`,
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

        this.onListarSolicitudes();
      } else if (response.comun.tipo == 2) {
        this.utilsService.showNotification(response.comun.mensaje, 'Validación', 2);
        this.utilsService.blockUIStop();
      } else if (response.comun.tipo == 0) {
        this.utilsService.showNotification(response.comun.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
      }

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onCalcularCT(item: SolicitudCab): void {
    let TNM, TNA, nroDias, intereses, montoSolicitado, totFacturar, fondoResguardo = 0;
    let contrato, servicioCustodia, servicioCobranza, cartaNotarial, gDiversonsSIgv, gDiversonsCIgv, gastoIncluidoIGV;
    let netoSolicitado = 0, igvCT, financiamiento;

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

      this.solicitudForm.controls.fondoResguardo.setValue(Math.round((fondoResguardo + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.netoSolicitado.setValue(Math.round((netoSolicitado + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.interesIncluidoIGV.setValue(Math.round((intereses + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.gastosIncluidoIGV.setValue(Math.round((gastoIncluidoIGV + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.totalFacturarIGV.setValue(Math.round((totFacturar + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.totalDesembolso.setValue(Math.round((montoSolicitado + Number.EPSILON) * 100) / 100);
    } else {
      fondoResguardo = montoSolicitado - ((montoSolicitado * financiamiento) / 100);
      netoSolicitado = montoSolicitado - fondoResguardo;

      gDiversonsCIgv = gDiversonsSIgv * igvCT;
      intereses = netoSolicitado * ((TNA / 100) / 360) * (nroDias) * (igvCT + 1);
      gastoIncluidoIGV = gDiversonsSIgv + gDiversonsCIgv;
      totFacturar = intereses + gastoIncluidoIGV;

      this.solicitudForm.controls.fondoResguardo.setValue(Math.round((fondoResguardo + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.netoSolicitado.setValue(Math.round((netoSolicitado + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.interesIncluidoIGV.setValue(Math.round((intereses + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.gastosIncluidoIGV.setValue(Math.round((gastoIncluidoIGV + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.totalFacturarIGV.setValue(Math.round((totFacturar + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.totalDesembolso.setValue(Math.round(((netoSolicitado + Number.EPSILON) - totFacturar) * 100) / 100);
    }
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
    this.solicitudForm.controls.conCopiaContacto.setValue(item.conCopiaContacto);
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

  onRechazarSolicitud(cab: SolicitudCab, modal: NgbModal): void {
    this.solicitudCabItem = cab;
    this.codigoSolicitud = cab.codigo;
    this.motivoRechazo = '';

    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        size: 'sm',
        animation: true,
        centered: true,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onGuardarRechazo() {
    if (this.motivoRechazo.trim() == '') {
      this.utilsService.showNotification('El motivo del rechazo es obligatorio de indicar', 'Alerta', 2);
      return;
    }

    Swal.fire({
      title: 'Confirmación',
      text: `¿Está seguro de rechazar la solicitud '${this.solicitudCabItem.codigo}'?`,
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
        this.utilsService.blockUIStart('Eliminando...');
        this.solicitudesService.cambiarEstado(
          [{
            idSolicitudCab: this.solicitudCabItem.idSolicitudCab,
            idEstado: 4,
            observacionRechazo: this.motivoRechazo,
            idUsuarioAud: this.currentUser.idUsuario
          }]
        ).subscribe(response => {
          if (response.tipo === 1) {
            this.utilsService.showNotification('Solicitud rechazada correctamente', 'Confirmación', 1);
            this.utilsService.blockUIStop();
            this.modalService.dismissAll();
            this.onListarSolicitudes();
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
}
