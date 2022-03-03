import {Component, OnInit} from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {ClientesService} from "./clientes.service";
import {ClientePagador} from "../../../shared/models/comercial/cliente-pagador";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientePagadorContacto} from "../../../shared/models/comercial/cliente-pagador-contacto";
import {ClientePagadorCuenta} from "../../../shared/models/comercial/cliente-pagador-cuenta";
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  public contentHeader: object;
  public clientes: ClientePagador[];
  public submitted: boolean;
  public submittedCuenta: boolean;
  public submittedContacto: boolean;
  public clienteForm: FormGroup;
  public cuentaForm: FormGroup;
  public contactoForm: FormGroup;
  public contactos: ClientePagadorContacto[] = [];
  public cuentas: ClientePagadorCuenta[] = [];
  public monedas: TablaMaestra[];
  public oldCuenta: ClientePagadorCuenta;
  public oldContacto: ClientePagadorContacto;

  get ReactiveIUForm(): any {
    return this.clienteForm.controls;
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
              private clientesService: ClientesService,
              private tablaMaestraService: TablaMaestraService) {
    this.contentHeader = {
      headerTitle: 'Clientes',
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
            name: 'Clientes',
            isLink: false
          }
        ]
      }
    };
    this.clienteForm = this.formBuilder.group({
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
      predeterminado: [{ value: false, disabled: true }],
    });
    this.contactoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      predeterminado: [{ value: false, disabled: true }]
    });
  }

  async ngOnInit(): Promise<void> {
    this.utilsService.blockUIStart('Obteniendo información de maestros...');
    this.monedas = await this.onListarMaestros(1, 0);
    this.utilsService.blockUIStop();

    this.onListarClientes();
  }

  async onListarMaestros(idTabla: number, idColumna: number): Promise<TablaMaestra[]> {
    return await this.tablaMaestraService.listar({
      idTabla: idTabla,
      idColumna: idColumna
    }).then((response: TablaMaestra[]) => response, error => [])
      .catch(error => []);
  }

  onListarClientes(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.clientesService.listar({
      idTipo: 1
    }).subscribe((response: ClientePagador[]) => {
      this.clientes = response;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onNuevo(modal: any): void {
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        size: 'lg',
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
    this.clienteForm.controls.idClientePagador.setValue(item.idClientePagador);
    this.clienteForm.controls.ruc.setValue(item.ruc);
    this.clienteForm.controls.razonSocial.setValue(item.razonSocial);
    this.clienteForm.controls.direccionPrincipal.setValue(item.direccionPrincipal);
    this.clienteForm.controls.direccionFacturacion.setValue(item.direccionFacturacion);
    this.clienteForm.controls.tasaNominalMensual.setValue(item.tasaNominalMensual);
    this.clienteForm.controls.tasaNominalAnual.setValue(item.tasaNominalAnual);
    this.clienteForm.controls.financiamiento.setValue(item.financiamiento);
    this.clienteForm.controls.comisionEstructuracion.setValue(item.comisionEstructuracion);
    this.clienteForm.controls.factoring.setValue(item.factoring);
    this.clienteForm.controls.confirming.setValue(item.confirming);
    this.clienteForm.controls.capitalTrabajo.setValue(item.capitalTrabajo);
    this.clienteForm.controls.idMoneda.setValue(item.idMoneda);
    this.clienteForm.controls.gastosContrato.setValue(item.gastosContrato);
    this.clienteForm.controls.comisionCartaNotarial.setValue(item.comisionCartaNotarial);
    this.clienteForm.controls.servicioCobranza.setValue(item.servicioCobranza);
    this.clienteForm.controls.servicioCustodia.setValue(item.servicioCustodia);

    this.clientesService.obtener({
      idClientePagador: item.idClientePagador
    }).subscribe((response: any) => {
      this.contactos = response.clientePagadorContacto;
      this.cuentas = response.clientePagadorCuenta;
      this.utilsService.blockUIStop();

      setTimeout(() => {
        this.modalService.open(modal, {
          scrollable: true,
          size: 'lg',
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
    if (this.clienteForm.invalid)
      return;

    this.utilsService.showNotification("Ok", "", 1);
  }

  onCancelar(): void {
    this.submitted = false;
    this.contactos = [];
    this.cuentas = [];
    this.clienteForm.reset();
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
