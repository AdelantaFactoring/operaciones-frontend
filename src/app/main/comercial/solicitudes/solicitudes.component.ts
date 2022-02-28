import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SolicitudesService} from "./solicitudes.service";
import {Solicitud} from "../../../shared/models/comercial/Solicitud";
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    //url: `${environment.serviceUrl}${STOCKMINIMO.import}?nombreLinea=` + this.itemLinea,
    isHTML5: true
  });
  public contentHeader: object;
  public solicitudes: Solicitud[];
  public submitted: boolean;
  public solicitudForm: FormGroup;
  
  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private solicitudesService: SolicitudesService) {
    this.contentHeader = {
      headerTitle: 'Solicitudes',
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
            name: 'Solicitudes',
            isLink: false
          }
        ]
      }
    };
  }

  ngOnInit(): void {
    //this. onListarClientes();
  }

  onListarClientes(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesService.listar({
      idTipo: 1
    }).subscribe((response: Solicitud[]) => {
      this.solicitudes = response;
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
    if (this.solicitudForm.invalid)
      return;
  }

  onCancelar(): void {
    this.submitted = false;
    this.modalService.dismissAll();
  }

  onImportar(modal): void {
    this.uploader.clearQueue();
    //this.itemLinea = this.lineasPrograma.filter(x => x.idfila === this.idLineaPrograma)[0].descripcion.toString();

    // this.uploader.setOptions({
    //   url: `${environment.serviceUrl}${STOCKMINIMO.import}?nombreLinea=` + this.itemLinea
    // });

    // this.uploader.setOptions({
    //   url: `${environment.serviceUrl}${STOCKMINIMO.import}`
    // });


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

  onBrowseChange() {
    if (this.uploader.queue.length > 1) {
      //this.uploader.clearQueue();
      this.uploader.queue.splice(0, 1);
    }
  }

  onRadioChange(value): void{
    
  }
}
