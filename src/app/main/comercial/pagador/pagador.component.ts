import {Component, OnInit} from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {ClientePagadorService} from "./../cliente-pagador.service";
import {ClientePagador} from "../../../shared/models/comercial/cliente-pagador";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientePagadorContacto} from "../../../shared/models/comercial/cliente-pagador-contacto";
import {ClientePagadorCuenta} from "../../../shared/models/comercial/cliente-pagador-cuenta";
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";

@Component({
  selector: 'app-pagador',
  templateUrl: './pagador.component.html',
  styleUrls: ['./pagador.component.scss']
})
export class PagadorComponent implements OnInit {
  public contentHeader: object;
  public pagadores: ClientePagador[];
  public submitted: boolean;
  public submittedCuenta: boolean;
  public submittedContacto: boolean;
  public pagadorForm: FormGroup;
  public cuentaForm: FormGroup;
  public contactoForm: FormGroup;
  public contactos: ClientePagadorContacto[] = [];
  public cuentas: ClientePagadorCuenta[] = [];
  public monedas: TablaMaestra[];
  public oldCuenta: ClientePagadorCuenta;
  public oldContacto: ClientePagadorContacto;
  public search: string = '';
  //Paginación
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  get ReactiveIUForm(): any {
    return this.pagadorForm.controls;
  }

  get ReactiveIUFormCuenta(): any {
    return this.cuentaForm.controls;
  }

  get ReactiveIUFormContacto(): any {
    return this.contactoForm.controls;
  }

  constructor(private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private utilsService: UtilsService,
              private clientePagadorService: ClientePagadorService,
              private tablaMaestraService: TablaMaestraService) {
    this.contentHeader = {
      headerTitle: 'Pagador',
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
            name: 'Comercial',
            isLink: false
          },
          {
            name: 'Pagador',
            isLink: false
          }
        ]
      }
    };
    this.pagadorForm = this.formBuilder.group({
      idClientePagador: [0],
      ruc: ['', Validators.required],
      razonSocial: ['', Validators.required],
      direccionPrincipal: ['', Validators.required],
      direccionFacturacion: [''],
      tasaNominalMensual: [0.00],
      tasaNominalAnual: [0.00],
      financiamiento: [0.00],
      comisionEstructuracion: [0.00],
      factoring: [false],
      confirming: [false],
      capitalTrabajo: [false],
      idMoneda: [1],
      gastosContrato: [0],
      comisionCartaNotarial: [0],
      servicioCobranza: [0],
      servicioCustodia: [0]
    });
    this.cuentaForm = this.formBuilder.group({
      titular: [''],
      banco: ['', Validators.required],
      idMoneda: [1],
      nroCuenta: ['', Validators.required],
      cci: [''],
      predeterminado: [{value: false, disabled: true}],
    });
    this.contactoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      predeterminado: [{value: false, disabled: true}]
    });
  }
  async ngOnInit(): Promise<void> {
    this.utilsService.blockUIStart('Obteniendo información de maestros...');
    this.monedas = await this.onListarMaestros(1, 0);
    this.utilsService.blockUIStop();

    this.onListarPagadores();
  }

  async onListarMaestros(idTabla: number, idColumna: number): Promise<TablaMaestra[]> {
    return await this.tablaMaestraService.listar({
      idTabla: idTabla,
      idColumna: idColumna
    }).then((response: TablaMaestra[]) => response, error => [])
      .catch(error => []);
  }

  onListarPagadores(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.clientePagadorService.listar({
      idTipo: 2,
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: ClientePagador[]) => {
      this.pagadores = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onRefrescar(): void {
    this.onListarPagadores();
  }

  onNuevo(modal: any): void {
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

  onEditar(item: ClientePagador, modal: any): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.pagadorForm.controls.idClientePagador.setValue(item.idClientePagador);
    this.pagadorForm.controls.ruc.setValue(item.ruc);
    this.pagadorForm.controls.razonSocial.setValue(item.razonSocial);
    this.pagadorForm.controls.direccionPrincipal.setValue(item.direccionPrincipal);
    this.pagadorForm.controls.direccionFacturacion.setValue(item.direccionFacturacion);
    this.pagadorForm.controls.tasaNominalMensual.setValue(item.tasaNominalMensual);
    this.pagadorForm.controls.tasaNominalAnual.setValue(item.tasaNominalAnual);
    this.pagadorForm.controls.financiamiento.setValue(item.financiamiento);
    this.pagadorForm.controls.comisionEstructuracion.setValue(item.comisionEstructuracion);
    this.pagadorForm.controls.factoring.setValue(item.factoring);
    this.pagadorForm.controls.confirming.setValue(item.confirming);
    this.pagadorForm.controls.capitalTrabajo.setValue(item.capitalTrabajo);
    this.pagadorForm.controls.idMoneda.setValue(item.idMoneda);
    this.pagadorForm.controls.gastosContrato.setValue(item.gastosContrato);
    this.pagadorForm.controls.comisionCartaNotarial.setValue(item.comisionCartaNotarial);
    this.pagadorForm.controls.servicioCobranza.setValue(item.servicioCobranza);
    this.pagadorForm.controls.servicioCustodia.setValue(item.servicioCustodia);

    this.clientePagadorService.obtener({
      idClientePagador: item.idClientePagador
    }).subscribe((response: any) => {
      this.contactos = response.clientePagadorContacto;
      this.cuentas = response.clientePagadorCuenta;
      this.utilsService.blockUIStop();

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
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onEliminar(item: ClientePagador): void {

  }

  onGuardar(): void {
    this.submitted = true;
    if (this.pagadorForm.invalid)
      return;
    this.utilsService.blockUIStart('Guardando...');
    this.clientePagadorService.guardar({
      idClientePagador: this.pagadorForm.controls.idClientePagador.value,
      idTipo: 2,
      ruc: this.pagadorForm.controls.ruc.value,
      razonSocial: this.pagadorForm.controls.razonSocial.value,
      direccionPrincipal: this.pagadorForm.controls.direccionPrincipal.value,
      direccionFacturacion: this.pagadorForm.controls.direccionFacturacion.value,
      tasaNominalMensual: this.pagadorForm.controls.tasaNominalMensual.value,
      tasaNominalAnual: this.pagadorForm.controls.tasaNominalAnual.value,
      financiamiento: this.pagadorForm.controls.financiamiento.value,
      comisionEstructuracion: this.pagadorForm.controls.comisionEstructuracion.value,
      factoring: this.pagadorForm.controls.factoring.value,
      confirming: this.pagadorForm.controls.confirming.value,
      capitalTrabajo: this.pagadorForm.controls.capitalTrabajo.value,
      idMoneda: this.pagadorForm.controls.idMoneda.value,
      gastosContrato: this.pagadorForm.controls.gastosContrato.value,
      comisionCartaNotarial: this.pagadorForm.controls.comisionCartaNotarial.value,
      servicioCobranza: this.pagadorForm.controls.servicioCobranza.value,
      servicioCustodia: this.pagadorForm.controls.servicioCustodia.value,
      usuarioAud: 'superadmin',
      contacto: this.contactos.filter(f => f.editado),
      cuenta: this.cuentas.filter(f => f.editado)
    }).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarPagadores();
        this.onCancelar();
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

  onCancelar(): void {
    this.submitted = false;
    this.contactos = [];
    this.cuentas = [];
    this.pagadorForm.reset();
    this.modalService.dismissAll();
  }

  onAgregarCuenta(): void {
    this.submittedCuenta = true;
    if (this.cuentaForm.invalid)
      return;
    this.cuentas.push({
      idClientePagadorCuenta: 0,
      idClientePagador: 0,
      titular: this.cuentaForm.controls.titular.value,
      banco: this.cuentaForm.controls.banco.value,
      idMoneda: this.cuentaForm.controls.idMoneda.value,
      moneda: this.monedas.find(f => f.idColumna === this.cuentaForm.controls.idMoneda.value).descripcion,
      nroCuenta: this.cuentaForm.controls.nroCuenta.value,
      cci: this.cuentaForm.controls.cci.value,
      predeterminado: this.cuentaForm.controls.predeterminado.value,
      idFila: this.utilsService.autoIncrement(this.cuentas),
      edicion: false,
      editado: true
    });
    this.cuentaForm.reset();
    this.submittedCuenta = false;
  }

  onEditarCuenta(item: ClientePagadorCuenta): void {
    this.oldCuenta = {
      idClientePagadorCuenta: item.idClientePagadorCuenta,
      idClientePagador: item.idClientePagador,
      titular: item.titular,
      banco: item.banco,
      idMoneda: item.idMoneda,
      moneda: item.moneda,
      nroCuenta: item.nroCuenta,
      cci: item.cci,
      predeterminado: item.predeterminado,
      idFila: item.idFila,
      edicion: item.edicion,
      editado: item.editado
    };
    item.edicion = true;
  }

  onCancelarCuenta(item: ClientePagadorCuenta): void {
    item.idClientePagadorCuenta = this.oldCuenta.idClientePagadorCuenta;
    item.idClientePagador = this.oldCuenta.idClientePagador;
    item.titular = this.oldCuenta.titular;
    item.banco = this.oldCuenta.banco;
    item.idMoneda = this.oldCuenta.idMoneda;
    item.moneda = this.oldCuenta.moneda;
    item.nroCuenta = this.oldCuenta.nroCuenta;
    item.cci = this.oldCuenta.cci;
    item.predeterminado = this.oldCuenta.predeterminado;
    item.idFila = this.oldCuenta.idFila;
    item.edicion = false;
    item.editado = false;
  }

  onConfirmarCambioCuenta(item: ClientePagadorCuenta): void {
    item.moneda = this.monedas.find(f => f.idColumna === item.idMoneda).descripcion;
    item.edicion = false;
    item.editado = true;
  }

  onAgregarContacto(): void {
    this.submittedContacto = true;
    if (this.contactoForm.invalid)
      return;
    this.contactos.push({
      idClientePagadorContacto: 0,
      idClientePagador: 0,
      nombre: this.contactoForm.controls.nombre.value,
      apellidoPaterno: this.contactoForm.controls.apellidoPaterno.value,
      apellidoMaterno: this.contactoForm.controls.apellidoMaterno.value,
      telefono: this.contactoForm.controls.telefono.value,
      correo: this.contactoForm.controls.correo.value,
      predeterminado: this.cuentaForm.controls.predeterminado.value,
      idFila: this.utilsService.autoIncrement(this.contactos),
      edicion: false,
      editado: true
    });
    this.contactoForm.reset();
    this.submittedContacto = false;
  }

  onEditarContacto(item: ClientePagadorContacto): void {
    this.oldContacto = {
      idClientePagadorContacto: item.idClientePagadorContacto,
      idClientePagador: item.idClientePagador,
      nombre: item.nombre,
      apellidoPaterno: item.apellidoPaterno,
      apellidoMaterno: item.apellidoMaterno,
      telefono: item.telefono,
      correo: item.correo,
      predeterminado: item.predeterminado,
      idFila: item.idFila,
      edicion: item.edicion,
      editado: item.editado
    };
    item.edicion = true;
  }

  onCancelarContacto(item: ClientePagadorContacto): void {
    item.idClientePagadorContacto = this.oldContacto.idClientePagadorContacto;
    item.idClientePagador = this.oldContacto.idClientePagador;
    item.nombre = this.oldContacto.nombre;
    item.apellidoPaterno = this.oldContacto.apellidoPaterno;
    item.apellidoMaterno = this.oldContacto.apellidoMaterno;
    item.telefono = this.oldContacto.telefono;
    item.correo = this.oldContacto.correo;
    item.predeterminado = this.oldContacto.predeterminado;
    item.idFila = this.oldContacto.idFila;
    item.edicion = false;
    item.editado = false;
  }

  onConfirmarCambioContacto(item: ClientePagadorContacto): void {
    item.edicion = false;
    item.editado = true;
  }
}
