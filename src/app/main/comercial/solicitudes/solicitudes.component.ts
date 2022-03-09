import {Component, OnInit} from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SolicitudesService} from "./solicitudes.service";
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {SolicitudDet} from "../../../shared/models/comercial/SolicitudDet";
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {environment} from '../../../../environments/environment';
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

  hasBaseDropZoneOver: boolean;
  public contentHeader: object;
  public solicitudes: SolicitudCab[];
  public submitted: boolean;
  public solicitudForm: FormGroup;
  public solicitudDetForm: FormGroup;
  public cambiarIcono: boolean = false;

  optClienteP = [];
  tipoServicio = "Factoring";
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
  idTipoOperacion: number = 1;
  public search: string = '';
  public searchCli: string = '';

  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;
  public collectionSizeCli: number = 0;
  public pageSizeCli: number = 8;
  public pageCli: number = 1;
  public razonSocial: string = '';
  public ruc: string = '';
  public selectedRowIds: number[] = [];

  get ReactiveIUForm(): any {
    return this.solicitudForm.controls;
  }

  get ReactiveDetForm(): any {
    return this.solicitudDetForm.controls;
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
      ruc: [''],
      razonSocial: ['']
    });
    this.solicitudDetForm = this.formBuilder.group({
      nroSolicitud: [''],
      cedente: [''],
      rucCedente: [''],
      aceptante: [''],
      rucAceptante: [''],
    });
  }

  ngOnInit(): void {
    this.onRefrescar();
    this.hasBaseDropZoneOver = false;
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    if (e == false) {
      this.onBrowseChange();
    }
  }

  onListarSolicitudes(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesService.listar({
      idConsulta: 1,
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: SolicitudCab[]) => {
      this.solicitudes = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onNuevo(modal): void {
    this.uploader.clearQueue();
    this.idSolicitudCab = 0;
    this.uploader.setOptions({
      url: `${environment.apiUrl}${SOLICITUD.upload}?idSolicitudCab=` + this.idSolicitudCab + `&idTipoOperacion=` + this.idTipoOperacion + `&ruc=` + this.ruc
    });

    // this.uploader.setOptions({
    //   url: `${environment.apiUrl}${SOLICITUD.upload}`
    // });

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

  uploadFile(event) {
    var formData = new FormData();
    formData.append("file", <File>event.target.files[0]);
    event.target.files[0].name.toString()

    this.solicitudesService.upload({
      file: formData,
      idSolicitudCab: this.idSolicitudCab,
      idTipoOperacion: this.idTipoOperacion,
      ruc: this.ruc
    })
      .subscribe((response) => {
        },
        (error) => {
        })
  }

  onGuardar(): void {
    this.submitted = true;
    if (this.solicitudForm.invalid) {
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

  onRefrescar(): void {
    this.onListarSolicitudes();
  }

  onImportar(modal): void {
    this.uploader.clearQueue();

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
    var flagEliminado = false;
    for (const item of this.uploader.queue) {
      var name = item._file.name;
      if (name.includes('.XML') || name.includes('.PDF') || name.includes('.xml') || name.includes('.pdf')) {

      } else {
        flagEliminado = true;
        item.remove();
      }
    }
    if (flagEliminado == true) {
      this.utilsService.showNotification('Se han eliminado los archivo que no continen una extensión .xml o .pdf', 'Validación', 2);
    }
  }

  onRadioChange(value, idTipoOperacion): void {
    this.tipoServicio = value;
    this.idTipoOperacion = idTipoOperacion;
    this.uploader.setOptions({
      url: `${environment.apiUrl}${SOLICITUD.upload}?idSolicitudCab=` + this.idSolicitudCab + `&idTipoOperacion=` + this.idTipoOperacion + `&ruc=` + this.ruc
    });

  }

  onClientePagadorList(modal, value): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesService.listarCliente({
      idTipo: this.idTipoOperacion,
      search: this.searchCli,
      pageIndex: this.pageCli,
      pageSize: this.pageSizeCli
    }).subscribe(response => {
      this.optClienteP = response;

      this.collectionSizeCli = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    if (value == 1) {
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
  }

  onDetalle(item, modal): void {

    this.solicitudDet = item.solicitudDet;
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudDetForm.controls.nroSolicitud.setValue(item.codigo);
    this.solicitudDetForm.controls.cedente.setValue(item.razonSocialCedente);
    this.solicitudDetForm.controls.rucCedente.setValue(item.rucCedente);
    this.solicitudDetForm.controls.aceptante.setValue(item.razonSocialAceptante);
    this.solicitudDetForm.controls.rucAceptante.setValue(item.rucAceptante);
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        size: 'lg',
        windowClass: 'my-class',
        animation: true,
        centered: false,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
    this.utilsService.blockUIStop();
  }

  onCambiarVisibilidadDetalleTodo() {
    this.cambiarIcono = !this.cambiarIcono;
    this.solicitudes.forEach(el => {
      el.cambiarIcono = this.cambiarIcono;
      document.getElementById('tr' + el.idSolicitudCab).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
      document.getElementById('detail' + el.idSolicitudCab).style.display = (el.cambiarIcono) ? "block" : "none";
    })
  }

  onCambiarVisibilidadDetalle(item: any) {
    item.cambiarIcono = !item.cambiarIcono;
    document.getElementById('tr' + item.idSolicitudCab).style.visibility = (item.cambiarIcono) ? "visible" : "collapse";
    document.getElementById('detail' + item.idSolicitudCab).style.display = (item.cambiarIcono) ? "block" : "none";
  }

  rowIsSelected(idfila) {
    return this.selectedRowIds.includes(idfila);
  }

  onRowClick(razon, ruc, idfila) {

    this.selectedRowIds = [];
    this.selectedRowIds.push(idfila);
    this.razonSocial = razon;
    this.ruc = ruc;
  }
}
