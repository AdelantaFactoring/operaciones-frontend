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
    // disableMultipart: true,
    // formatDataFunctionIsAsync: true,
    isHTML5: true
  });

  hasBaseDropZoneOver: boolean;
  public contentHeader: object;
  public solicitudes: SolicitudCab[];
  public submitted: boolean;
  public solicitudForm: FormGroup;
  public solicitudDetForm: FormGroup;
  public cambiarIcono: boolean = false;

  cantXml = 0;
  CantPdf = 0;
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
  public dataXml = [];
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
      ruc: ['', Validators.required],
      razonSocial: ['', Validators.required]
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
    this.razonSocial = '';
    this.ruc = '';

    this.uploader.clearQueue();
    this.idSolicitudCab = 0;

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
    for (const item of this.dataXml) {
      this.params.push({
        "idSolicitudDet": 0,
        "nroDocumento": item.codFactura,
        "fechaConfirmado": item.fechaVencimiento,
        "NetoConfirmado": item.total,
        "MontoSinIGV": item.subTotal,
        "MontoConIGV": item.total,
        "FormaPago": item.formaPago,
        "ArchivoXML": "XML",
        "ArchivoPDF": "PDF"
      });
    }


    this.utilsService.blockUIStart('Guardando información...');
    this.solicitudesService.guardar({
      "idSolicitudCab": this.idSolicitudCab,
      "rucCedente": this.ruc,
      "rucAceptante": this.dataXml[0].rucDet,
      "idTipoOperacion": this.idTipoOperacion,
      "moneda": this.dataXml[0].tipoMoneda,
      "idUsuarioAud": 1,
      "solicitudDet": this.params
    }).subscribe(response => {
      console.log('res', response);

      if (response.tipo == 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarSolicitudes();
        this.onCancelar();
      } else if (response.tipo == 2) {
        this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
        this.utilsService.blockUIStop();
      } else {
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
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

    this.hasBaseDropZoneOver = false;
  }

  onClienteList(modal, value): void {
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
      this.searchCli = '';
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

  onRowClick(razon, ruc, idfila, modal) {

    this.selectedRowIds = [];
    this.selectedRowIds.push(idfila);
    this.razonSocial = razon;
    this.ruc = ruc;
    modal.dismiss('Cross click');
  }

  onsave(): void{
    this.submitted = true;
    if (this.solicitudForm.invalid) {
      return;
    }
    var list = [];
    for (const item of this.uploader.queue) {
      list.push({'name': item?.file?.name});

      if (item?.file?.name.includes('.xml')) {
        this.cantXml =+ 1;
      }

      console.log('cantxml', this.cantXml);

    }

    console.log('cantxml2', this.cantXml);
    if(this.uploader.queue.length / 2 > 0)
    {
      this.utilsService.showNotification('La cantidad de archivos adjuntados debe ser siempre par', 'Alerta', 2);
      return;
    }
    this.uploader.setOptions({
      url: `${environment.apiUrl}${SOLICITUD.upload}?idSolicitudCab=` + this.idSolicitudCab + `&idTipoOperacion=` + this.idTipoOperacion + `&ruc=` + this.ruc + `&idUsuarioAud=1`,
    });

    this.dataXml  = [];
    this.uploader.uploadAll();

    this.uploader.response.subscribe( res => {

      var rs = JSON.parse(res);
      if (rs.tipo != 1) {
        this.dataXml.push(rs)
      }
      else
      {
        if (rs.tipo == 1) {
          this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);

          this.utilsService.blockUIStop();
        } else if (rs.tipo == 2) {
          this.utilsService.showNotification(res.mensaje, 'Alerta', 2);
          this.utilsService.blockUIStop();
        } else {
          this.utilsService.showNotification(res.mensaje, 'Error', 3);
          this.utilsService.blockUIStop();
        }
      }
    });
  }
}
