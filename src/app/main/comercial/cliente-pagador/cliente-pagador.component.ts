import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientePagador} from "app/shared/models/comercial/cliente-pagador";
import {UtilsService} from "app/shared/services/utils.service";
import {TablaMaestra} from "app/shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "app/shared/services/tabla-maestra.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Cliente} from "app/shared/models/comercial/cliente";
import {ClientePagadorService} from "./cliente-pagador.service";
import {ClientesService} from "./../clientes/clientes.service";
import {PagadorService} from "./../pagador/pagador.service";
import {Pagador} from "app/shared/models/comercial/Pagador";
import Swal from "sweetalert2";
import {ClientePagadorGastos} from "app/shared/models/comercial/cliente-pagador-gastos";
import { User } from 'app/shared/models/auth/user';

@Component({
  selector: 'app-cliente-pagador',
  templateUrl: './cliente-pagador.component.html',
  styleUrls: ['./cliente-pagador.component.scss']
})
export class ClientePagadorComponent implements OnInit {
  public currentUser: User;
  public contentHeader: object;

  public monedas: TablaMaestra[];

  //#region Cliente
  public clientes: Cliente[];
  public searchCliente: string = '';
  public collectionSizeCliente: number = 0;
  public pageSizeCliente: number = 10;
  public pageCliente: number = 1;

  public idClienteSeleccionado: number;
  //#endregion

  //#region Pagador
  public pagadores: Pagador[];
  public searchPagador: string = '';
  public collectionSizePagador: number = 0;
  public pageSizePagador: number = 10;
  public pagePagador: number = 1;

  public idPagadorSeleccionado: number;
  //#endregion

  //#region Cliente-Pagador
  public idClientePagadorSeleccionado: number = 0;
  public clientePagador: ClientePagador[] = [];
  public idFilaEdicionClientePagador: number = 0;
  public oldClientePagador: ClientePagador;

  public searchClientePagador: string = '';
  public collectionSizeClientePagador: number = 0;
  public pageSizeClientePagador: number = 10;
  public pageClientePagador: number = 1;

  public clientePagadorForm: FormGroup;
  public submittedClientePagador: boolean;

  get ReactiveIUFormClientePagador(): any {
    return this.clientePagadorForm.controls;
  }

  //#endregion

  //#region Cliente-Pagador-Gastos
  public clientePagadorGastos: ClientePagadorGastos[] = [];
  public idFilaEdicionClientePagadorGastos: number = 0;
  public oldClientePagadorGastos: ClientePagadorGastos;

  public searchClientePagadorGastos: string = '';
  public collectionSizeClientePagadorGastos: number = 0;
  public pageSizeClientePagadorGastos: number = 9999;
  public pageClientePagadorGastos: number = 1;

  public clientePagadorGastosForm: FormGroup;
  public oldClientePagadorGastosForm: FormGroup;
  public submittedClientePagadorGastos: boolean;

  get ReactiveIUFormClientePagadorGastos(): any {
    return this.clientePagadorGastosForm.controls;
  }

  //#endregion

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private tablaMaestraService: TablaMaestraService,
    private clientesService: ClientesService,
    private pagadorService: PagadorService,
    private clientePagadorService: ClientePagadorService
  ) {
    this.contentHeader = {
      headerTitle: 'Cliente-Pagador',
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
            name: 'Cliente-Pagador',
            isLink: false
          }
        ]
      }
    };

    this.clientePagadorForm = this.formBuilder.group({
      clienteCustom: ['', Validators.required],
      pagadorCustom: ['', Validators.required]
    });

    this.clientePagadorGastosForm = this.formBuilder.group({
      idMoneda: [1],
      tasaNominalMensual: [0, [Validators.required, Validators.min(0.01)]],
      tasaNominalAnual: [0, [Validators.required, Validators.min(0.01)]],
      tasaNominalMensualMora: [0, [Validators.required, Validators.min(0.01)]],
      tasaNominalAnualMora: [0, [Validators.required, Validators.min(0.01)]],
      financiamiento: [0],
      comisionEstructuracion: [0],
      gastosContrato: [0],
      comisionCartaNotarial: [0],
      servicioCobranza: [0],
      servicioCustodia: [0],
      limiteGastoNegociacion: [0]
    });

    this.oldClientePagadorGastosForm = this.clientePagadorGastosForm.value;
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.utilsService.blockUIStart('Obteniendo información de maestros...');
    this.monedas = await this.onListarMaestros(1, 0);
    this.utilsService.blockUIStop();

    this.onListarClientePagador();
  }

  async onListarMaestros(idTabla: number, idColumna: number): Promise<TablaMaestra[]> {
    return await this.tablaMaestraService.listar({
      idTabla: idTabla,
      idColumna: idColumna
    }).then((response: TablaMaestra[]) => response, error => [])
      .catch(error => []);
  }

  //#region Cliente
  onListarCliente(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.clientesService.listar({
      search: this.searchCliente,
      pageIndex: this.pageCliente,
      pageSize: this.pageSizeCliente
    }).subscribe((response: Cliente[]) => {
      this.clientes = response;
      this.collectionSizeCliente = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
    });
  }

  onRefrescarCliente(): void {
    this.onListarCliente();
  }

  onBuscarCliente(flagNuevo: boolean, modal: any): void {
    if (this.clientePagador.filter(a => a.edicion).length > 0 && flagNuevo) {
      this.utilsService.showNotification("Primero debe finalizar la edición del registro actual", 'Alerta', 2);
      return;
    }

    this.onListarCliente();

    this.searchCliente = '';
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        backdrop: 'static',
        size: 'lg',

        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onClienteSeleccionado(item: Cliente, modal: any): void {
    if (this.idFilaEdicionClientePagador == 0) {
      this.idClienteSeleccionado = item.idCliente;
      this.ReactiveIUFormClientePagador.clienteCustom.setValue(`(${item.ruc}) ${item.razonSocial}`);
    } else {
      for (const row of this.clientePagador) {
        if (row.idFila == this.idFilaEdicionClientePagador) {
          row.idCliente = item.idCliente;
          row.clienteCustom = `(${item.ruc}) ${item.razonSocial}`;
          break;
        }
      }
    }

    modal.dismiss();
  }

  //#endregion

  //#region Pagador
  onListarPagador(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.pagadorService.listar({
      search: this.searchCliente,
      pageIndex: this.pageCliente,
      pageSize: this.pageSizeCliente
    }).subscribe((response: Pagador[]) => {
      this.pagadores = response;
      this.collectionSizePagador = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
    });
  }

  onRefrescarPagador(): void {
    this.onListarPagador();
  }

  onBuscarPagador(flagNuevo: boolean, modal: any): void {
    if (this.clientePagador.filter(a => a.edicion).length > 0 && flagNuevo) {
      this.utilsService.showNotification("Primero debe finalizar la edición del registro actual", 'Alerta', 2);
      return;
    }

    this.onListarPagador();

    this.searchPagador = '';
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        backdrop: 'static',
        size: 'lg',

        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onPagadorSeleccionado(item: Pagador, modal: any): void {
    if (this.idFilaEdicionClientePagador == 0) {
      this.idPagadorSeleccionado = item.idPagador;
      this.ReactiveIUFormClientePagador.pagadorCustom.setValue(`(${item.ruc}) ${item.razonSocial}`);
    } else {
      for (const row of this.clientePagador) {
        if (row.idFila == this.idFilaEdicionClientePagador) {
          row.idPagador = item.idPagador;
          row.pagadorCustom = `(${item.ruc}) ${item.razonSocial}`;
          break;
        }
      }
    }

    modal.dismiss();
  }

  //#endregion

  //#region Cliente-Pagador
  onListarClientePagador(flagRefreshSubtable: boolean = true): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.clientePagadorService.listar({
      search: this.searchClientePagador,
      pageIndex: this.pageClientePagador,
      pageSize: this.pageSizeClientePagador
    }).subscribe((response: ClientePagador[]) => {
      this.clientePagador = response;
      this.collectionSizeClientePagador = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();

      if (flagRefreshSubtable) {
        this.onListarClientePagadorGastos();
      }

    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('[F]: An internal error has occurred (asignaciones)', 'Error', 3);
    });
  }

  onRefrescarClientePagador(): void {
    this.idClientePagadorSeleccionado = 0;
    this.idFilaEdicionClientePagador = 0;
    this.onListarClientePagador();
  }

  onAgregarClientePagador(): void {
    if (this.clientePagador.filter(a => a.edicion).length > 0) {
      this.utilsService.showNotification("Primero debe finalizar la edición del registro actual (asignaciones)", 'Alerta', 2);
      return;
    }

    this.submittedClientePagador = true;
    if (this.clientePagadorForm.invalid)
      return;

    this.utilsService.blockUIStart('Guardando...');

    // @ts-ignore
    let clientePagadorList: ClientePagador[] = [];
    clientePagadorList.push({
      idClientePagador: 0,
      idCliente: this.idClienteSeleccionado,
      clienteCustom: this.clientePagadorForm.controls.clienteCustom.value,
      idPagador: this.idPagadorSeleccionado,
      pagadorCustom: this.clientePagadorForm.controls.pagadorCustom.value,
      estado: true,
      totalRows: 0,

      idFila: this.utilsService.autoIncrement(this.clientePagador),
      edicion: false,
      editado: true
    });

    this.clientePagadorService.guardar({
      clientePagadorList: clientePagadorList,
      idUsuarioAud: this.currentUser.idUsuario
    }).subscribe(response => {
      if (response.tipo === 1) {
        this.utilsService.showNotification('Información guardada correctamente (asignaciones)', 'Confirmación', 1);

        this.clientePagadorForm.reset();
        this.submittedClientePagador = false;

        this.onListarClientePagador();

        this.utilsService.blockUIStop();
      } else if (response.tipo === 2) {
        this.utilsService.showNotification(response.mensaje + ' (asignaciones)', 'Alerta', 2);
      } else {
        this.utilsService.showNotification(response.mensaje + ' (asignaciones)', 'Error', 3);
      }

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred (asignaciones)', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onEditarClientePagador(item: ClientePagador): void {
    if (this.clientePagador.filter(a => a.edicion).length > 0) {
      this.utilsService.showNotification("Primero debe finalizar la edición del registro actual (asignaciones)", 'Alerta', 2);
      return;
    }

    this.idFilaEdicionClientePagador = item.idFila;

    this.oldClientePagador = {...item};

    item.edicion = true;
  }

  onCancelarClientePagador(item: ClientePagador): void {
    item.idCliente = this.oldClientePagador.idCliente;
    item.clienteCustom = this.oldClientePagador.clienteCustom;
    item.idPagador = this.oldClientePagador.idPagador;
    item.pagadorCustom = this.oldClientePagador.pagadorCustom;

    item.edicion = false;
    item.editado = false;
  }

  onConfirmarCambioClientePagador(item: ClientePagador): void {
    this.utilsService.blockUIStart('Guardando...');

    let clientePagadorList: ClientePagador[] = [];
    clientePagadorList.push(item);

    this.clientePagadorService.guardar({
      clientePagadorList: clientePagadorList,
      idUsuarioAud: this.currentUser.idUsuario
    }).subscribe(response => {
      if (response.tipo === 1) {
        this.utilsService.showNotification('Información guardada correctamente (asignaciones)', 'Confirmación', 1);

        item.edicion = false;

        this.clientePagadorForm.reset();
        this.submittedClientePagador = false;

        this.onListarClientePagador();

        this.idFilaEdicionClientePagador = 0;

        this.utilsService.blockUIStop();
      } else if (response.tipo === 2) {
        this.utilsService.showNotification(response.mensaje + ' (asignaciones)', 'Alerta', 2);
      } else {
        this.utilsService.showNotification(response.mensaje + ' (asignaciones)', 'Error', 3);
      }

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred (asignaciones)', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onEliminarClientePagador(item: ClientePagador): void {
    if (item.idClientePagador == 0) {
      item.estado = false;
      this.clientePagador = this.clientePagador.filter(f => f.idFila != item.idFila);
    } else {
      Swal.fire({
        title: 'Confirmación (asignaciones)',
        text: `¿Desea eliminar el registro?, esta acción no podrá revertirse`,
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
          item.estado = false;

          let clientePagadorList: ClientePagador[] = [];
          clientePagadorList.push(item);

          this.clientePagadorService.guardar({
            clientePagadorList: clientePagadorList,
            idUsuarioAud: this.currentUser.idUsuario
          }).subscribe(response => {
            if (response.tipo === 1) {
              this.clientePagador = this.clientePagador.filter(f => f.idFila != item.idFila);

              this.idClientePagadorSeleccionado = 0;
              this.clientePagadorGastosForm.reset(this.oldClientePagadorGastosForm);
              this.clientePagadorGastos = [];

              this.utilsService.showNotification('Registro eliminado correctamente (asignaciones)', 'Confirmación', 1);
              this.utilsService.blockUIStop();
            } else if (response.tipo === 2) {
              this.utilsService.showNotification(response.mensaje + ' (asignaciones)', 'Alerta', 2);
            } else {
              this.utilsService.showNotification(response.mensaje + ' (asignaciones)', 'Error', 3);
            }

            this.utilsService.blockUIStop();
          }, error => {
            this.utilsService.showNotification('[F]: An internal error has occurred (asignaciones)', 'Error', 3);
            this.utilsService.blockUIStop();
          });
        }
      });
    }
  }

  onClientePagadorSeleccionado(item: ClientePagador): void {
    if (this.idClientePagadorSeleccionado == item.idClientePagador) return;

    this.idClientePagadorSeleccionado = item.idClientePagador;
    this.clientePagadorGastosForm.reset(this.oldClientePagadorGastosForm);
    this.onListarClientePagadorGastos();
  }

  esFilaSeleccionaClientePagador(idClientePagador: number): boolean {
    return (idClientePagador == this.idClientePagadorSeleccionado);
  }

  //#endregion

  //#region Cliente-Pagador-Gastos
  onListarClientePagadorGastos(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.clientePagadorService.listarGastos({
      idClientePagador: this.idClientePagadorSeleccionado,
      search: this.searchClientePagadorGastos,
      pageIndex: this.pageClientePagadorGastos,
      pageSize: this.pageSizeClientePagadorGastos
    }).subscribe((response: ClientePagadorGastos[]) => {
      this.clientePagadorGastos = response;
      this.collectionSizeClientePagadorGastos = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('[F]: An internal error has occurred (gastos)', 'Error', 3);
    });
  }

  onRefrescarClientePagadorGastos(): void {
    this.onListarClientePagadorGastos();
  }

  onAgregarClientePagadorGastos(): void {
    if (this.idClientePagadorSeleccionado == 0) {
      this.utilsService.showNotification("Primero debe seleccionar un registro (gastos)", 'Alerta', 2);
      return;
    } else if (this.clientePagadorGastos.filter(a => a.edicion).length > 0) {
      this.utilsService.showNotification("Primero debe finalizar la edición del registro actual (gastos)", 'Alerta', 2);
      return;
    }

    this.submittedClientePagadorGastos = true;
    if (this.clientePagadorGastosForm.invalid) return;

    let moneda = this.monedas.find(f => f.idColumna === this.clientePagadorGastosForm.controls.idMoneda.value).descripcion;
    if (this.clientePagadorGastos.filter(f => f.idMoneda === this.clientePagadorGastosForm.controls.idMoneda.value).length > 0) {
      this.utilsService.showNotification(`Ya existen gastos con el tipo de moneda '${moneda}'`, "Alerta", 2);
      return;
    }

    this.utilsService.blockUIStart('Guardando...');

    // @ts-ignore
    let clientePagadorGastosList: ClientePagadorGastos[] = [];
    clientePagadorGastosList.push({
      idClientePagadorGastos: 0,
      idClientePagador: this.idClientePagadorSeleccionado,

      idMoneda: this.clientePagadorGastosForm.controls.idMoneda.value,
      moneda: moneda,
      tasaNominalMensual: this.clientePagadorGastosForm.controls.tasaNominalMensual.value,
      tasaNominalAnual: this.clientePagadorGastosForm.controls.tasaNominalAnual.value,
      tasaNominalMensualMora: this.clientePagadorGastosForm.controls.tasaNominalMensualMora.value,
      tasaNominalAnualMora: this.clientePagadorGastosForm.controls.tasaNominalAnualMora.value,
      financiamiento: this.clientePagadorGastosForm.controls.financiamiento.value,
      comisionEstructuracion: this.clientePagadorGastosForm.controls.comisionEstructuracion.value,
      gastosContrato: this.clientePagadorGastosForm.controls.gastosContrato.value,
      comisionCartaNotarial: this.clientePagadorGastosForm.controls.comisionCartaNotarial.value,
      servicioCobranza: this.clientePagadorGastosForm.controls.servicioCobranza.value,
      servicioCustodia: this.clientePagadorGastosForm.controls.servicioCustodia.value,
      limiteGastoNegociacion: this.clientePagadorGastosForm.controls.servicioCustodia.value,
      estado: true,
      totalRows: 0,
      idUsuarioAud: this.currentUser.idUsuario,

      idFila: this.utilsService.autoIncrement(this.clientePagadorGastos),
      edicion: false,
      editado: true
    });

    this.clientePagadorService.guardarGastos({
      idClientePagador: this.idClientePagadorSeleccionado,
      clientePagadorGastosList: clientePagadorGastosList,
      idUsuarioAud: this.currentUser.idUsuario
    }).subscribe(response => {
      if (response.tipo === 1) {
        this.utilsService.showNotification('Información guardada correctamente (gastos)', 'Confirmación', 1);

        this.clientePagadorGastosForm.reset(this.oldClientePagadorGastosForm);
        this.submittedClientePagadorGastos = false;

        this.onListarClientePagadorGastos();

        this.utilsService.blockUIStop();
      } else if (response.tipo === 2) {
        this.utilsService.showNotification(response.mensaje + ' (gastos)', 'Alerta', 2);
      } else {
        this.utilsService.showNotification(response.mensaje + ' (gastos)', 'Error', 3);
      }

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred (gastos)', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onEditarClientePagadorGastos(item: ClientePagadorGastos): void {
    if (this.clientePagadorGastos.filter(a => a.edicion).length > 0) {
      this.utilsService.showNotification("Primero debe finalizar la edición del registro actual (gastos)", 'Alerta', 2);
      return;
    }

    this.idFilaEdicionClientePagadorGastos = item.idFila;

    this.oldClientePagadorGastos = {...item};

    item.edicion = true;
  }

  onCancelarClientePagadorGastos(item: ClientePagadorGastos): void {
    item.idMoneda = this.oldClientePagadorGastos.idMoneda;
    item.moneda = this.oldClientePagadorGastos.moneda;
    item.tasaNominalMensual = this.oldClientePagadorGastos.tasaNominalMensual;
    item.tasaNominalAnual = this.oldClientePagadorGastos.tasaNominalAnual;
    item.tasaNominalMensualMora = this.oldClientePagadorGastos.tasaNominalMensualMora;
    item.tasaNominalAnualMora = this.oldClientePagadorGastos.tasaNominalAnualMora;
    item.financiamiento = this.oldClientePagadorGastos.financiamiento;
    item.comisionEstructuracion = this.oldClientePagadorGastos.comisionEstructuracion;
    item.gastosContrato = this.oldClientePagadorGastos.gastosContrato;
    item.comisionCartaNotarial = this.oldClientePagadorGastos.comisionCartaNotarial;
    item.servicioCobranza = this.oldClientePagadorGastos.servicioCobranza;
    item.servicioCustodia = this.oldClientePagadorGastos.servicioCustodia;
    item.limiteGastoNegociacion = this.oldClientePagadorGastos.limiteGastoNegociacion;

    item.edicion = false;
    item.editado = false;
  }

  onConfirmarCambioClientePagadorGastos(item: ClientePagadorGastos): void {
    let moneda = this.monedas.find(f => f.idColumna === item.idMoneda).descripcion;
    if (this.clientePagadorGastos.filter(f => f.idMoneda === item.idMoneda && f.idFila != item.idFila).length > 0) {
      this.utilsService.showNotification(`Ya existen gastos con el tipo de moneda '${moneda}'`, "Alerta", 2);
      return;
    }

    this.utilsService.blockUIStart('Guardando...');

    let clientePagadorGastosList: ClientePagadorGastos[] = [];
    clientePagadorGastosList.push(item);

    this.clientePagadorService.guardarGastos({
      idClientePagador: this.idClientePagadorSeleccionado,
      clientePagadorGastosList: clientePagadorGastosList,
      idUsuarioAud: this.currentUser.idUsuario
    }).subscribe(response => {
      if (response.tipo === 1) {
        this.utilsService.showNotification('Información guardada correctamente (gastos)', 'Confirmación', 1);

        item.edicion = false;

        this.clientePagadorGastosForm.reset(this.oldClientePagadorGastosForm);
        this.submittedClientePagadorGastos = false;

        this.onListarClientePagadorGastos();

        this.idFilaEdicionClientePagadorGastos = 0;

        this.utilsService.blockUIStop();
      } else if (response.tipo === 2) {
        this.utilsService.showNotification(response.mensaje + ' (gastos)', 'Alerta', 2);
      } else {
        this.utilsService.showNotification(response.mensaje + ' (gastos)', 'Error', 3);
      }

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred (gastos)', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onEliminarClientePagadorGastos(item: ClientePagadorGastos): void {
    if (item.idClientePagadorGastos == 0) {
      item.estado = false;
      this.clientePagadorGastos = this.clientePagadorGastos.filter(f => f.idFila != item.idFila);
    } else {
      Swal.fire({
        title: 'Confirmación (gastos)',
        text: `¿Desea eliminar el registro?, esta acción no podrá revertirse`,
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
          item.estado = false;

          let clientePagadorGastosList: ClientePagadorGastos[] = [];
          clientePagadorGastosList.push(item);

          this.clientePagadorService.guardarGastos({
            idClientePagador: this.idClientePagadorSeleccionado,
            clientePagadorGastosList: clientePagadorGastosList,
            idUsuarioAud: this.currentUser.idUsuario
          }).subscribe(response => {
            if (response.tipo === 1) {
              this.clientePagadorGastos = this.clientePagadorGastos.filter(f => f.idFila != item.idFila);
              this.utilsService.showNotification('Registro eliminado correctamente (gastos)', 'Confirmación', 1);
              this.utilsService.blockUIStop();
            } else if (response.tipo === 2) {
              this.utilsService.showNotification(response.mensaje + ' (gastos)', 'Alerta', 2);
            } else {
              this.utilsService.showNotification(response.mensaje + ' (gastos)', 'Error', 3);
            }

            this.utilsService.blockUIStop();
          }, error => {
            this.utilsService.showNotification('[F]: An internal error has occurred (gastos)', 'Error', 3);
            this.utilsService.blockUIStop();
          });
        }
      });
    }
  }

  onCambioTNM($event): void {
    this.clientePagadorGastosForm.controls.tasaNominalAnual.setValue(Math.round(((Number($event) * 12) + Number.EPSILON) * 100) / 100);
    this.clientePagadorGastosForm.controls.tasaNominalMensualMora.setValue(Math.round(((Number($event) * 2) + Number.EPSILON) * 100) / 100);
    this.clientePagadorGastosForm.controls.tasaNominalAnualMora.setValue(Math.round(((Number($event) * 2 * 12) + Number.EPSILON) * 100) / 100);
  }

  onCambioTNM_Fila(fila: ClientePagadorGastos): void {
    fila.tasaNominalAnual = Math.round(((fila.tasaNominalMensual * 12) + Number.EPSILON) * 100) / 100;
    fila.tasaNominalMensualMora = Math.round(((fila.tasaNominalMensual * 2) + Number.EPSILON) * 100) / 100;
    fila.tasaNominalAnualMora = Math.round(((fila.tasaNominalMensual * 2 * 12) + Number.EPSILON) * 100) / 100;
  }
  //#endregion
}
