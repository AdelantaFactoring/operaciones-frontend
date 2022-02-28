import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {ClientesService} from "./clientes.service";
import {ClientePagador} from "../../../shared/models/comercial/cliente-pagador";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  public contentHeader: object;
  public clientes: ClientePagador[];
  public submitted: boolean;
  public clienteForm: FormGroup;

  get ReactiveIUForm(): any {
    return this.clienteForm.controls;
  }

  constructor(private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private utilsService: UtilsService,
              private clientesService: ClientesService) {
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
  }

  ngOnInit(): void {
    this.onListarClientes();
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

  onNuevo(modal): void {
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

  onGuardar(): void {
    this.submitted = true;
    if (this.clienteForm.invalid)
      return;
  }

  onCancelar(): void {
    this.submitted = false;
    this.modalService.dismissAll();
  }
}
