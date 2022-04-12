import {Component, OnInit} from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {ClientesService} from "./clientes.service";
import {Cliente} from "../../../shared/models/comercial/cliente";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClienteContacto} from "../../../shared/models/comercial/cliente-contacto";
import {ClienteCuenta} from "../../../shared/models/comercial/cliente-cuenta";
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";
import Swal from "sweetalert2";
import {ClienteGastos} from "../../../shared/models/comercial/cliente-gastos";

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  public contentHeader: object;
  public clientes: Cliente[];
  public submitted: boolean;
  public submittedCuenta: boolean;
  public submittedContacto: boolean;
  public submittedGastos: boolean;
  public clienteForm: FormGroup;
  public oldClienteForm: FormGroup;
  public cuentaForm: FormGroup;
  public contactoForm: FormGroup;
  public gastosForm: FormGroup;
  public contactos: ClienteContacto[] = [];
  public cuentas: ClienteCuenta[] = [];
  public gastos: ClienteGastos[] = [];
  public monedas: TablaMaestra[];
  public oldCuenta: ClienteCuenta;
  public oldContacto: ClienteContacto;

  public search: string = '';
  //Paginación
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

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
              private clienteService: ClientesService,
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
      idCliente: [0],
      ruc: ['', Validators.required],
      razonSocial: ['', Validators.required],
      direccionPrincipal: ['', Validators.required],
      direccionFacturacion: [''],
      factoring: [false],
      confirming: [false],
      capitalTrabajo: [false]
    });
    this.cuentaForm = this.formBuilder.group({
      titular: [''],
      banco: ['', Validators.required],
      idMoneda: [1],
      nroCuenta: ['', Validators.required],
      cci: [''],
      tipoCuenta: [''],
      predeterminado: [false],
    });
    this.contactoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      predeterminado: [false]
    });
    this.oldClienteForm = this.clienteForm.value;
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
    this.clienteService.listar({
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: Cliente[]) => {
      this.clientes = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onRefrescar(): void {
    this.onListarClientes();
  }

  onNuevo(modal: any): void {
    console.log('Id', this.clienteForm.controls.idCliente.value);
    
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

  onEditar(item: Cliente, modal: any): void {
    
    this.utilsService.blockUIStart('Obteniendo información...');
    this.clienteForm.controls.idCliente.setValue(item.idCliente);
    this.clienteForm.controls.ruc.setValue(item.ruc);
    this.clienteForm.controls.razonSocial.setValue(item.razonSocial);
    this.clienteForm.controls.direccionPrincipal.setValue(item.direccionPrincipal);
    this.clienteForm.controls.direccionFacturacion.setValue(item.direccionFacturacion);
    this.clienteForm.controls.factoring.setValue(item.factoring);
    this.clienteForm.controls.confirming.setValue(item.confirming);
    this.clienteForm.controls.capitalTrabajo.setValue(item.capitalTrabajo);

    this.clienteService.obtener({
      idCliente: item.idCliente
    }).subscribe((response: any) => {
      this.contactos = response.clienteContacto;
      this.cuentas = response.clienteCuenta;
      this.gastos = response.clienteGastos;
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

  onEliminar(item: Cliente): void {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Desea eliminar el registro "${item.razonSocial}"?, esta acción no podrá revertirse`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary'
      }
    }).then(result => {
      if (result.value) {
        this.utilsService.blockUIStart('Eliminando...');
        this.clienteService.eliminar({
          idCliente: item.idCliente,
          idUsuarioAud: 1
        }).subscribe(response => {
          if (response.tipo === 1) {
            this.utilsService.showNotification('Registro eliminado correctamente', 'Confirmación', 1);
            this.utilsService.blockUIStop();
            this.onListarClientes();
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

  onGuardar(): void {
    this.submitted = true;
    if (this.clienteForm.invalid)
      return;
    this.utilsService.blockUIStart('Guardando...');
    this.clienteService.guardar({
      idCliente: this.clienteForm.controls.idCliente.value,
      ruc: this.clienteForm.controls.ruc.value,
      razonSocial: this.clienteForm.controls.razonSocial.value,
      direccionPrincipal: this.clienteForm.controls.direccionPrincipal.value,
      direccionFacturacion: this.clienteForm.controls.direccionFacturacion.value,
      factoring: this.clienteForm.controls.factoring.value,
      confirming: this.clienteForm.controls.confirming.value,
      capitalTrabajo: this.clienteForm.controls.capitalTrabajo.value,
      idUsuarioAud: 1,
      contacto: this.contactos.filter(f => f.editado),
      cuenta: this.cuentas.filter(f => f.editado),
      gastos: this.gastos.filter(f => f.editado)
    }).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarClientes();
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
    this.clienteForm.reset(this.oldClienteForm);
    this.modalService.dismissAll();
  }

  onAgregarCuenta(): void {
    this.submittedCuenta = true;
    if (this.cuentaForm.invalid)
      return;

    let predeterminado = this.cuentaForm.controls.predeterminado.value;
    let idMoneda = this.cuentaForm.controls.idMoneda.value;
    if (this.cuentas.filter(f => f.predeterminado && f.idMoneda == idMoneda).length > 0 && predeterminado) {
      this.cuentas.forEach(el => {
        if (el.idMoneda == idMoneda) {
          if (!el.editado) {
            el.editado = el.predeterminado ? true : false;
          }
          el.predeterminado = false;
        }
      });
    }

    this.cuentas.push({
      idClienteCuenta: 0,
      idCliente: 0,
      titular: this.cuentaForm.controls.titular.value,
      banco: this.cuentaForm.controls.banco.value,
      idMoneda: idMoneda,
      moneda: this.monedas.find(f => f.idColumna === this.cuentaForm.controls.idMoneda.value).descripcion,
      codigoMoneda: '',
      nroCuenta: this.cuentaForm.controls.nroCuenta.value,
      cci: this.cuentaForm.controls.cci.value,
      tipoCuenta: '',
      predeterminado: this.cuentaForm.controls.predeterminado.value,
      idFila: this.utilsService.autoIncrement(this.cuentas),
      edicion: false,
      editado: true
    });
    this.cuentaForm.reset();
    this.cuentaForm.controls.idMoneda.setValue(1);
    this.submittedCuenta = false;
  }

  onEditarCuenta(item: ClienteCuenta): void {
    this.oldCuenta = {
      idClienteCuenta: item.idClienteCuenta,
      idCliente: item.idCliente,
      titular: item.titular,
      banco: item.banco,
      idMoneda: item.idMoneda,
      moneda: item.moneda,
      codigoMoneda: item.codigoMoneda,
      nroCuenta: item.nroCuenta,
      cci: item.cci,
      tipoCuenta: '',
      predeterminado: item.predeterminado,
      idFila: item.idFila,
      edicion: item.edicion,
      editado: item.editado
    };
    item.edicion = true;
  }

  onCancelarCuenta(item: ClienteCuenta): void {
    item.idClienteCuenta = this.oldCuenta.idClienteCuenta;
    item.idCliente = this.oldCuenta.idCliente;
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

  onConfirmarCambioCuenta(item: ClienteCuenta): void {
    if (this.cuentas.filter(f => f.predeterminado && f.idMoneda == item.idMoneda && f.idFila != item.idFila).length > 0 && item.predeterminado) {
      this.cuentas.forEach(el => {
        if (el.idMoneda == item.idMoneda && el.idFila != item.idFila) {
          if (!el.editado) {
            el.editado = el.predeterminado ? true : false;
          }
          el.predeterminado = false;
        }
      });
    }

    item.moneda = this.monedas.find(f => f.idColumna === item.idMoneda).descripcion;
    item.edicion = false;
    item.editado = true;
  }

  onEliminarCuenta(item: ClienteCuenta): void {
    if (item.idClienteCuenta == 0) {
      this.cuentas = this.cuentas.filter(f => f.idFila != item.idFila);
    } else {
      Swal.fire({
        title: 'Confirmación',
        text: `¿Desea eliminar el registro?, esta acción no podrá revertirse`,
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
          this.clienteService.eliminarCuenta({
            idClienteCuenta: item.idClienteCuenta,
            idUsuarioAud: 1
          }).subscribe(response => {
            if (response.tipo === 1) {
              this.cuentas = this.cuentas.filter(f => f.idFila != item.idFila);
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
  }

  onAgregarContacto(): void {
    this.submittedContacto = true;
    if (this.contactoForm.invalid)
      return;

    let predeterminado = this.contactoForm.controls.predeterminado.value;

    if (this.contactos.filter(f => f.predeterminado).length > 0 && predeterminado) {
      this.contactos.forEach(el => {
        if (!el.editado) {
          el.editado = el.predeterminado ? true : false;
        }
        el.predeterminado = false;
      });
    }

    this.contactos.push({
      idClienteContacto: 0,
      idCliente: 0,
      nombre: this.contactoForm.controls.nombre.value,
      apellidoPaterno: this.contactoForm.controls.apellidoPaterno.value,
      apellidoMaterno: this.contactoForm.controls.apellidoMaterno.value,
      telefono: this.contactoForm.controls.telefono.value,
      correo: this.contactoForm.controls.correo.value,
      predeterminado: predeterminado,
      idFila: this.utilsService.autoIncrement(this.contactos),
      edicion: false,
      editado: true
    });
    this.contactoForm.reset();
    this.submittedContacto = false;
  }

  onEditarContacto(item: ClienteContacto): void {
    this.oldContacto = {
      idClienteContacto: item.idClienteContacto,
      idCliente: item.idCliente,
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

  onCancelarContacto(item: ClienteContacto): void {
    item.idClienteContacto = this.oldContacto.idClienteContacto;
    item.idCliente = this.oldContacto.idCliente;
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

  onConfirmarCambioContacto(item: ClienteContacto): void {
    if (this.contactos.filter(f => f.predeterminado && f.idFila != item.idFila).length > 0 && item.predeterminado) {
      this.contactos.forEach(el => {
        if (el.idFila != item.idFila) {
          if (!el.editado) {
            el.editado = el.predeterminado ? true : false;
          }
          el.predeterminado = false;
        }
      });
    }

    item.edicion = false;
    item.editado = true;
  }

  onEliminarContacto(item: ClienteContacto): void {
    if (item.idClienteContacto == 0) {
      this.contactos = this.contactos.filter(f => f.idFila != item.idFila);
    } else {
      Swal.fire({
        title: 'Confirmación',
        text: `¿Desea eliminar el registro?, esta acción no podrá revertirse`,
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
          this.clienteService.eliminarContacto({
            idClienteContacto: item.idClienteContacto,
            idUsuarioAud: 1
          }).subscribe(response => {
            if (response.tipo === 1) {
              this.contactos = this.contactos.filter(f => f.idFila != item.idFila);
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
  }
}
