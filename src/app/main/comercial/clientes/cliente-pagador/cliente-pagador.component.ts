import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientePagador} from "../../../../shared/models/comercial/cliente-pagador";
import {UtilsService} from "../../../../shared/services/utils.service";
import {TablaMaestra} from "../../../../shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "../../../../shared/services/tabla-maestra.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Cliente} from "../../../../shared/models/comercial/cliente";
import {ClientePagadorService} from "./cliente-pagador.service";
import {ClientesService} from "../clientes.service";
import {PagadorService} from "../../pagador/pagador.service";
import {Pagador} from "../../../../shared/models/comercial/Pagador";
import Swal from "sweetalert2";

@Component({
  selector: 'app-cliente-pagador',
  templateUrl: './cliente-pagador.component.html',
  styleUrls: ['./cliente-pagador.component.scss']
})
export class ClientePagadorComponent implements OnInit {
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
  public clientePagador: ClientePagador[] = [];
  public idFilaEdicionClientePagador: number;
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
  }

  async ngOnInit(): Promise<void> {
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

  onBuscarCliente(idFila: number, modal: any): void {
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
    this.idClienteSeleccionado = item.idCliente;

    if (this.idFilaEdicionClientePagador == 0) {
      this.ReactiveIUFormClientePagador.clienteCustom.setValue(`(${item.ruc}) ${item.razonSocial}`);
    } else {
      for (const row of this.clientePagador) {
        if (row.idFila == 1) {
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

  onBuscarPagador(idFila: number, modal: any): void {
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
    this.idPagadorSeleccionado = item.idPagador;

    if (this.idFilaEdicionClientePagador == 0) {
      this.ReactiveIUFormClientePagador.pagadorCustom.setValue(`(${item.ruc}) ${item.razonSocial}`);
    } else {
      for (const row of this.clientePagador) {
        if (row.idFila == 1) {
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
  onListarClientePagador(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.clientePagadorService.listar({
      search: this.searchClientePagador,
      pageIndex: this.pageClientePagador,
      pageSize: this.pageSizeClientePagador
    }).subscribe((response: ClientePagador[]) => {
      this.clientePagador = response;
      this.collectionSizeClientePagador = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
    });
  }

  onRefrescarClientePagador(): void {
    this.onListarClientePagador();
  }

  onAgregarClientePagador(): void {
    this.submittedClientePagador = true;
    if (this.clientePagadorForm.invalid)
      return;

    this.utilsService.blockUIStart('Guardando...');

    this.idFilaEdicionClientePagador = 0;

    // @ts-ignore
    let clientePagadorList: ClientePagador[] = [...this.clientePagador];
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
      idUsuarioAud: 1
    }).subscribe(response => {
      if (response.tipo === 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);

        this.clientePagadorForm.reset();
        this.submittedClientePagador = false;

        this.onListarClientePagador();

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

  onEditarClientePagador(item: ClientePagador): void {
    if (this.clientePagador.filter(a => a.edicion).length > 0) {
      this.utilsService.showNotification("Primero debe finalizar la edición del registro actual", 'Alerta', 2);
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
      idUsuarioAud: 1
    }).subscribe(response => {
      if (response.tipo === 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);

        item.edicion = false;

        this.clientePagadorForm.reset();
        this.submittedClientePagador = false;

        this.onListarClientePagador();

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

  onEliminarClientePagador(item: ClientePagador): void {
    if (item.idClientePagador == 0) {
      item.estado = false;
      this.clientePagador = this.clientePagador.filter(f => f.idFila != item.idFila);
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
            idUsuarioAud: 1
          }).subscribe(response => {
            if (response.tipo === 1) {
              this.clientePagador = this.clientePagador.filter(f => f.idFila != item.idFila);
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

  //#endregion
}
