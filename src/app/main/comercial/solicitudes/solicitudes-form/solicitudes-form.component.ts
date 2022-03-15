import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import Stepper from 'bs-stepper';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilsService} from "../../../../shared/services/utils.service";
import {SolicitudesFormService} from "./solicitudes-form.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {environment} from '../../../../../environments/environment';
import {SOLICITUD} from "../../../../shared/helpers/url/comercial";
import { SolicitudArchivos, SolicitudArchivosXlsx } from 'app/shared/models/comercial/SolicitudArchivos';
import { Cliente } from 'app/shared/models/comercial/cliente';

@Component({
  selector: 'app-solicitudes-form',
  templateUrl: './solicitudes-form.component.html',
  styleUrls: ['./solicitudes-form.component.scss']
})
export class SolicitudesFormComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({
    url: `${environment.apiUrl}${SOLICITUD.upload}`,
    // disableMultipart: true,
    // formatDataFunctionIsAsync: true,
    isHTML5: true
  });
  public uploaderXlsx: FileUploader = new FileUploader({
    url: `${environment.apiUrl}${SOLICITUD.upload}`,
    isHTML5: true
  });
  public contentHeader: object;
  
  public submitted: boolean;
  params = [];

  public solicitudForm: FormGroup;
  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 8;
  public page: number = 1;
  public searchCli: string = '';
  public collectionSizeCli: number = 0;
  public pageSizeCli: number = 8;
  public pageCli: number = 1;
  public optClienteP = [];
  public razonSocial = '';
  public ruc = '';
  public cantXml: number = 0;
  public cantPdf: number = 0;
  public dataXml: SolicitudArchivos[] = [];
  public dataXlsx: SolicitudArchivosXlsx[] = [];
  
  idTipoOperacion: number = 1;
  tipoServicio = "Factoring";
  rucCab: string;
  razonSocialCab: string;
  rucDet: string;
  razonSocialDet: string;
  hasBaseDropZoneOver: boolean;
  procesar: boolean = true;

  public flagConfirming: boolean = false;

  public selectedRowIds: number[] = [];
  public selectBasic = [
    { name: 'UK' },
    { name: 'USA' },
    { name: 'Spain' },
    { name: 'France' },
    { name: 'Italy' },
    { name: 'Australia' }
  ];
  private horizontalWizardStepper: Stepper;
  
  public selectMulti = [{ name: 'English' }, { name: 'French' }, { name: 'Spanish' }];
  public selectMultiSelected;

  horizontalWizardStepperNext(data) {
    if (data.form.valid === true) {
      this.horizontalWizardStepper.next();
    }
    
  }
  /**
   * Horizontal Wizard Stepper Previous
   */
  horizontalWizardStepperPrevious() {
    this.horizontalWizardStepper.previous();
  }

  onSubmit() {
    alert('Submitted!!');
    return false;
  }
  get ReactiveIUForm(): any {
    return this.solicitudForm.controls;
  }
  constructor(
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private solicitudesFormService: SolicitudesFormService,
    private location: Location,) {
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
            name: 'Gestión de Solicitud',
            isLink: false
          }
        ]
      }
    };
   }

  ngOnInit(): void {
    this.onRadioChange(this.tipoServicio, this.idTipoOperacion, this.flagConfirming)
  }

  onRefrescar(): void {
    //this.onListarSolicitudes();
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    if (e == false) {
      this.onBrowseChange();
    }
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
    this.solicitudesFormService.guardar({
      "idSolicitudCab": 0,
      "idCliente": this.ruc,
      "rucPagProv": this.dataXml[0].rucDet,
      "idTipoOperacion": this.idTipoOperacion,
      "moneda": this.dataXml[0].tipoMoneda,
      "IdUsuarioAud": 1,
      "solicitudDet": this.params
    }).subscribe(response => {
      console.log('res', response);
      
      if (response.tipo == 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.location.back();
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
  onBrowseChange() {
    let flagEliminado = false;
    for (const item of this.uploader.queue) {
      let name = item._file.name;
      if (name.includes('.XML') || name.includes('.PDF') || name.includes('.xml') || name.includes('.pdf')) {

      } else {
        flagEliminado = true;
        item.remove();
      }
      
    //this.name = item._file.name;
    }
    if (flagEliminado == true) {
      this.utilsService.showNotification('Se han eliminado los archivo que no continen una extensión .xml o .pdf', 'Validación', 2);
    }
  }

  onRadioChange(value, idTipoOperacion, flagConfirming): void {
    this.tipoServicio = value;
    this.idTipoOperacion = idTipoOperacion;
    this.hasBaseDropZoneOver = false;   
    this.flagConfirming = flagConfirming;
    

    this.horizontalWizardStepper = new Stepper(document.querySelector('#stepper1'), {});

    if (idTipoOperacion == 1) {
      this.rucCab = "Ruc Cliente";
      this.razonSocialCab = "Razon Social Cliente";
      this.rucDet = "Ruc Pagador";
      this.razonSocialDet = "Razon Social Pagador";
    }
    else{
      this.rucCab = "Ruc Proveedor";
      this.razonSocialCab = "Razon Social Proveedor";
      this.rucDet = "Ruc Cliente";
      this.razonSocialDet = "Razon Social Cliente";
    }
  }
  
  onClientePagadorList(modal, value): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesFormService.listarCliente({
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

  onProcesar(): void{
    //this.submitted = true;
    // if (this.solicitudForm.invalid) {
    //   return;
    // }

    // let list = [];
    // for (const item of this.uploader.queue) {
    //   list.push({'name': item?.file?.name});

    //   if (item?.file?.name.includes('.xml') || item?.file?.name.includes('.XML')) {
    //     this.cantXml = this.cantXml + 1;
    //   }
    //   else {
    //     this.cantPdf = this.cantPdf + 1;
    //   }
    // }
    
    //console.log('cantxml2', this.cantXml);
    // if(this.uploader.queue.length % 2 > 0)
    // {
    //   this.utilsService.showNotification('La cantidad de archivos adjuntados debe ser siempre par', 'Alerta', 2);
    //   return;
    // }
    this.uploader.setOptions({
      url: `${environment.apiUrl}${SOLICITUD.upload}?idSolicitudCab=0&idTipoOperacion=` + this.idTipoOperacion + `&ruc=` + this.ruc + `&usuarioAud=Admin1`,
    });

    this.dataXml  = [];
    this.uploader.uploadAll();
    let count = 0;
    this.uploader.response.subscribe( res => {
     
      let rs = JSON.parse(res);
      //console.log('res', rs);
      
      if (rs.tipoMoneda != '') {
        this.dataXml.push(rs);
        this.procesar = false;
      }
      else
      {
        if (rs.tipo == 1) {
          count = Number(count) + 1;
          if (count == this.cantPdf) {
            this.utilsService.showNotification('Información Procesada correctamente', 'Confirmación', 1);
          }
          this.utilsService.blockUIStop();
        } else if (rs.tipo == 2) {
          this.utilsService.showNotification(rs.mensaje, 'Alerta', 2);
          this.utilsService.blockUIStop();
        } else {
          this.utilsService.showNotification(rs.mensaje, 'Error', 3);
          this.utilsService.blockUIStop();
        }
      }
      
    });
  }
  onProcesarXlsx(): void{

    this.uploaderXlsx.setOptions({
      url: `${environment.apiUrl}${SOLICITUD.uploadXlsx}`,
    });

    this.dataXlsx  = [];
    this.uploaderXlsx.uploadAll();
    
    this.uploaderXlsx.response.subscribe( res => {
     
      let rs = JSON.parse(res);
      if (rs.tipo != 1) {
        this.dataXlsx.push(rs);
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
