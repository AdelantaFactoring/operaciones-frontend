import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitudCab } from 'app/shared/models/comercial/solicitudCab';
import { SolicitudCabSustento } from 'app/shared/models/comercial/solicitudCab-sustento';
import { SolicitudDet } from 'app/shared/models/comercial/solicitudDet';
import { TablaMaestra } from 'app/shared/models/shared/tabla-maestra';
import { TablaMaestraService } from 'app/shared/services/tabla-maestra.service';
import { UtilsService } from 'app/shared/services/utils.service';
import Swal from 'sweetalert2';
import { SolicitudesService } from '../solicitudes.service';

@Component({
  selector: 'app-solicitudes-grilla',
  templateUrl: './solicitudes-grilla.component.html',
  styleUrls: ['./solicitudes-grilla.component.scss']
})
export class SolicitudesGrillaComponent implements OnInit {

  @Input() paramsURL: any;

  public submitted: boolean;
  public cambiarIcono: boolean = false;
  public solicitudes: SolicitudCab[];
  public solicitudDet: SolicitudDet[] = [];
  public solicitudDetForm: FormGroup;
  public solicitudForm: FormGroup;
  public rucPagProv: string;
  public pagProv: string;
  public search: string = '';
  public searchCli: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;
  public detalleSolicitud: SolicitudDet[] = [];
  public sustentosSolicitud: SolicitudCabSustento[] = [];
  public codigoSolicitud: string = '';
  public idTipoOperacion: number = 0;
  idTipoCT: number;
  public tipoCT: TablaMaestra[] = [];

  get ReactiveDetForm(): any {
    return this.solicitudDetForm.controls;
  }

  constructor(private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private solicitudesService: SolicitudesService,
    private modalService: NgbModal,
    private tablaMaestraService: TablaMaestraService
    ) {
    this.solicitudDetForm = this.formBuilder.group({
      nroSolicitud: [''],
      moneda: [''],
      cedente: [''],
      rucCedente: [''],
      aceptante: [''],
      rucAceptante: [''],
      tipoOperacion: [''],
      bancoD: [''],
      ctaBancariaD: [''],
      tipoCtaBancariaD: [''],
      titularCtaBancariaD: [''],
      comisionCN: [''],
      comisionE: [''],
      financiamiento: [''],
      servicioCob: [''],
      servicioCus: [''],
      tnm: [''],
      tna: [''],
      tnmm: [''],
      tnam: [''],
      totalDesCIgv: [''],
      totalFacCIgv: [''],
      nombreC: [''],
      correoC: [''],
      correoConCopiaC: [''],
      telefonoC: [''],
      estado: ['']

    });
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
  }

  async ngOnInit(): Promise<void> {
    this.onListarSolicitudes(this.paramsURL);
    this.tipoCT = await this.onListarMaestros(5, 0);
  }

  async onListarMaestros(idTabla: number, idColumna: number): Promise<TablaMaestra[]> {
    return await this.tablaMaestraService.listar({
      idTabla: idTabla,
      idColumna: idColumna
    }).then((response: TablaMaestra[]) => response, error => [])
      .catch(error => []);
  }

  onRefrescar(): void {
    this.onListarSolicitudes(this.paramsURL);
  }
  onListarSolicitudes(idSubConsulta): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesService.listar({
      idConsulta: 1,
      idSubConsulta: idSubConsulta,
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: SolicitudCab[]) => {
      this.solicitudes = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onCambiarVisibilidadDetalleTodo() {
    this.cambiarIcono = !this.cambiarIcono;
    this.solicitudes.forEach(el => {
     // if(el.idTipoOperacion != 2)
      el.cambiarIcono = this.cambiarIcono;
      document.getElementById('tr' + el.idSolicitudCab).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
      document.getElementById('detail' + el.idSolicitudCab).style.display = (el.cambiarIcono) ? "block" : "none";
    })
  }
  onCambiarVisibilidadDetalle(item: any) {
    item.cambiarIcono = !item.cambiarIcono;
    document.getElementById('tr' + item.idSolicitudCab).style.visibility = (item.cambiarIcono) ? "visible" : "collapse";
    document.getElementById('detail' + item.idSolicitudCab).style.display = (item.cambiarIcono) ? "block" : "none";

  }

  onDetalle(item, modal): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    //this.idTipoOperacion = item.idTipoOperacion;
    this.solicitudDet = item.solicitudDet;
    this.rucPagProv = item.idTipoOperacion == 1 ? "Ruc Pagador" : "Ruc Proveedor"
    this.pagProv = item.idTipoOperacion == 1 ? "Razón Social Pagador" : "Razón Social Proveedor"

    this.solicitudDetForm.controls.nroSolicitud.setValue(item.codigo);
    this.solicitudDetForm.controls.moneda.setValue(item.moneda);
    this.solicitudDetForm.controls.cedente.setValue(item.razonSocialCliente);
    this.solicitudDetForm.controls.rucCedente.setValue(item.rucCliente);
    this.solicitudDetForm.controls.aceptante.setValue(item.razonSocialPagProv);
    this.solicitudDetForm.controls.rucAceptante.setValue(item.rucPagProv);

    this.solicitudDetForm.controls.tipoOperacion.setValue(item.tipoOperacion);
    this.solicitudDetForm.controls.bancoD.setValue(item.bancoDestino);
    this.solicitudDetForm.controls.ctaBancariaD.setValue(item.nroCuentaBancariaDestino);
    this.solicitudDetForm.controls.tipoCtaBancariaD.setValue(item.tipoCuentaBancariaDestino);
    this.solicitudDetForm.controls.comisionCN.setValue(item.comisionCartaNotarial);

    this.solicitudDetForm.controls.comisionE.setValue(item.comisionEstructuracion);
    this.solicitudDetForm.controls.financiamiento.setValue(item.financiamiento);
    this.solicitudDetForm.controls.servicioCob.setValue(item.servicioCobranza);
    this.solicitudDetForm.controls.servicioCus.setValue(item.servicioCustodia);
    this.solicitudDetForm.controls.tnm.setValue(item.tasaNominalMensual);

    this.solicitudDetForm.controls.tna.setValue(item.tasaNominalAnual);
    this.solicitudDetForm.controls.tnmm.setValue(item.tasaNominalMensualMora);
    this.solicitudDetForm.controls.tnam.setValue(item.tasaNominalAnualMora);
    this.solicitudDetForm.controls.totalDesCIgv.setValue(item.totalDesembolsoConIGV);
    this.solicitudDetForm.controls.totalFacCIgv.setValue(item.totalFacConIGV);

    this.solicitudDetForm.controls.nombreC.setValue(item.nombreContacto);
    this.solicitudDetForm.controls.correoC.setValue(item.correoContacto);
    this.solicitudDetForm.controls.correoConCopiaC.setValue(item.conCopiaContacto);
    this.solicitudDetForm.controls.telefonoC.setValue(item.telefonoContacto);
    this.solicitudDetForm.controls.estado.setValue(item.estado);
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        size: 'lg',
        windowClass: 'my-class',
        animation: true,
        centered: false,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
    this.utilsService.blockUIStop();
  }

  onEliminar(idSolicitudCab, nroSolicitud): void {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Desea eliminar el registro '${nroSolicitud}'?, esta acción no podrá revertirse`,
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
        this.solicitudesService.eliminar({
          idSolicitudCab: idSolicitudCab,
          //idSolicitudDet: item.idSolicitudDet,
          idUsuarioAud: 1
        }).subscribe(response => {
          if (response.tipo === 1) {
            this.onListarSolicitudes(this.paramsURL);
            this.utilsService.showNotification('Registro eliminado correctamente', 'Confirmación', 1);
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
  onEliminarDet(cab: SolicitudCab, item: SolicitudDet): void {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Desea eliminar el registro '${item.nroDocumento}'?, esta acción no podrá revertirse`,
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
        this.solicitudesService.eliminarFactura({
          idSolicitudCab: item.idSolicitudCab,
          idSolicitudDet: item.idSolicitudDet,
          idUsuarioAud: 1
        }).subscribe(response => {
          if (response.tipo === 1) {
            cab.solicitudDet = cab.solicitudDet.filter(f => f.idSolicitudDet != item.idSolicitudDet);
            if (cab.solicitudDet.length === 0)
              this.onListarSolicitudes(this.paramsURL);
            this.utilsService.showNotification('Registro eliminado correctamente', 'Confirmación', 1);
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
  onCancelar(): void {
    this.submitted = false;
    this.modalService.dismissAll();
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
    this.idTipoCT = item.idTipoCT;
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
      netoSolicitado = ((360 * montoSolicitado) + (360 * gDiversonsSIgv)) /(360 - ((nroDias * ((TNM / 100) * 12)) * (igvCT + 1)));
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
}
