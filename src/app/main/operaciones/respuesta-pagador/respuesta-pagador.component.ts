import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {NgbModal, NgbCalendar} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
//import {SolicitudesService} from "./solicitudes.service";
import {Solicitud} from "../../../shared/models/comercial/Solicitud";

@Component({
  selector: 'app-respuesta-pagador',
  templateUrl: './respuesta-pagador.component.html',
  styleUrls: ['./respuesta-pagador.component.scss']
})
export class RespuestaPagadorComponent implements OnInit {

  public contentHeader: object;
  public solicitudes: Solicitud[];
  public submitted: boolean;
  public solicitudForm: FormGroup;
  filter = {
    dateFrom: {
      year: this.calendar.getToday().month == 1 ? this.calendar.getToday().year - 1 : this.calendar.getToday().year,
      month: this.calendar.getToday().month == 1 ? 12 : this.calendar.getToday().month - 1,
      day: this.calendar.getToday().day
    },
    dateTo: this.calendar.getToday(),
  };

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private calendar: NgbCalendar,
    //private solicitudesService: SolicitudesService
  ) 
  { 
    this.contentHeader = {
      headerTitle: 'Respuesta Pagador',
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
            name: 'Operaciones',
            isLink: false
          },
          {
            name: 'Respuesta Pagador',
            isLink: false
          }
        ]
      }
    };
  }

  ngOnInit(): void {
  }
 
  onListarClientes(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    // this.solicitudesService.listar({
    //   idTipo: 1
    // }).subscribe((response: Solicitud[]) => {
    //   this.solicitudes = response;
    //   this.utilsService.blockUIStop();
    // }, error => {
    //   this.utilsService.blockUIStop();
    //   this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    // });
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
    //this.uploader.clearQueue();
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
    // if (this.uploader.queue.length > 1) {
    //   //this.uploader.clearQueue();
    //   this.uploader.queue.splice(0, 1);
    // }
  }

  onRadioChange(value): void{
    
  }

  onRefresh(): void{
    
  }
}
