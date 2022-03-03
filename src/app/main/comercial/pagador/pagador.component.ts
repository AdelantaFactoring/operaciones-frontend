import { Component, OnInit } from '@angular/core';
import {ClientePagador} from "../../../shared/models/comercial/cliente-pagador";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilsService} from "../../../shared/services/utils.service";
import {ClientesService} from "../clientes/clientes.service";

@Component({
  selector: 'app-pagador',
  templateUrl: './pagador.component.html',
  styleUrls: ['./pagador.component.scss']
})
export class PagadorComponent implements OnInit {
  public contentHeader: object;
  public pagadores: ClientePagador[];
  public submitted: boolean;
  public pagadorForm: FormGroup;

  get ReactiveIUForm(): any {
    return this.pagadorForm.controls;
  }

  constructor(private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private utilsService: UtilsService,
              private clientesService: ClientesService) {
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
      idClienteProveedor: [0],
      ruc: ['', Validators.required],
      razonSocial: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.onListarPagador();
  }

  onListarPagador(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.clientesService.listar({
      idTipo: 2
    }).subscribe((response: ClientePagador[]) => {
      this.pagadores = response;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onNuevo(modal): void {
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        size: 'lg',
        animation: true,
        centered: true,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onGuardar(): void {
    this.submitted = true;
    if (this.pagadorForm.invalid)
      return;
  }

  onCancelar(): void {
    this.submitted = false;
    this.modalService.dismissAll();
  }
}
