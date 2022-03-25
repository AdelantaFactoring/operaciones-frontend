import {Component, OnInit} from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {SolicitudesService} from "../../comercial/solicitudes/solicitudes.service";
import {LiquidacionesService} from "./liquidaciones.service";
import {LiquidacionCab} from "../../../shared/models/operaciones/liquidacion-cab";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SolicitudDet} from "../../../shared/models/comercial/solicitudDet";
import {SolicitudCabSustento} from "../../../shared/models/comercial/solicitudCab-sustento";
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";

@Component({
  selector: 'app-liquidaciones',
  templateUrl: './liquidaciones.component.html',
  styleUrls: ['./liquidaciones.component.scss']
})
export class LiquidacionesComponent implements OnInit {
  public contentHeader: object;
  public seleccionarTodoSolicitud: boolean = false;
  public cambiarIconoSolicitud: boolean = false;
  public solicitudes: SolicitudCab[] = [];
  public liquidaciones: LiquidacionCab[] = [];
  public seleccionarTodo: boolean = false;
  public cambiarIcono: boolean = false;
  public solicitudForm: FormGroup;
  public codigoSolicitud: string = '';
  public idTipoOperacion: number = 0;
  public detalleSolicitud: SolicitudDet[] = [];
  public sustentosSolicitud: SolicitudCabSustento[] = [];
  public tipoCT: TablaMaestra[] = [];

  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  public searchSolicitud: string = '';
  public collectionSizeSolicitud: number = 0;
  public pageSizeSolicitud: number = 10;
  public pageSolicitud: number = 1;

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
      totDesembolsarConIGVCT: [{value: 0, disabled: true}]
    });
  }

  async ngOnInit(): Promise<void> {
    this.utilsService.blockUIStart('Obteniendo información de maestros...');
    this.tipoCT = await this.onListarMaestros(5, 0);
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
      document.getElementById('tr' + el.idLiquidacionCab).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
      document.getElementById('detail' + el.idLiquidacionCab).style.display = (el.cambiarIcono) ? "block" : "none";
    });
  }

  onCambiarVisibilidadDetalle(item: LiquidacionCab): void {
    item.cambiarIcono = !item.cambiarIcono;
    document.getElementById('tr' + item.idLiquidacionCab).style.visibility = (item.cambiarIcono) ? "visible" : "collapse";
    document.getElementById('detail' + item.idLiquidacionCab).style.display = (item.cambiarIcono) ? "block" : "none";
  }

  onCambiarVisibilidadDetalleTodoSolicitud(): void {
    this.cambiarIconoSolicitud = !this.cambiarIconoSolicitud;
    this.solicitudes.forEach(el => {
      el.cambiarIcono = this.cambiarIconoSolicitud;
      document.getElementById('tr' + el.idSolicitudCab).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
      document.getElementById('detail' + el.idSolicitudCab).style.display = (el.cambiarIcono) ? "block" : "none";
    });
  }

  onCambiarVisibilidadDetalleSolicitud(item: SolicitudCab): void {
    item.cambiarIcono = !item.cambiarIcono;
    document.getElementById('tr' + item.idSolicitudCab).style.visibility = (item.cambiarIcono) ? "visible" : "collapse";
    document.getElementById('detail' + item.idSolicitudCab).style.display = (item.cambiarIcono) ? "block" : "none";
  }

  onSeleccionarTodo(): void {
    this.liquidaciones.forEach(el => {
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
    let igvCT = item.igvct / 100;
    let mDescontar, intereses, totFacturar, gastoIncluidoIGV;

    let montoSolicitudCT = this.solicitudForm.controls.montoSolicitudCT.value;
    let nroDias = this.solicitudForm.controls.diasPrestamoCT.value;
    let montoSolicitado = this.solicitudForm.controls.montoSolicitudCT.value;
    let gDiversonsSIgv = item.gastosContrato + item.servicioCustodia + item.servicioCobranza + item.comisionCartaNotarial;
    let gDiversonsCIgv = gDiversonsSIgv * igvCT;

    if (item.idTipoCT == 1) {
      mDescontar = ((360 * montoSolicitudCT) + (360 * gDiversonsSIgv)) / (360 - ((nroDias * (item.tasaNominalMensual * 12))* igvCT ));
      intereses = mDescontar * (item.tasaNominalAnual / 360) * nroDias * igvCT;

      gastoIncluidoIGV = gDiversonsSIgv + gDiversonsCIgv;
      totFacturar = intereses + gastoIncluidoIGV;

      this.solicitudForm.controls.montoDescontarCT.setValue(Math.round((mDescontar + Number.EPSILON) * 100)/100);
      this.solicitudForm.controls.interesConIGVCT.setValue(Math.round((intereses + Number.EPSILON) * 100)/100);
      this.solicitudForm.controls.gastosConIGVCT.setValue(Math.round((gastoIncluidoIGV + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.totFacurarConIGVCT.setValue(Math.round((totFacturar + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.totDesembolsarConIGVCT.setValue(Math.round((montoSolicitado + Number.EPSILON) * 100) / 100);
    }
    else
    {
      intereses = montoSolicitudCT * (item.tasaNominalAnual / 360) * (nroDias + 1) * igvCT;
      gastoIncluidoIGV = gDiversonsSIgv + gDiversonsCIgv;
      totFacturar = intereses + gastoIncluidoIGV;

      this.solicitudForm.controls.interesConIGVCT.setValue(Math.round((intereses + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.gastosConIGVCT.setValue(Math.round((gastoIncluidoIGV + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.totFacurarConIGVCT.setValue(Math.round((totFacturar + Number.EPSILON) * 100) / 100);
      this.solicitudForm.controls.totDesembolsarConIGVCT.setValue(Math.round(((montoSolicitado + Number.EPSILON) - totFacturar) * 100) / 100);
    }
  }
}
