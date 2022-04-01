import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientesService } from 'app/main/comercial/clientes/clientes.service';
import { LiquidacionesService } from 'app/main/operaciones/liquidaciones/liquidaciones.service';
import { ClienteCuenta } from 'app/shared/models/comercial/cliente-cuenta';
import { LiquidacionCab } from 'app/shared/models/operaciones/liquidacion-cab';
import { UtilsService } from 'app/shared/services/utils.service';

@Component({
  selector: 'app-desembolso',
  templateUrl: './desembolso.component.html',
  styleUrls: ['./desembolso.component.scss']
})
export class DesembolsoComponent implements OnInit {
  public contentHeader: object;

  public solicitudForm: FormGroup;
  public search: string = '';
  public page: number = 1;
  public pageSize: number = 10;
  public collectionSize: number;
  public desembolso: LiquidacionCab[] = [];
  public cuentas: ClienteCuenta[] = [];
  public cambiarIcono: boolean = false;
  public seleccionarTodo: boolean = false;

  public codigo: string = '';
  public nroCuentaBancariaDestino: string;
  public cciDestino: string;

  
  get ReactiveIUForm(): any {
    return this.solicitudForm.controls;
  }

  constructor(
    private utilsService: UtilsService,
    private liquidacionesService: LiquidacionesService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private clienteService: ClientesService
  ) { 
    this.contentHeader = {
      headerTitle: 'Desembolso',
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
            name: 'Desembolso',
            isLink: false
          },
          {
            name: 'Aprobación Desembolso',
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
      montoTotal: [{value: 0, disabled: true}],
      tasaNominalMensual: [{value: 0, disabled: true}],
      tasaNominalAnual: [{value: 0, disabled: true}],
      tasaNominalMensualMora: [{value: 0, disabled: true}],
      tasaNominalAnualMora: [{value: 0, disabled: true}],
      financiamiento: [{value: 0, disabled: true}],
      comisionEstructuracion: [{value: 0, disabled: true}],
      usarGastosContrato: [false],
      gastosContrato: [{value: 0, disabled: true}],
      comisionCartaNotarial: [{value: 0, disabled: true}],
      servicioCobranza: [{value: 0, disabled: true}],
      servicioCustodia: [{value: 0, disabled: true}],
      usarGastoVigenciaPoder: [false],
      gastoVigenciaPoder: [0],
      // nombreContacto: [''],
      // telefonoContacto: [''],
      // correoContacto: [''],
      conCopiaContacto: [''],
      titularCuentaBancariaDestino: ['', Validators.required],
      monedaCuentaBancariaDestino: ['', Validators.required],
      bancoDestino: ['', Validators.required],
      // nroCuentaBancariaDestino: [''],
      // cciDestino: [''],
      tipoCuentaBancariaDestino: ['-', Validators.required],
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
  };

  ngOnInit(): void {
    console.log('hello');
    this.onListarDesembolso();
  }

  onListarDesembolso(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.liquidacionesService.listar({
      idConsulta: 1, // enviar 2
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: LiquidacionCab[]) => {
      this.desembolso = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onGenerarArchivo(): void{

  }

  onConfirmar(): void{

  }

  onSeleccionarTodo(): void {
    this.desembolso.forEach(el => {
      el.seleccionado = this.seleccionarTodo;
    });
  }
  onCambiarVisibilidadDetalle(item: any): void {
    item.cambiarIcono = !item.cambiarIcono;
    document.getElementById('tr' + item.idLiquidacionCab).style.visibility = (item.cambiarIcono) ? "visible" : "collapse";
    document.getElementById('detail' + item.idLiquidacionCab).style.display = (item.cambiarIcono) ? "block" : "none";
  }

  onCambiarVisibilidadDetalleTodo(): void {
    this.cambiarIcono = !this.cambiarIcono;
    this.desembolso.forEach(el => {
      el.cambiarIcono = this.cambiarIcono;
      document.getElementById('tr' + el.idLiquidacionCab).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
      document.getElementById('detail' + el.idLiquidacionCab).style.display = (el.cambiarIcono) ? "block" : "none";
    });
  }
  onEditar(item: LiquidacionCab, modal: any): void {
    this.solicitudForm.controls.idSolicitudCab.setValue(item.idSolicitudCab);
    //this.idCliente = item.idCliente;
    this.solicitudForm.controls.idTipoOperacion.setValue(item.idTipoOperacion);
   // this.idTipoOperacion = item.idTipoOperacion;
    this.solicitudForm.controls.codigo.setValue(item.codigo);
    this.codigo = item.codigo;
    this.solicitudForm.controls.rucCliente.setValue(item.rucCliente);
    this.solicitudForm.controls.razonSocialCliente.setValue(item.razonSocialCliente);
    this.solicitudForm.controls.rucPagProv.setValue(item.rucPagProv);
    this.solicitudForm.controls.razonSocialPagProv.setValue(item.razonSocialPagProv);
    this.solicitudForm.controls.moneda.setValue(item.moneda);
    //this.moneda = item.moneda;
    this.solicitudForm.controls.montoTotal.setValue(item.nuevoMontoTotal);
    // this.solicitudForm.controls.tasaNominalMensual.setValue(item.tasaNominalMensual);
    // this.solicitudForm.controls.tasaNominalAnual.setValue(item.tasaNominalAnual);
    // this.solicitudForm.controls.tasaNominalMensualMora.setValue(item.tasaNominalMensualMora);
    // this.solicitudForm.controls.tasaNominalAnualMora.setValue(item.tasaNominalAnualMora);
    // this.solicitudForm.controls.financiamiento.setValue(item.financiamiento);
    // this.solicitudForm.controls.comisionEstructuracion.setValue(item.comisionEstructuracion);
    // this.solicitudForm.controls.usarGastosContrato.setValue(item.usarGastosContrato);
    // this.solicitudForm.controls.gastosContrato.setValue(item.gastosContrato);
    // this.solicitudForm.controls.usarGastoVigenciaPoder.setValue(item.usarGastoVigenciaPoder);
    // this.solicitudForm.controls.gastoVigenciaPoder.setValue(item.gastoVigenciaPoder);
    // this.solicitudForm.controls.comisionCartaNotarial.setValue(item.comisionCartaNotarial);
    // this.solicitudForm.controls.servicioCobranza.setValue(item.servicioCobranza);
    // this.solicitudForm.controls.servicioCustodia.setValue(item.servicioCustodia);
    // this.nombreContacto = item.nombreContacto;
    // this.telefonoContacto = item.telefonoContacto;
    // this.correoContacto = item.correoContacto;
    this.solicitudForm.controls.titularCuentaBancariaDestino.setValue(item.titularCuentaBancariaDestino);
    this.solicitudForm.controls.monedaCuentaBancariaDestino.setValue(item.monedaCuentaBancariaDestino);
    this.solicitudForm.controls.bancoDestino.setValue(item.bancoDestino);
    this.nroCuentaBancariaDestino = item.nroCuentaBancariaDestino;
    this.cciDestino = item.cciDestino;
    this.solicitudForm.controls.tipoCuentaBancariaDestino.setValue(item.tipoCuentaBancariaDestino);
    this.solicitudForm.controls.idTipoCT.setValue(item.idTipoCT);
    // this.idTipoCT = item.idTipoCT;
    // this.solicitudForm.controls.montoCT.setValue(item.montoCT);
    // this.solicitudForm.controls.montoSolicitudCT.setValue(item.montoSolicitudCT);
    // this.solicitudForm.controls.diasPrestamoCT.setValue(item.diasPrestamoCT);
    // this.solicitudForm.controls.fechaPagoCT.setValue(item.fechaPagoCT);

    // this.detalle = item.solicitudDet;
    // this.sustentos = item.solicitudCabSustento;
    // this.onCalcularCT(item);
    console.log('det', item);
    
    this.utilsService.blockUIStart("Obteniendo información...");
    this.clienteService.obtener({
      idCliente: item.idCliente
    }).subscribe((response: any) => {
      console.log('res', response.clienteCuenta);
      
      // this.contactos = response.clienteContacto;
      this.cuentas = response.clienteCuenta;
      // this.cuentas = this.cuentas.filter(f => f.codigoMoneda === item.moneda);
      // this.gastos = response.clienteGastos;
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

  onCancelar(): void {
    //this.submitted = false;
    // this.sustentosOld = [];
    // this.nroCuentaBancariaDestino = "";
    // this.cciDestino = "";
    this.solicitudForm.reset();
    // this.onListarSolicitudes();
    // this.archivos = [];
    this.codigo = "";
    //this.archivosSustento.clearQueue();
    this.modalService.dismissAll();
  }

  onSeleccioneCuenta(modal): void {
    console.log('cuenta', this.cuentas);
    
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
  
  onSeleccionarCuenta(item: ClienteCuenta, modal): void {
    this.solicitudForm.controls.titularCuentaBancariaDestino.setValue(item.titular);
    this.solicitudForm.controls.monedaCuentaBancariaDestino.setValue(item.moneda);
    this.solicitudForm.controls.bancoDestino.setValue(item.banco);
    this.nroCuentaBancariaDestino = item.nroCuenta;
    this.cciDestino = item.cci;
    this.solicitudForm.controls.tipoCuentaBancariaDestino.setValue("-");
    modal.dismiss("Cross Click");
  }
}
