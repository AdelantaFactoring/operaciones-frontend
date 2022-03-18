import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import Stepper from 'bs-stepper';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilsService} from "../../../../shared/services/utils.service";
import {SolicitudesFormService} from "./solicitudes-form.service";
import {NgbModal, NgbCalendar, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {environment} from '../../../../../environments/environment';
import {SOLICITUD} from "../../../../shared/helpers/url/comercial";
import { SolicitudArchivos, SolicitudArchivosXlsx } from 'app/shared/models/comercial/SolicitudArchivos';
import Swal from 'sweetalert2';
import { SolicitudDetRespuesta } from 'app/shared/models/comercial/SolicitudDet-Respuesta';

@Component({
  selector: 'app-solicitudes-form',
  templateUrl: './solicitudes-form.component.html',
  styleUrls: ['./solicitudes-form.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  public capitalTrabajoForm: FormGroup;
  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 8;
  public page: number = 1;
  public searchCli: string = '';
  public collectionSizeCli: number = 0;
  public pageSizeCli: number = 8;
  public pageCli: number = 1;
  public optClienteP = [];
  public clienteGastos = [];
  public razonSocial = '';
  public ruc = '';
  public tasaNominalMensual: number = 0;
  public tasaNominalAnual: number = 0;
  public tasaNominalMensualMora: number = 0;
  public tasaNominalAnualMora: number = 0;
  public financiamiento: number = 0;
  public cantXml: number = 0;
  public cantPdf: number = 0;
  public dataXml: SolicitudArchivos[] = [];
  public dataPdf: SolicitudArchivos[] = [];
  public dataXlsx: SolicitudArchivosXlsx[] = [];
  public solicitudDetRespuesta: SolicitudDetRespuesta[] = [];
  public mensaje = [];
  public optMoneda = [];
  public optTipo = [];
  public rucRequired: boolean = true;
  public idCliente: number;
  public idTipo: number = 1;
  idTipoOperacion: number = 1;
  tipoServicio = "Factoring";
  rucCab: string;
  razonSocialCab: string;
  rucDet: string;
  razonSocialDet: string;
  hasBaseDropZoneOver: boolean;
  procesar: boolean = true;
  procesarXlsx: boolean = true;
  facCheck: boolean = true;
  idMoneda: number = 1;
  mayor: boolean = false;
  public flagConfirming: boolean = false;
  public flagRespuestaFac: boolean = false;
  public flagRespuestaCon: boolean = false;

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
  public zeroPad = (num, places) => String(num).padStart(places, '0');
  public fechaPagoActual = this.calendar.getToday();
  public fechaPagoCT = this.calendar.getToday();

  horizontalWizardStepperNext(data, form, id) {
    let nombreArchivo;
    if (data.form.valid === true) {
      if (id == 1) {
        for (const item of this.dataPdf) {
          nombreArchivo = '';
          for (const row of this.dataXml) {
            nombreArchivo = item.nombrePDF.substring(0, item.nombrePDF.length - 4);
            if (row.nombreXML.includes(nombreArchivo)) {
              row.nombrePDF = item.nombrePDF;
            }
          }
        }
      }
      this.horizontalWizardStepper.next();
    }
    if (form != '' && this.idTipoOperacion == 3) {
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
  get CapitalIUForm(): any {
    return this.capitalTrabajoForm.controls;
  }
  constructor(
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private solicitudesFormService: SolicitudesFormService,
    private formBuilder: FormBuilder,
    private location: Location,
    private calendar: NgbCalendar,) {
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
    this.solicitudForm = this.formBuilder.group({
      buscarCliente: ['']
    });
    this.capitalTrabajoForm = this.formBuilder.group({
      tipo: [1],
      moneda: [1],
      ruc: ['', Validators.required],
      razonSocial: ['', Validators.required],
      tasaAnual: ['', Validators.required],
      tasaMensual: ['', Validators.required],
      cartaNotarial: ['', Validators.required],
      servicioCobranza: ['', Validators.required],
      servicioCustodia: ['', Validators.required],
      mcTrabajo: ['', Validators.required],
      ctSolicitado: [0, Validators.required],
      diasPrestamo: [0, Validators.required],
      iIncluidoIGV: [0],
      gIncluidoIGV: [0],
      tFacturarIGV: [0],
      tDesembolsoIGV: [0],
      fechaPago: [''],
      montoDesc: ['']
    });
   }

  ngOnInit(): void {
    this.onRadioChange(this.tipoServicio, this.idTipoOperacion, this.flagConfirming, '')
  }
  onRefrescar(): void {
    //this.onListarSolicitudes();
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    if (e == false) {
      this.onBrowseChange();
      this.procesar = true;
      this.procesarXlsx = true;
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
        "rucPagProv": item.rucDet,
        "RazonSocialPagProv": item.razonSocialDet,
        "moneda": item.tipoMoneda,
        "nroDocumento": item.codFactura,
        "fechaConfirmado": item.fechaVencimiento,
        "netoConfirmado": item.netoPendiente,
        "montoSinIGV": item.subTotal,
        "montoConIGV": item.total,
        "formaPago": item.formaPago,
        "archivoXML": item.nombreXML,
        "archivoPDF": item.nombrePDF,

        "NombreContacto": item.nombrePDF,
        "TelefonoContacto": item.nombrePDF,
        "CorreoContacto": item.nombrePDF,
        "TitularCuentaBancariaDestino": item.nombrePDF,
        "MonedaCuentaBancariaDestino": item.nombrePDF,
        "BancoDestino": item.nombrePDF,
        "NroCuentaBancariaDestino": item.nombrePDF,
        "CCIDestino": item.nombrePDF,
        "TipoCuentaBancariaDestino": item.nombrePDF,

      });
    }


    this.utilsService.blockUIStart('Guardando información...');
    this.solicitudesFormService.guardar({
      "idSolicitudCab": 0,
      "idCliente": this.idCliente,
      "idTipoOperacion": this.idTipoOperacion,
      "idUsuarioAud": 1,
      "solicitudDet": this.params
    }).subscribe((response: SolicitudDetRespuesta[]) => {

      this.solicitudDetRespuesta = response;

      if (this.idTipoOperacion == 1) {
        this.flagRespuestaFac = true;
      }
      else
      {
        this.flagRespuestaCon = true;
      }
      this.onGenerarCarpeta(this.solicitudDetRespuesta);
      //this.horizontalWizardStepperNext('RespuestaInfoForm', 0);

      // if (response.tipo == 1) {
      //   this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
      //   this.utilsService.blockUIStop();
      //   this.location.back();
      // } else if (response.tipo == 2) {
      //   this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
      //   this.utilsService.blockUIStop();
      // } else {
      //   this.utilsService.showNotification(response.mensaje, 'Error', 3);
      //   this.utilsService.blockUIStop();
      // }

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

  }
  onGuardarCT(): void {
    this.submitted = true;
    if (this.capitalTrabajoForm.invalid) {
      return;
    }

    this.utilsService.blockUIStart('Guardando información...');
    this.solicitudesFormService.guardarCT({
      idSolicitudCab: 0,
      idTipoOperacion: this.idTipoOperacion,
      idTipoCT: this.capitalTrabajoForm.controls.tipo.value,
      idMoneda: this.capitalTrabajoForm.controls.moneda.value,
      idCliente: this.idCliente,
      rucPagProv: this.ruc,
      razonSocialPagProv: this.razonSocial,
      tasaNominalMensual: this.tasaNominalMensual,
      tasaNominalAnual: this.tasaNominalAnual,
      tasaNominalMensualMora: this.tasaNominalMensualMora,
      tasaNominalAnualMora: this.tasaNominalAnualMora,
      financiamiento: this.financiamiento,
      montoCT: this.capitalTrabajoForm.controls.mcTrabajo.value,
      montoSolicitudCT: this.capitalTrabajoForm.controls.ctSolicitado.value,
      diasPrestamoCT: this.capitalTrabajoForm.controls.diasPrestamo.value,
      fechaPagoCT: this.fechaPagoCT.year + this.zeroPad(this.fechaPagoCT.month, 2) + this.zeroPad(this.fechaPagoCT.day, 2),
      interesIncluidoIGV: this.capitalTrabajoForm.controls.iIncluidoIGV.value,
      gastoIncluidoIGV: this.capitalTrabajoForm.controls.gIncluidoIGV.value,
      totalFacConIGV: this.capitalTrabajoForm.controls.tFacturarIGV.value,
      totalDesembolsoConIGV: this.capitalTrabajoForm.controls.tDesembolsoIGV.value,
      idUsuarioAud: 1,
    }).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.location.back();
        this.modalService.dismissAll();
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
  onBrowseChange() {
    if (this.uploaderXlsx.queue.length > 1) {
      this.uploaderXlsx.queue.splice(0, 1);
    }
    this.procesar = true;
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

    this.onEliminarRepetidas();
    if (flagEliminado == true) {
      this.utilsService.showNotification('Se han eliminado los archivo que no continen una extensión .xml o .pdf', 'Validación', 2);
    }
  }
  onBrowseChangeXlsx() {
    if (this.uploaderXlsx.queue.length > 1) {
      this.uploaderXlsx.queue.splice(0, 1);
    }
    this.procesarXlsx = true;
    let flagEliminado = false;
    for (const item of this.uploaderXlsx.queue) {
      let name = item._file.name;
      if (name.includes('.xlsx') || name.includes('.XLSX')) {

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

  onRadioChange(value, idTipoOperacion, flagConfirming, modal): void {
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
    else if (idTipoOperacion == 2) {
      this.onTablaMaestra(5);
      this.onTablaMaestra(1);
      this.onChangeMoneda();
      this.facCheck = false;
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
    this.idCliente = idfila;
    if (this.idTipoOperacion == 2) {

      this.onClienteObtener(idfila, ruc, razon);
    }
    else{
      this.selectedRowIds = [];
      this.selectedRowIds.push(idfila);
      this.razonSocial = razon;
      this.ruc = ruc;
      this.rucRequired = true;
    }
    modal.dismiss('Cross click');
  }

  onProcesar(): void{
    this.mensaje = [];
    this.submitted = true;
    // if (this.solicitudForm.invalid) {
    //   return;
    // }
    this.cantXml = 0;
    this.cantPdf = 0;
    if (this.rucRequired == false || this.ruc == "") {
      this.rucRequired = false;
      return;
    }

    let list = [];
    for (const item of this.uploader.queue) {
      list.push({'name': item?.file?.name});

      if (item?.file?.name.includes('.xml') || item?.file?.name.includes('.XML')) {
        this.cantXml = this.cantXml + 1;
      }
      else {
        this.cantPdf = this.cantPdf + 1;
      }
    }

    if (this.cantXml != this.cantPdf) {
      this.utilsService.showNotification("La cantidad de archivos XML no coincide con la cantidad de PDF", 'Alerta', 2);
      return;
    }
    // console.log('cantXML', this.cantXml);
    // console.log('cantPDF', this.cantPdf);
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

      if (rs.tipo == 0) {
        this.dataXml.push(rs);
        this.procesar = false;
        count = Number(count) + 1;
        if (count == this.cantXml) {
          this.utilsService.showNotification('Información Procesada correctamente', 'Confirmación', 1);
        }
      }
      else
      {
        if (rs.tipo == 1) {
          this.dataPdf.push(rs);
          // count = Number(count) + 1;
          // if (count == this.cantPdf) {
          //   this.utilsService.showNotification('Información Procesada correctamente', 'Confirmación', 1);
          // }
          // this.utilsService.blockUIStop();
        } else if (rs.tipo == 2) {
          //console.log('name', rs.nombreXML);
        //   console.log('nameXml',rs.nombreXML);

        //  for (const item of this.uploader.queue) {
        //   if (item?.file?.name == rs.nombreXML) {
        //     item.isSuccess = false;
        //     item.isCancel = false;
        //     item.isError = true;
        //   }
        //  }
          this.mensaje.push(rs.mensaje + '<br/>');
          this.onMensajeValidacion(this.mensaje);
          // this.utilsService.showNotification(rs.mensaje, 'Alerta', 2);
          // this.utilsService.blockUIStop();
        } else if (rs.tipo == 3){
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
        this.dataXlsx = rs;

        if (this.cantXml != this.dataXlsx.length) {
          this.utilsService.showNotification("La cantida de registros en el Excel no coincide con la cantidad de facturas adjuntadas", 'Alerta', 2);
          this.procesarXlsx = true;
        }
        else
        {
          for (const row of this.dataXlsx) {
            for (const item of this.dataXml) {
              if (item.rucCab == row.ruc && item.tipoMoneda == row.moneda) {
                item.nombreContacto = row.nombreContacto;
                item.telefonoContacto = row.telefono;
                item.correoContacto = row.correo;
                item.titularCuentaBancariaDestino = row.razonSocialProv;
                item.monedaCuentaBancariaDestino = row.moneda;
                item.bancoDestino = row.banco;
                item.nroCuentaBancariaDestino = row.ctaBancaria;
                item.cCIDestino = row.cci;
                item.tipoCuentaBancariaDestino = row.tipoCuenta;
              }
            }
          }
          this.procesarXlsx = false;
        }
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

  onEliminarRepetidas(): void{
    let name = '';
    let cant = 0;

    for (const item of this.uploader.queue) {
      name = item?.file?.name;
      cant = 0;
      for (const i of this.uploader.queue) {
        if (name == i?.file?.name) {
          cant = cant + 1;
        }
        if (cant > 1) {
          i.remove();
        }
      }
    }
  }
  onMensajeValidacion(msg): void{
    Swal.fire({
      title: 'No Coincide',
      //text: msg,
      html:msg,
      icon: 'warning',
      showCancelButton: false,
      // confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      customClass: {
        confirmButton: 'btn btn-danger ml-1'
      },
      confirmButtonText: 'OK'
    });
  }

  onCancelar(): void{
    this.submitted = false;
    this.modalService.dismissAll();
    this.idTipoOperacion = 1;
    this.facCheck = true;
    this.onRadioChange('Factoring',1,false,'');
  }

  onClienteObtener(id, ruc, razon): void{
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesFormService.clienteObtener({
      idCliente: id
    }).subscribe(response => {
      if (response.clienteGastos.filter(x => x.idTipoOperacion == 2 && x.idMoneda == this.idMoneda).length > 0) {
        this.clienteGastos = response.clienteGastos.filter(x => x.idTipoOperacion == 2 && x.idMoneda == this.idMoneda);
        for (const item of this.clienteGastos) {
          this.ruc = item.ruc;
          this.razonSocial = item.razonSocial;
          this.tasaNominalMensual = item.tasaNominalMensual;
          this.tasaNominalAnual = item.tasaNominalAnual;
          this.tasaNominalMensualMora = item.tasaNominalMensualMora;
          this.tasaNominalAnualMora = item.tasaNominalAnualMora;
          this.financiamiento = item.financiamiento;
          this.capitalTrabajoForm.controls.ruc.setValue(ruc);
          this.capitalTrabajoForm.controls.razonSocial.setValue(razon);
          this.capitalTrabajoForm.controls.tasaAnual.setValue(item.tasaNominalAnual);
          this.capitalTrabajoForm.controls.tasaMensual.setValue(item.tasaNominalMensual);
          this.capitalTrabajoForm.controls.cartaNotarial.setValue(item.comisionCartaNotarial);
          this.capitalTrabajoForm.controls.servicioCobranza.setValue(item.servicioCobranza);
          this.capitalTrabajoForm.controls.servicioCustodia.setValue(item.servicioCustodia);

        }
      }
      else
      {
          this.ruc = ruc;
          this.razonSocial = razon;
          this.tasaNominalMensual = 0;
          this.tasaNominalAnual = 0;
          this.tasaNominalMensualMora = 0;
          this.tasaNominalAnualMora = 0;
          this.financiamiento = 0;
          this.capitalTrabajoForm.controls.ruc.setValue(ruc);
          this.capitalTrabajoForm.controls.razonSocial.setValue(razon);
          this.capitalTrabajoForm.controls.tasaAnual.setValue(0);
          this.capitalTrabajoForm.controls.tasaMensual.setValue(0);
          this.capitalTrabajoForm.controls.cartaNotarial.setValue(0);
          this.capitalTrabajoForm.controls.servicioCobranza.setValue(0);
          this.capitalTrabajoForm.controls.servicioCustodia.setValue(0);
      }
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onTablaMaestra(idTabla): void{
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesFormService.listarTablaMaestra({
      idTabla: idTabla,
      idColumna: 0
    }).subscribe(response => {
      if (idTabla == 1) {
        this.optMoneda = response;
      }
      else{
        this.optTipo = response;
      }
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }
  calcularFP(): void{
    let date = {
      year: this.calendar.getToday().year,
      month:this.calendar.getToday().month,
      day:this.calendar.getToday().day + Number(this.capitalTrabajoForm.controls.diasPrestamo.value)}
    this.capitalTrabajoForm.controls.fechaPago.setValue(date);
    this.onCalcularCT();
  }
  onChangeMoneda(): void{
    this.ruc = '';
    this.razonSocial = '';
    this.capitalTrabajoForm.controls.ruc.setValue('');
    this.capitalTrabajoForm.controls.razonSocial.setValue('');
    this.capitalTrabajoForm.controls.tasaAnual.setValue('');
    this.capitalTrabajoForm.controls.tasaMensual.setValue('');
    this.capitalTrabajoForm.controls.cartaNotarial.setValue('');
    this.capitalTrabajoForm.controls.servicioCobranza.setValue('');
    this.capitalTrabajoForm.controls.servicioCustodia.setValue('');
    this.tasaNominalMensual = 0;
    this.tasaNominalAnual = 0;
    this.tasaNominalMensualMora = 0;
    this.tasaNominalAnualMora = 0;
    this.financiamiento = 0;

    this.capitalTrabajoForm.controls.mcTrabajo.setValue('');
    this.capitalTrabajoForm.controls.ctSolicitado.setValue('');
    this.capitalTrabajoForm.controls.diasPrestamo.setValue('');
    this.capitalTrabajoForm.controls.iIncluidoIGV.setValue('');
    this.capitalTrabajoForm.controls.gIncluidoIGV.setValue('');
    this.capitalTrabajoForm.controls.tFacturarIGV.setValue('');
    this.capitalTrabajoForm.controls.tDesembolsoIGV.setValue('');
  }
  onCalcularCT(): void{
    let capitalTrabajo, TNA, nroDias, intereses, gastosCt, montoSolicitado, totolFacturado;
    capitalTrabajo = this.capitalTrabajoForm.controls.mcTrabajo.value;
    TNA = this.capitalTrabajoForm.controls.tasaAnual.value;
    nroDias = this.capitalTrabajoForm.controls.diasPrestamo.value;
    intereses = capitalTrabajo * (TNA / 360) * nroDias * 1.18;
    gastosCt = this.capitalTrabajoForm.controls.gIncluidoIGV.value;
    montoSolicitado = this.capitalTrabajoForm.controls.ctSolicitado.value;
    this.capitalTrabajoForm.controls.iIncluidoIGV.setValue(Math.round((intereses + Number.EPSILON) * 100)/100);
    this.capitalTrabajoForm.controls.tFacturarIGV.setValue(Math.round((intereses + Number.EPSILON) + gastosCt));
    totolFacturado = Math.round((intereses + Number.EPSILON)+ gastosCt);
    this.capitalTrabajoForm.controls.tDesembolsoIGV.setValue(Math.round((montoSolicitado + Number.EPSILON) - totolFacturado));

  }
  validacionCT(): void{
    let montoCT, ctSolicitado;
    montoCT = Number(this.capitalTrabajoForm.controls.mcTrabajo.value);
    ctSolicitado = Number(this.capitalTrabajoForm.controls.ctSolicitado.value);

    if (montoCT < ctSolicitado) {
      this.utilsService.showNotification('Capital solicitado no puede ser mayor al monto de capital de trabajo.', 'Alerta', 2);
      this.mayor = true;
    }
    else
    {
      this.mayor = false;
    }
  }
  onGenerarCarpeta(data): void{
    this.solicitudesFormService.generarCarpeta(data).subscribe(response => {
      //console.log('res', response);
      this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }
}
