import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SolicitudesService} from "./solicitudes.service";
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {SolicitudDet} from "../../../shared/models/comercial/SolicitudDet";
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import {SOLICITUD} from "../../../shared/helpers/url/comercial";

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: `${environment.apiUrl}${SOLICITUD.upload}`,
    isHTML5: true
  });
  public contentHeader: object;
  public solicitudes: SolicitudCab[];
  public submitted: boolean;
  public solicitudForm: FormGroup;
  optClienteP = [];
  tipoServicio = "";
  solicitudDet: SolicitudDet[] = [];
  params = [];
  idSolicitudCab: number;
  idCedente: number;
  idAceptante: number;
  moneda: string;
  comisionEst: number;
  gastoContrato: number;
  comisionCart: number;
  servicioCobranza: number;
  servicioCustodia: number;
  idTipoOperacion: number;


  get ReactiveIUForm(): any {
    return this.solicitudForm.controls;
  }
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
    this.solicitudForm = this.formBuilder.group({
      idSolicitudCab: [0],
      idCedente: [1],
      idAceptante: [1],
      comisionEstructuracion: [0.00],
      gastosContrato: [0],
      comisionCartaNotarial: [0],
      servicioCobranza: [0],
      servicioCustodia: [0],
      factoring: [false],
      confirming: [false],
      capitalTrabajo: [false],
    });
  }

  ngOnInit(): void {
    this. onListarClientes();
    this.onClientePagadorCombo();
  }

  onListarClientes(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesService.listar().subscribe((response: SolicitudCab[]) => {
      this.solicitudes = response;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onNuevo(modal): void {
    this.uploader.clearQueue();
    this.idSolicitudCab = 0;

    // this.uploader.setOptions({
    //   url: `${environment.serviceUrl}${STOCKMINIMO.import}?nombreLinea=` + this.itemLinea
    // });

    this.uploader.setOptions({
      url: `${environment.apiUrl}${SOLICITUD.upload}`
    });

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
    {
      return;
    }  
    this.params = [];
    this.utilsService.blockUIStart('Guardando información...');
    this.solicitudesService.guardar({
      "idSolicitudCab": this.idSolicitudCab,
      "idCedente": this.idCedente,
      "idAceptante": this.idAceptante,
      "moneda": "Soles",
      "comisionEstructuracion": this.comisionEst,
      "gastosContrato": this.gastoContrato,
      "comisionCartaNotarial": this.comisionCart,
      "servicioCobranza": this.servicioCobranza,
      "servicioCustodia": this.servicioCustodia,
      "idTipoOperacion": this.idTipoOperacion,
      "idEstado": 1,
      "usuarioAud": "Admin",
      "solicitudDet": [
        {
          "idSolicitudDet": 0,
          "nroDocumento": "Pru_001",
          "tasaNominalMensual": 0,
          "tasaNominalAnual": 0,
          "financiamiento": 0,
          "fechaConfirmado": "03-03-2022",
          "netoConfirmado": 0,
          "montoSinIGV": 0,
          "montoConIGV": 0,
          "fondoResguardo": 0,
          "archivoXML": "ArchivoXML",
          "archivoPDF": "ArchivoPDF"
        }
      ]
    }).subscribe(response => {
      if (response.tipo == 0) {
        this.utilsService.showNotification(response.mensaje, 'Validación', 2);
      }
      console.log('res', response);
      
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
    
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
    // if (this.uploader.queue.length > 1) {
    //   //this.uploader.clearQueue();
    //   this.uploader.queue.splice(0, 1);
    // }
  }

  onRadioChange(value, idTipoOperacion): void{
    this.tipoServicio = value;
    this.idTipoOperacion = idTipoOperacion;
  }

  onClientePagadorCombo(): void{
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesService.comboCliente({
      idTipo: 1
    }).subscribe(response => {
      this.optClienteP = response;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }
}
