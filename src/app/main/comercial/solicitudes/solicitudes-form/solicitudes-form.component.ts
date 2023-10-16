import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import Stepper from 'bs-stepper';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilsService } from "../../../../shared/services/utils.service";
import { SolicitudesFormService } from "./solicitudes-form.service";
import { NgbModal, NgbCalendar, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from '../../../../../environments/environment';
import { SOLICITUD } from "../../../../shared/helpers/url/comercial";
import { SolicitudArchivos, SolicitudArchivosXlsx } from 'app/shared/models/comercial/SolicitudArchivos';
import Swal from 'sweetalert2';
import { SolicitudDetRespuesta } from 'app/shared/models/comercial/SolicitudDet-Respuesta';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { ClienteContacto } from 'app/shared/models/comercial/cliente-contacto';
import { LOADIPHLPAPI } from 'dns';
import { Router } from '@angular/router';
import { User } from 'app/shared/models/auth/user';
import { Comun } from "../../../../shared/models/shared/comun";
import { SunatService } from 'app/shared/services/sunat.service';

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
  public uploader2: FileUploader = new FileUploader({
    url: `${environment.apiUrl}${SOLICITUD.upload}`,
    isHTML5: true
  });

  public currentUser: User;
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
  public tipoFactoring: boolean = false;
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
  codigoUbigeoCab: string;
  codigoUbigeoDet: string;
  direccionCab: string;
  direccionDet: string;
  hasBaseDropZoneOver: boolean;
  procesar: boolean = true;
  procesarXlsx: boolean = true;
  public procesarAut: boolean = true;
  facCheck: boolean = true;
  idMoneda: number = 1;
  public usarGastosContrato: boolean = true;
  public usarGastoVigenciaPoder: boolean = true;
  public flagConfirming: boolean = false;
  public flagRespuestaFac: boolean = false;
  public flagRespuestaCon: boolean = false;
  public igvCT: number = 0;
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
  public contacto: ClienteContacto[] = [];
  public selectMulti = [{ name: 'English' }, { name: 'French' }, { name: 'Spanish' }];
  public selectMultiSelected;
  public zeroPad = (num, places) => String(num).padStart(places, '0');
  public fechaPagoCT = this.calendar.getToday();
  public activeId: any = 2;

  horizontalWizardStepperNext(data: any, form: any, id: number) {
    let nombreArchivo;
    if (data.form.valid === true && form != 'saltar') {
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
      if (id == 2) {
        for (const item of this.dataXml) {
          if (item.estadoDireccionCab == 0 || item.estadoUbigeoDet == 0 || item.estadoDireccionCab == 0 || item.estadoDireccionDet == 0) {
            this.utilsService.showNotification('Debe de completar toda la información requerida de la(s) factura(s)', 'Validación', 2);
            return;
          }
        }
      }
      this.horizontalWizardStepper.next();
    }

    if (form != '') {//&& this.idTipoOperacion == 3 {
      if (form == 'saltar') {
        for (const item of this.dataXml) {
          if (item.estadoDireccionCab == 0 || item.estadoUbigeoDet == 0 || item.estadoDireccionCab == 0 || item.estadoDireccionDet == 0) {
            this.utilsService.showNotification('Debe de completar toda la información requerida de la(s) factura(s)', 'Validación', 2);
            return;
          }
        }
      }
      this.horizontalWizardStepper.next();
      if (form == 'saltar') {
        if (this.idTipoOperacion == 3)
          this.horizontalWizardStepper.next();
        this.horizontalWizardStepper.next();
      }
    }
  }

  horizontalWizardStepperPrevious(saltos: number) {
    for (let i = 1; i <= saltos; i++) {
      this.horizontalWizardStepper.previous();
    }
    // this.horizontalWizardStepper.previous();
    // if (flagDoble == 1) {
    //   this.horizontalWizardStepper.previous();
    // }
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
    private calendar: NgbCalendar,
    public router: Router,
    private sunatService: SunatService) {
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
      tasaMensual: [0, Validators.required],
      tasaAnual: [0, Validators.required],
      tasaMoraMensual: [0, Validators.required],
      tasaMoraAnual: [0, Validators.required],
      financiamiento: [0],
      comisionEstructuracion: [0],
      contrato: [0, Validators.required],
      cartaNotarial: [0, Validators.required],
      servicioCobranza: [0, Validators.required],
      servicioCustodia: [0, Validators.required],
      igvCT: [0, Validators.required],
      mcTrabajo: [0],
      ctSolicitado: [1, [Validators.required, Validators.min(1)]],
      diasPrestamo: [1, [Validators.required, Validators.min(1)]],
      iIncluidoIGV: [0],
      gIncluidoIGV: [0],
      tFacturarIGV: [0],
      tDesembolsoIGV: [0],
      fechaPago: [''],
      montoDesc: [0],
      fondoResguardo: [0],
      netoSolicitado: [0],
      usarGastosContrato: [false],
      usarGastoVigenciaPoder: [false],
      gastoVigenciaPoder: [0]
    });
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.onTablaMaestra(1000, 2);
    this.onRadioChange(this.tipoServicio, this.idTipoOperacion, this.flagConfirming, '');
  }

  onRefrescar(): void {
    //this.onListarSolicitudes();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    if (e == false) {
      this.onBrowseChange();
      this.procesar = true;
    }
  }

  public fileOverBaseAut(e: any): void {
    this.hasBaseDropZoneOver = e;
    if (e == false) {
      if (this.uploader2.queue.length > 1) {
        this.uploader2.queue.splice(0, this.uploader2.queue.length);
        this.utilsService.showNotification('Solo se permite un archivo a la vez', 'Validación', 2);
        return;
      }

      this.procesarAut = true;
    }
  }

  public fileOverBaseXLSX(e: any): void {
    this.hasBaseDropZoneOver = e;
    if (e == false) {
      this.onBrowseChangeXlsx();
      this.procesarXlsx = true;
    }
  }

  onGuardar(): void {
    this.submitted = true;
    if (this.solicitudForm.invalid) {
      return;
    }
    if (this.idTipoOperacion == 3) {
      for (const row of this.dataXml) {
        if (row.netoPendiente > row.netoPendienteOld) {
          this.utilsService.showNotification('El neto pendiente debe ser menor o igual al neto pendiente XML', 'Validación', 2);
          return;
        }
        if (row.titularCuentaBancariaDestino == null || row.monedaCuentaBancariaDestino == null || row.bancoDestino == null || row.tipoCuentaBancariaDestino == null
          || row.nombreContacto == null || row.telefonoContacto == null || row.correoContacto == null) {
          this.utilsService.showNotification('Completar los datos requeridos', 'Validación', 2);

          return;
        } else if (row.nroCuentaBancariaDestino == null && row.cCIDestino == null || row.nroCuentaBancariaDestino == '' && row.cCIDestino == '') {
          this.utilsService.showNotification('Completar los datos requeridos', 'Validación', 2);
          return;
        } else if (row.titularCuentaBancariaDestino == '' || row.monedaCuentaBancariaDestino == '' || row.bancoDestino == '' || row.tipoCuentaBancariaDestino == ''
          || row.nombreContacto == '' || row.telefonoContacto == '' || row.correoContacto == '') {
          this.utilsService.showNotification('Completar los datos requeridos', 'Validación', 2);
          return;
        }
      }
    }
    else {
      for (const item of this.dataXml) {
        if (item.estadoDireccionCab == 0 || item.estadoUbigeoDet == 0 || item.estadoDireccionCab == 0 || item.estadoDireccionDet == 0) {
          this.utilsService.showNotification('Debe de completar toda la información requerida', 'Validación', 2);
          return;
        }
      }
    }
    this.params = [];
    for (const item of this.dataXml) {
      this.params.push({
        "idSolicitudDet": 0,
        "rucPagProv": this.idTipoOperacion == 1 ? item.rucDet : item.rucCab,
        "RazonSocialPagProv": this.idTipoOperacion == 1 ? item.razonSocialDet : item.razonSocialCab,

        "codigoUbigeoCliente": this.idTipoOperacion == 1 ? item.codigoUbigeoDet : item.codigoUbigeoCab,
        "direccionCliente": this.idTipoOperacion == 1 ? item.direccionDet : item.direccionCab,
        "codigoUbigeoPagProv": this.idTipoOperacion == 1 ? item.codigoUbigeoCab : item.codigoUbigeoDet,
        "direccionPagProv": this.idTipoOperacion == 1 ? item.direccionCab : item.direccionDet,

        "moneda": item.tipoMoneda,
        "nroDocumento": item.codFactura,
        "fechaConfirmadoFormat": item.fechaVencimiento,
        "netoConfirmado": item.netoPendiente,
        "montoSinIGV": item.subTotal,
        "montoConIGV": item.total,
        "formaPago": item.formaPago,
        "archivoXML": item.nombreXML,
        "archivoPDF": item.nombrePDF,
        "NombreContacto": item.nombreContacto,
        "TelefonoContacto": item.telefonoContacto,
        "CorreoContacto": item.correoContacto,
        "TitularCuentaBancariaDestino": item.titularCuentaBancariaDestino,
        "MonedaCuentaBancariaDestino": item.monedaCuentaBancariaDestino,
        "BancoDestino": item.bancoDestino,
        "NroCuentaBancariaDestino": item.nroCuentaBancariaDestino,
        "CCIDestino": item.cCIDestino,
        "TipoCuentaBancariaDestino": item.tipoCuentaBancariaDestino,
        "Alterno": this.tipoFactoring,
        "IdTipoArchivo": item.idTipoArchivo,
        "ArchivoSustento": item.archivoSustento
      });
    }

    this.utilsService.blockUIStart('Guardando información...');
    this.solicitudesFormService.guardar({
      "idSolicitudCab": 0,
      "idCliente": this.idCliente,
      "idTipoOperacion": this.idTipoOperacion,
      "idUsuarioAud": this.currentUser.idUsuario,
      "solicitudDet": this.params
    }).subscribe((response: SolicitudDetRespuesta[]) => {
      this.solicitudDetRespuesta = response;

      if (this.idTipoOperacion == 1) {
        this.flagRespuestaFac = true;
      } else {
        this.flagRespuestaCon = true;
      }

      this.onGenerarCarpeta(this.solicitudDetRespuesta);

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
      idCliente: this.idCliente,
      idMoneda: this.capitalTrabajoForm.controls.moneda.value,
      rucPagProv: this.ruc,
      razonSocialPagProv: this.razonSocial,
      tasaNominalMensual: this.tasaNominalMensual,
      tasaNominalAnual: this.tasaNominalAnual,
      tasaNominalMensualMora: this.tasaNominalMensualMora,
      tasaNominalAnualMora: this.tasaNominalAnualMora,
      financiamiento: this.financiamiento,
      comisionEstructuracion: this.capitalTrabajoForm.controls.comisionEstructuracion.value,
      usarGastosContrato: this.usarGastosContrato,
      gastosContrato: this.capitalTrabajoForm.controls.contrato.value,
      idTipoOperacion: this.idTipoOperacion,
      usarGastoVigenciaPoder: this.usarGastoVigenciaPoder,
      comisionCartaNotarial: this.capitalTrabajoForm.controls.cartaNotarial.value,
      servicioCobranza: this.capitalTrabajoForm.controls.servicioCobranza.value,
      servicioCustodia: this.capitalTrabajoForm.controls.servicioCustodia.value,
      gastoVigenciaPoder: this.capitalTrabajoForm.controls.gastoVigenciaPoder.value,
      idTipoCT: this.capitalTrabajoForm.controls.tipo.value,
      montoCT: this.capitalTrabajoForm.controls.mcTrabajo.value,
      montoSolicitudCT: this.capitalTrabajoForm.controls.ctSolicitado.value,
      iGVCT: this.capitalTrabajoForm.controls.igvCT.value,
      diasPrestamoCT: this.capitalTrabajoForm.controls.diasPrestamo.value,
      fechaPagoCT: this.fechaPagoCT.year + this.zeroPad(this.fechaPagoCT.month, 2) + this.zeroPad(this.fechaPagoCT.day, 2),
      interesIncluidoIGV: this.capitalTrabajoForm.controls.iIncluidoIGV.value,
      gastoIncluidoIGV: this.capitalTrabajoForm.controls.gIncluidoIGV.value,
      totalFacConIGV: this.capitalTrabajoForm.controls.tFacturarIGV.value,
      totalDesembolsoConIGV: this.capitalTrabajoForm.controls.tDesembolsoIGV.value,
      idUsuarioAud: this.currentUser.idUsuario,
    }).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.router.navigate(['/comercial/solicitudes']);
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
    this.procesar = true;
    let flagEliminado = false;
    for (const item of this.uploader.queue) {
      let name = item._file.name;
      if (name.includes('.XML') || name.includes('.PDF') || name.includes('.xml') || name.includes('.pdf')) {

      } else {
        flagEliminado = true;
        item.remove();
      }
    }

    this.onEliminarRepetidas();
    if (flagEliminado == true) {
      this.utilsService.showNotification('Se han eliminado los archivo que no continen una extensión .xml o .pdf', 'Validación', 2);
    }
  }

  onBrowseChangeXlsx() {
    if (this.uploaderXlsx.queue.length > 1) {
      this.uploaderXlsx.queue.splice(0, this.uploaderXlsx.queue.length);
      this.utilsService.showNotification('Solo se permite un archivo a la vez', 'Validación', 2);
      return;
    }
    this.procesarXlsx = true;
    let flagEliminado = false;
    for (let item of this.uploaderXlsx.queue) {
      let name = item._file.name;
      if (!(name.includes('.xlsx') || name.includes('.XLSX'))) {
        flagEliminado = true;
        item.remove();
      }
    }
    if (flagEliminado == true) {
      this.utilsService.showNotification('Se han eliminado los archivo que no continen una extensión .xlsx', 'Validación', 2);
    }
  }

  onRadioChange(value, idTipoOperacion, flagConfirming, modal): void {
    this.dataXml = [];
    this.uploader.clearQueue();
    this.ruc = "";
    this.razonSocial = "";
    this.tipoServicio = value;
    this.idTipoOperacion = idTipoOperacion;
    this.tipoFactoring = idTipoOperacion != 1 ? false : this.tipoFactoring;
    this.hasBaseDropZoneOver = false;
    this.flagConfirming = flagConfirming;

    this.horizontalWizardStepper = new Stepper(document.querySelector('#stepper1'), {});

    if (idTipoOperacion == 1) {
      this.rucCab = "Ruc Cliente";
      this.razonSocialCab = "Razon Social Cliente";
      this.rucDet = "Ruc Pagador";
      this.razonSocialDet = "Razon Social Pagador";
      this.direccionCab = "Dirección Cliente";
      this.codigoUbigeoCab = "Cod Ubigeo Cliente";
      this.direccionDet = "Dirección Pagador";
      this.codigoUbigeoDet = "Cod Ubigeo Pagador";
    } else if (idTipoOperacion == 2) {
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
    } else {
      this.rucCab = "Ruc Proveedor";
      this.razonSocialCab = "Razon Social Proveedor";
      this.rucDet = "Ruc Cliente";
      this.razonSocialDet = "Razon Social Cliente";
      this.direccionCab = "Dirección Proveedor";
      this.codigoUbigeoCab = "Cod Ubigeo Proveedor";
      this.direccionDet = "Dirección Cliente";
      this.codigoUbigeoDet = "Cod Ubigeo Cliente";
    }
  }

  onClientePagadorList(modal, value): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesFormService.listarCliente({
      idTipoOperacion: this.idTipoOperacion,
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

  onRowClick(razon: string, ruc: string, idfila: number, modal: any) {
    this.idCliente = idfila;
    if (this.idTipoOperacion == 2) {
      this.onClienteObtener(idfila, ruc, razon);
    } else {
      if (this.idTipoOperacion == 3) {
        this.onClienteObtener(idfila, ruc, razon);
      }
      this.selectedRowIds = [];
      this.selectedRowIds.push(idfila);
      this.razonSocial = razon;
      this.ruc = ruc;
      this.rucRequired = true;
    }
    modal.dismiss('Cross click');
  }

  onProcesar(): void {
    this.mensaje = [];
    this.submitted = true;

    // if (this.solicitudForm.invalid) {
    //   return;
    // }
    this.cantXml = 0;
    this.cantPdf = 0;
    let nameXml = "";
    let pdf = [];

    if (this.rucRequired == false || this.ruc == "") {
      this.rucRequired = false;
      return;
    }

    let list = [];
    for (let item of this.uploader.queue) {
      list.push({ 'name': item?.file?.name });
      nameXml = item?.file?.name.substring(0, item?.file?.name.length - 4);

      if (item?.file?.name.includes('.xml') || item?.file?.name.includes('.XML')) {
        this.cantXml = this.cantXml + 1;
        pdf = this.uploader.queue.filter(x => x?.file?.name.includes(nameXml));

        if (pdf.length !== 2) {
          this.utilsService.showNotification("El nombre del archivo " + item?.file?.name + " no coincide con ningun archivo .PDF", 'Alerta', 2);
          return;
        }
      } else {
        this.cantPdf = this.cantPdf + 1;
      }
    }

    if (this.cantXml != this.cantPdf) {
      this.utilsService.showNotification("La cantidad de archivos .XML no coincide con la cantidad de .PDF", 'Alerta', 2);
      return;
    }
    this.uploader.setOptions({
      url: `${environment.apiUrl}${SOLICITUD.upload}?idSolicitudCab=0&idTipoOperacion=` + this.idTipoOperacion + `&ruc=` + this.ruc + `&usuarioAud=Admin1`,
      removeAfterUpload: false
    });


    this.dataXml = [];
    this.uploader.uploadAll();
    let count = 0;
    this.uploader.response.observers = [];

    this.uploader.response.subscribe(res => {

      let rs = JSON.parse(res);

      if (rs.tipo == 0) {
        this.dataXml.push(rs);

        this.procesar = false;
        count = Number(count) + 1;
        if (count == this.cantXml) {
          this.utilsService.showNotification('Información Procesada correctamente', 'Confirmación', 1);
        }
      } else {
        if (rs.tipo == 1) {
          this.dataPdf.push(rs);
        } else if (rs.tipo == 2) {
          this.mensaje.push(rs.mensaje + '<br/>');
          count = Number(count) + 1;
          if (count == this.cantXml) {
            this.onMensajeValidacion(this.mensaje);
          }
        } else if (rs.tipo == 3) {
          this.utilsService.showNotification(rs.mensaje, 'Error', 3);
          this.utilsService.blockUIStop();
        }
      }

    });
  }

  onProcesarXlsx(): void {
    this.uploaderXlsx.setOptions({
      url: `${environment.apiUrl}${SOLICITUD.uploadXlsx}`,
    });

    this.dataXlsx = [];
    this.uploaderXlsx.uploadAll();

    this.uploaderXlsx.response.subscribe(res => {
      let rs = JSON.parse(res);
      this.dataXlsx = [];

      if (rs.tipo != 1) {
        this.dataXlsx = rs;

        if (this.cantXml != this.dataXlsx.length) {
          this.utilsService.showNotification("La cantida de registros en el Excel no coincide con la cantidad de facturas adjuntadas", 'Alerta', 2);
          this.procesarXlsx = true;
        } else {
          let contacto = this.contacto.find(f => f.predeterminado);
          if (contacto === null)
            if (this.contacto.length > 0)
              contacto = this.contacto[0];

          for (const row of this.dataXlsx) {
            let item = this.dataXml.find(f => f.rucCab == row.ruc && f.tipoMoneda == row.moneda && f.codFactura == row.documento);
            if (item != null) {
              item.estadoNetoPen = row.netoPagar > item.netoPendienteOld ? 0 : 1;
              item.netoPendiente = row.netoPagar;
              item.fechaVencimiento = row.fechaVencimiento.substring(0, 10);
              item.nombreContacto = contacto ? contacto.nombre : '';
              item.telefonoContacto = contacto ? contacto.telefono : '';
              item.correoContacto = contacto ? contacto.correo : '';
              item.titularCuentaBancariaDestino = row.razonSocialProv.toUpperCase(); //toUpperCase() 220804 Maiquin
              item.monedaCuentaBancariaDestino = row.moneda;
              item.bancoDestino = row.banco;
              item.nroCuentaBancariaDestino = row.ctaBancaria;
              item.cCIDestino = row.cci;
              item.tipoCuentaBancariaDestino = row.tipoCuenta;
            }
          }
          this.procesarXlsx = false;
        }
      } else {
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

  onProcesarAut(): void {
    this.uploader2.setOptions({
      url: `${environment.apiUrl}${SOLICITUD.uploadAutorizacion}`,
    });

    this.uploader2.uploadAll();
    this.uploader2.response.subscribe((res: string) => {
      const result: Comun = JSON.parse(res);
      if (result.tipo == 1) {
        this.dataXml.forEach(el => {
          el.idTipoArchivo = 11;
          el.archivoSustento = result.mensaje;
        });
        this.procesarAut = false;
        this.utilsService.showNotification('Documento cargado correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
      } else if (result.tipo === 2) {
        this.utilsService.showNotification(result.mensaje, 'Alerta', 2);
        this.utilsService.blockUIStop();
      } else {
        this.utilsService.showNotification(result.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
      }
    });
  }

  onEliminarRepetidas(): void {
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

  onMensajeValidacion(msg): void {
    Swal.fire({
      title: 'No Coincide',
      //text: msg,
      html: msg,
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

  onCancelar(): void {
    this.submitted = false;
    this.modalService.dismissAll();
    this.idTipoOperacion = 1;
    this.facCheck = true;
    this.onRadioChange('Factoring', 1, false, '');
  }

  onClienteObtener(id, ruc, razon): void {
    this.contacto = [];
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesFormService.clienteObtener({
      idCliente: id
    }).subscribe(response => {
      if (this.idTipoOperacion == 3) {
        this.contacto = response.clienteContacto;
      } else {
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
            this.capitalTrabajoForm.controls.tasaMensual.setValue(item.tasaNominalMensual);
            this.capitalTrabajoForm.controls.tasaAnual.setValue(item.tasaNominalAnual);
            this.capitalTrabajoForm.controls.tasaMoraMensual.setValue(item.tasaNominalMensualMora);
            this.capitalTrabajoForm.controls.tasaMoraAnual.setValue(item.tasaNominalAnualMora);
            this.capitalTrabajoForm.controls.usarGastosContrato.setValue(true);
            this.capitalTrabajoForm.controls.usarGastoVigenciaPoder.setValue(true);
            this.capitalTrabajoForm.controls.contrato.setValue(item.gastosContrato);
            this.capitalTrabajoForm.controls.cartaNotarial.setValue(item.comisionCartaNotarial);
            this.capitalTrabajoForm.controls.servicioCobranza.setValue(item.servicioCobranza);
            this.capitalTrabajoForm.controls.servicioCustodia.setValue(item.servicioCustodia);
            this.capitalTrabajoForm.controls.financiamiento.setValue(item.financiamiento);
            this.capitalTrabajoForm.controls.comisionEstructuracion.setValue(item.comisionEstructuracion);
          }
        } else {
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
          this.capitalTrabajoForm.controls.tasaMoraMensual.setValue(0);
          this.capitalTrabajoForm.controls.tasaMoraAnual.setValue(0);
          this.capitalTrabajoForm.controls.cartaNotarial.setValue(0);
          this.capitalTrabajoForm.controls.servicioCobranza.setValue(0);
          this.capitalTrabajoForm.controls.servicioCustodia.setValue(0);
          this.capitalTrabajoForm.controls.financiamiento.setValue(0);
          this.capitalTrabajoForm.controls.comisionEstructuracion.setValue(0);
        }
      }
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onTablaMaestra(idTabla, idColumna = 0): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesFormService.listarTablaMaestra({
      idTabla: idTabla,
      idColumna: idColumna
    }).subscribe(response => {
      if (idTabla == 1) {
        this.optMoneda = response;
      } else if (idTabla == 5) {
        this.optTipo = response;
      } else {
        this.igvCT = response[0].valor;
        this.capitalTrabajoForm.controls.igvCT.setValue(this.igvCT);
      }
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  calcularFP(idTipo: number = 0): void {
    let fecha = new Date();
    let diasEfectivo = 0;
    if (idTipo == 2) {
      fecha.setHours(0, 0, 0, 0);
      let fecConfirmado = new Date(this.fechaPagoCT.year,
        this.fechaPagoCT.month - 1,
        this.fechaPagoCT.day, 0, 0, 0);
      let diffTime = Math.abs(fecha.getTime() - fecConfirmado.getTime());
      diasEfectivo = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTimeout(() => {
        this.capitalTrabajoForm.controls.diasPrestamo.setValue(diasEfectivo);
        this.onCalcularCT();
      }, 0);
    } else {
      fecha.setDate(fecha.getDate() + Number(this.capitalTrabajoForm.controls.diasPrestamo.value) - 1);

      let date = {
        year: fecha.getFullYear(),
        month: fecha.getMonth() + 1,
        day: fecha.getDate()
      }
      this.capitalTrabajoForm.controls.fechaPago.setValue(date);
      this.onCalcularCT();
    }
  }

  onChangeMoneda(): void {
    this.ruc = '';
    this.razonSocial = '';
    this.capitalTrabajoForm.controls.ruc.setValue('');
    this.capitalTrabajoForm.controls.razonSocial.setValue('');
    this.capitalTrabajoForm.controls.tasaAnual.setValue(0);
    this.capitalTrabajoForm.controls.tasaMensual.setValue(0);
    this.capitalTrabajoForm.controls.cartaNotarial.setValue(0);
    this.capitalTrabajoForm.controls.servicioCobranza.setValue(0);
    this.capitalTrabajoForm.controls.servicioCustodia.setValue(0);
    this.tasaNominalMensual = 0;
    this.tasaNominalAnual = 0;
    this.tasaNominalMensualMora = 0;
    this.tasaNominalAnualMora = 0;
    this.financiamiento = 0;

    this.capitalTrabajoForm.controls.mcTrabajo.setValue(0);
    this.capitalTrabajoForm.controls.ctSolicitado.setValue(0);
    this.capitalTrabajoForm.controls.diasPrestamo.setValue(0);
    this.capitalTrabajoForm.controls.iIncluidoIGV.setValue(0);
    this.capitalTrabajoForm.controls.gIncluidoIGV.setValue(0);
    this.capitalTrabajoForm.controls.tFacturarIGV.setValue(0);
    this.capitalTrabajoForm.controls.tDesembolsoIGV.setValue(0);
  }

  onCalcularCT(): void {
    let TNM, TNA, nroDias, mDescontar, intereses, montoSolicitado, totFacturar, fondoResguardo = 0;
    let comisionEstructuracion, contrato, servicioCustodia, servicioCobranza, cartaNotarial, gDiversonsSIgv, gDiversonsCIgv, gastoIncluidoIGV, comisionEstructuracionCIGV;
    let netoSolicitado = 0, IGV;

    comisionEstructuracion = this.capitalTrabajoForm.controls.comisionEstructuracion.value;
    contrato = this.capitalTrabajoForm.controls.contrato.value;
    servicioCustodia = this.capitalTrabajoForm.controls.servicioCustodia.value;
    servicioCobranza = this.capitalTrabajoForm.controls.servicioCobranza.value;
    cartaNotarial = this.capitalTrabajoForm.controls.cartaNotarial.value;
    TNM = this.capitalTrabajoForm.controls.tasaMensual.value;
    TNA = this.capitalTrabajoForm.controls.tasaAnual.value;
    nroDias = this.capitalTrabajoForm.controls.diasPrestamo.value;
    montoSolicitado = this.capitalTrabajoForm.controls.ctSolicitado.value;
    gDiversonsSIgv = contrato + servicioCustodia + servicioCobranza + cartaNotarial;
    IGV = this.igvCT / 100;
    comisionEstructuracionCIGV = (montoSolicitado * (comisionEstructuracion / 100)) * (IGV + 1);

    if (this.idTipo == 1) {
      let a = (nroDias * (((TNM / 100) * 12) / 360) * (IGV + 1));
      let netoConfirmado = (montoSolicitado + (gDiversonsSIgv * (IGV + 1))) / (1 - ((100 - this.financiamiento) / 100) - a - ((comisionEstructuracion / 100) * (IGV + 1)) + (a * ((100 - this.financiamiento) / 100)));
      fondoResguardo = netoConfirmado - ((netoConfirmado * this.financiamiento) / 100);
      netoSolicitado = netoConfirmado - fondoResguardo; //((360 * montoSolicitado) + (360 * (gDiversonsSIgv * (IGV + 1)))) / (360 - ((nroDias * ((TNM / 100) * 12)) * (IGV + 1)));
      mDescontar = ((360 * netoSolicitado) + (360 * gDiversonsSIgv)) / (360 - ((nroDias * (TNM * 12)) * (IGV + 1)));
      intereses = netoSolicitado * ((TNA / 100) / 360) * nroDias * (IGV + 1);
      gDiversonsCIgv = gDiversonsSIgv * IGV;
      gastoIncluidoIGV = gDiversonsSIgv + gDiversonsCIgv + comisionEstructuracionCIGV;
      totFacturar = intereses + gastoIncluidoIGV;

      this.capitalTrabajoForm.controls.fondoResguardo.setValue(Math.round((fondoResguardo + Number.EPSILON) * 100) / 100);
      this.capitalTrabajoForm.controls.netoSolicitado.setValue(Math.round((netoSolicitado + Number.EPSILON) * 100) / 100);
      this.capitalTrabajoForm.controls.montoDesc.setValue(Math.round((mDescontar + Number.EPSILON) * 100) / 100);
      this.capitalTrabajoForm.controls.iIncluidoIGV.setValue(Math.round((intereses + Number.EPSILON) * 100) / 100);
      this.capitalTrabajoForm.controls.gIncluidoIGV.setValue(Math.round((gastoIncluidoIGV + Number.EPSILON) * 100) / 100);
      this.capitalTrabajoForm.controls.tFacturarIGV.setValue(Math.round((totFacturar + Number.EPSILON) * 100) / 100);
      this.capitalTrabajoForm.controls.tDesembolsoIGV.setValue(Math.round((montoSolicitado + Number.EPSILON) * 100) / 100);
    } else {
      fondoResguardo = montoSolicitado - ((montoSolicitado * this.financiamiento) / 100);
      netoSolicitado = montoSolicitado - fondoResguardo;

      gDiversonsCIgv = gDiversonsSIgv * IGV;
      intereses = netoSolicitado * ((TNA / 100) / 360) * (nroDias) * (IGV + 1);
      gastoIncluidoIGV = gDiversonsSIgv + gDiversonsCIgv + comisionEstructuracionCIGV;
      totFacturar = intereses + gastoIncluidoIGV;

      this.capitalTrabajoForm.controls.fondoResguardo.setValue(Math.round((fondoResguardo + Number.EPSILON) * 100) / 100);
      this.capitalTrabajoForm.controls.netoSolicitado.setValue(Math.round((netoSolicitado + Number.EPSILON) * 100) / 100);
      this.capitalTrabajoForm.controls.iIncluidoIGV.setValue(Math.round((intereses + Number.EPSILON) * 100) / 100);
      this.capitalTrabajoForm.controls.gIncluidoIGV.setValue(Math.round((gastoIncluidoIGV + Number.EPSILON) * 100) / 100);
      this.capitalTrabajoForm.controls.tFacturarIGV.setValue(Math.round((totFacturar + Number.EPSILON) * 100) / 100);
      this.capitalTrabajoForm.controls.tDesembolsoIGV.setValue(Math.round(((netoSolicitado + Number.EPSILON) - totFacturar) * 100) / 100);
    }

  }

  validacionCT(): void {
    // let montoCT, ctSolicitado;
    // montoCT = Number(this.capitalTrabajoForm.controls.mcTrabajo.value);
    // ctSolicitado = Number(this.capitalTrabajoForm.controls.ctSolicitado.value);

    this.onCalcularCT();
  }

  onGenerarCarpeta(data): void {
    this.solicitudesFormService.generarCarpeta(data).subscribe(response => {
      this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onGenerarPlantilla(): void {
    let reportURL = environment.apiUrl + SOLICITUD.plantilla;
    window.location.href = reportURL;
  }

  onEliminarFactura(item): void {
    item.remove();
    let archivo = item?.file?.name.substring(0, item?.file?.name.length - 4);
    let id = 0;
    for (const arch of this.uploader.queue) {
      if (arch?.file?.name.includes(archivo)) {
        arch.remove();
        break;
      }
    }

    for (const row of this.dataXml) {
      if (row.nombreXML.includes(archivo)) {
        this.dataXml.splice(id, 1)
      }
      id = id + 1;
    }
  }

  onActualizarCampo(item, tipo): void {
    if (tipo == 1) {
      if (item.direccionCab != null && item.direccionCab != '') {
        item.estadoDireccionCab = 2;
      } else {
        item.estadoDireccionCab = 0;
      }
    }
    if (tipo == 2) {
      item.estadoUbigeoCab = 2;
      if (item.codigoUbigeoCab != null && item.codigoUbigeoCab != '' && item.codigoUbigeoCab.length == 6) {
        item.estadoUbigeoCab = 2;
      } else {
        item.estadoUbigeoCab = 0;
      }
    }
    if (tipo == 3) {
      if (item.direccionDet != null && item.direccionDet != '') {
        item.estadoDireccionDet = 2;
      } else {
        item.estadoDireccionDet = 0;
      }
    }
    if (tipo == 4) {
      if (item.codigoUbigeoDet != null && item.codigoUbigeoDet != '' && item.codigoUbigeoDet.length == 6) {
        item.estadoUbigeoDet = 2;
      } else {
        item.estadoUbigeoDet = 0;
      }
    }
  }

  async onConsultarSunat(): Promise<void> {
    // dataXml
    this.utilsService.blockUIStart(`Consultando data cliente...`);
    const response = await this.sunatService.genToken({
      usuario: 'sunat',
      clave: 'cX5sZnNpJf9gbhmPUL'
    }).then((response) => response, error => [])
      .catch(error => []);

    if (response.data) {
      let count: number = 1;
      const responseClient = await this.sunatService.getData2({
        ruc: this.ruc,
        token: response.data
      }).then((response) => response, error => [])
        .catch(error => []);

      for (const row of this.dataXml) {

        this.utilsService.blockUIStart(`Consultando data pagador/proveedor ${count} de ${this.dataXml.length}`);
        const responseDet = await this.sunatService.getData2({
          ruc: this.idTipoOperacion === 1 ? row.rucDet : row.rucCab,
          token: response.data
        }).then((response) => response, error => [])
          .catch(error => []);

        if (this.idTipoOperacion === 1) {
          if (row.estadoUbigeoCab === 0) {
            row.codigoUbigeoCab = responseClient.data.length ? responseClient.data[0].ubigeo : '';
            row.estadoUbigeoCab = row.codigoUbigeoCab !== '' ? 2 : 0;
          }

          if (row.estadoDireccionCab === 0) {
            row.direccionCab = this.utilsService.getSunat_Direccion(responseClient.data.length ? responseClient.data.length[0] : null);
            row.estadoDireccionCab = row.direccionCab !== '' ? 2 : 0;
          }

          if (row.estadoUbigeoDet === 0) {
            row.codigoUbigeoDet = responseDet.data.length ? responseDet.data[0].ubigeo : '';
            row.estadoUbigeoDet = row.codigoUbigeoDet !== '' ? 2 : 0;
          }

          if (row.estadoDireccionDet === 0) {
            row.direccionDet = this.utilsService.getSunat_Direccion(responseDet.data.length ? responseDet.data[0] : null);
            row.estadoDireccionDet = row.direccionDet !== '' ? 2 : 0;
          }
        }
        else {
          if (row.estadoUbigeoCab === 0) {
            row.codigoUbigeoCab = responseDet.data.length ? responseDet.data[0].ubigeo : '';
            row.estadoUbigeoCab = row.codigoUbigeoCab !== '' ? 2 : 0;
          }

          if (row.estadoDireccionCab === 0) {
            row.direccionCab = this.utilsService.getSunat_Direccion(responseDet.data.length ? responseDet.data[0] : null);
            row.estadoDireccionCab = row.direccionCab !== '' ? 2 : 0;
          }

          if (row.estadoUbigeoDet === 0) {
            row.codigoUbigeoDet = responseClient.data.length ? responseClient.data[0].ubigeo : '';
            row.estadoUbigeoDet = row.codigoUbigeoDet !== '' ? 2 : 0;
          }

          if (row.estadoDireccionDet === 0) {
            row.direccionDet = this.utilsService.getSunat_Direccion(responseClient.data.length ? responseClient.data[0] : null);
            row.estadoDireccionDet = row.direccionDet !== '' ? 2 : 0;
          }
        }
        count++;
        this.utilsService.blockUIStop();
      }
    }
    this.utilsService.blockUIStop();
  }

}
