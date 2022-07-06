import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {PagadorService} from "./pagador.service";
import {Pagador} from "../../../shared/models/comercial/pagador";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from 'sweetalert2';
import {User} from "../../../shared/models/auth/user";

@Component({
  selector: 'app-pagador',
  templateUrl: './pagador.component.html',
  styleUrls: ['./pagador.component.scss']
})
export class PagadorComponent implements OnInit {
  public currentUser: User;
  public contentHeader: object;
  public pagador: Pagador[];
  public search: string = '';
  public pagadorForm: FormGroup;
  public submitted: boolean;
  //Paginación
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  get ReactiveIUForm(): any {
    return this.pagadorForm.controls;
  }
  constructor(
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private pagadorService: PagadorService) {
      this.contentHeader = {
        headerTitle: 'Pagadores',
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
              name: 'Pagadores',
              isLink: false
            }
          ]
        }
      };
      this.pagadorForm = this.formBuilder.group({
        idPagador: [0],
        ruc: ['', Validators.required],
        razonSocial: ['', Validators.required],
        grupoEconomico: [''],
        contacto: ['', Validators.required],
        telefono: [''],
        correo: ['', Validators.required],
        sector: [''],
        limiteGastoNegociacion: [0, Validators.required]
      });
     }

  ngOnInit(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.onListarPagador();
  }

  onListarPagador(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.pagadorService.listar({
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: Pagador[]) => {
      this.pagador = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }
  onGuardar(): void {
    this.submitted = true;
    if (this.pagadorForm.invalid)
      return;
    this.utilsService.blockUIStart('Guardando...');
    this.pagadorService.guardar({
      idPagador: this.pagadorForm.controls.idPagador.value,
      ruc: this.pagadorForm.controls.ruc.value,
      razonSocial: this.pagadorForm.controls.razonSocial.value,
      sector: this.pagadorForm.controls.sector.value,
      grupoEconomico: this.pagadorForm.controls.grupoEconomico.value,
      contacto: this.pagadorForm.controls.contacto.value,
      limiteGastoNegociacion: this.pagadorForm.controls.limiteGastoNegociacion.value,
      telefono: this.pagadorForm.controls.telefono.value,
      correo: this.pagadorForm.controls.correo.value,
      idUsuarioAud: this.currentUser.idUsuario,
    }).subscribe(response => {

      if (response.tipo == 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarPagador();
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
  onEliminar(item): void {
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
        this.pagadorService.eliminar({
          idPagador: item.idPagador,
          idUsuarioAud: this.currentUser.idUsuario
        }).subscribe(response => {
          if (response.tipo === 1) {
            this.utilsService.showNotification('Registro eliminado correctamente', 'Confirmación', 1);
            this.utilsService.blockUIStop();
            this.onListarPagador();
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
  onRefrescar(): void {
    this.onListarPagador();
  }

  onEditar(item: Pagador, modal: any): void {

    this.pagadorForm.controls.idPagador.setValue(item.idPagador);
    this.pagadorForm.controls.ruc.setValue(item.ruc);
    this.pagadorForm.controls.razonSocial.setValue(item.razonSocial);
    this.pagadorForm.controls.sector.setValue(item.sector);
    this.pagadorForm.controls.grupoEconomico.setValue(item.grupoEconomico);
    this.pagadorForm.controls.contacto.setValue(item.contacto);
    this.pagadorForm.controls.telefono.setValue(item.telefono);
    this.pagadorForm.controls.correo.setValue(item.correo);
    this.pagadorForm.controls.limiteGastoNegociacion.setValue(item.limiteGastoNegociacion);

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
    this.submitted = false;
    this.pagadorForm.reset();
    this.modalService.dismissAll();
  }
}
