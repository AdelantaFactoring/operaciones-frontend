import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'app/shared/services/utils.service';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import {User} from "../../../shared/models/auth/user";
import { TipoCambioService } from './tipo.cambio.service';
import Swal from 'sweetalert2';

const I18N_VALUES = {
  'es': {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
    weekLabel: 'sem'
  }
  // other languages you would support
};
@Injectable()
export class I18n {
  language = 'es';
}
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  constructor(private _i18n: I18n) { super(); }

  getWeekdayShortName(weekday: number): string { return I18N_VALUES[this._i18n.language].weekdays[weekday - 1]; };
  getWeekdayLabel(weekday: number): string { return I18N_VALUES[this._i18n.language].weekdays[weekday - 1]; }
  getWeekLabel(): string { return I18N_VALUES[this._i18n.language].weekLabel; }
  getMonthShortName(month: number): string { return I18N_VALUES[this._i18n.language].months[month - 1]; }
  getMonthFullName(month: number): string { return this.getMonthShortName(month); }
  getDayAriaLabel(date: NgbDateStruct): string { return `${date.day}-${date.month}-${date.year}`; }
}

@Component({
  selector: 'app-tipo-cambio',
  templateUrl: './tipo-cambio.component.html',
  styleUrls: ['./tipo-cambio.component.scss'],
  providers:
    [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
})
export class TipoCambioComponent implements OnInit {
  public contentHeader: object;
  public currentUser: User;
  public currentDate = new Date();
  public filterDate = new Date();
  public fromDate = {
    year: this.currentDate.getFullYear(),
    month: this.currentDate.getMonth() + 1,
    day: 1
  };
  public toDate = {
    year: this.currentDate.getFullYear(),
    month: this.currentDate.getMonth() + 1,
    day: this.currentDate.getDate()
  };

  public fechaInicio = {
    year: this.currentDate.getFullYear(),
    month: this.currentDate.getMonth() + 1,
    day: this.currentDate.getDate()
  };

  forPageOptions = [10, 25, 50, 100];
  tableDefaultOptions = {
    searchString: '',
    colletionSize: 0,
    page: 1,
    pageSize: 10
  };

  documentosSettings = { ...this.tableDefaultOptions };
  rowsTipoCambio = [];

  public TipoCambioForm: FormGroup;
  headertext: string;

  get TControls(): { [p: string]: AbstractControl } {
    return this.TipoCambioForm.controls;
  }

  constructor(
    private utilsService: UtilsService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private tipoCambioService: TipoCambioService
  ) {
    this.contentHeader = {
      headerTitle: 'Tipo Cambio',
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
            name: 'Catálogos',
            isLink: false,
            link: '/'
          },
          {
            name: 'Tipo Cambio',
            isLink: false
          }
        ]
      }
    };

    this.TipoCambioForm = this.formBuilder.group({
      idTipoCambio: [0],
      fecha: [''],
      precioCompra: ['', Validators.required],
      precioVenta: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.onSetTipoCambio();
  }

  onSetTipoCambio() {
    let fechadesdenum = 0, fechahastanum = 0;
    fechadesdenum = parseInt(this.fromDate.year.toString() + this.fromDate.month.toString().padStart(2, '0') + this.fromDate.day.toString().padStart(2, '0'));
    fechahastanum = parseInt(this.toDate.year.toString() + this.toDate.month.toString().padStart(2, '0') + this.toDate.day.toString().padStart(2, '0'));

    if (fechahastanum < fechadesdenum) {
      this.utilsService.showNotification('La FECHA HASTA no puede ser menor a la FECHA DESDE', 'Alerta', 2);
      return;
    }

    this.utilsService.blockUIStart('Obteniendo información...');
    this.tipoCambioService.listar({
      startDate: this.fromDate.year.toString() + this.fromDate.month.toString().padStart(2, '0') + this.fromDate.day.toString().padStart(2, '0'),
      endDate: this.toDate.year.toString() + this.toDate.month.toString().padStart(2, '0') + this.toDate.day.toString().padStart(2, '0'),
      idUsuario: 1,
      pageIndex: this.documentosSettings.page,
      pageSize: this.documentosSettings.pageSize
    }).subscribe(response => {
      this.rowsTipoCambio = response;
      this.documentosSettings.colletionSize = response[0] ? response[0].totalElements : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  Nuevo(NTC: NgbModal) {
    this.headertext = "Agregando Tipo Cambio";
    this.TControls.idTipoCambio.setValue(0);
    this.TControls.precioCompra.setValue('');
    this.TControls.precioVenta.setValue('');
    setTimeout(() => {
      this.modalService.open(NTC,
        {
          size: "md",
          scrollable: true,
          backdrop: 'static',
        }
      )
    }, 0);
  }

  Edit(NTC: NgbModal, row) {
    this.headertext = "Editando Tipo Cambio";
    this.TControls.idTipoCambio.setValue(row.idTipoCambio);
    this.TControls.precioCompra.setValue(row.precioCompra);
    this.TControls.precioVenta.setValue(row.precioVenta);
    setTimeout(() => {
      this.modalService.open(NTC,
        {
          size: "md",
          scrollable: true,
          backdrop: 'static',
        }
      )
    }, 0);
  }

  SaveTipoCambio(){
    if (this.TipoCambioForm.invalid) {
      return;
    }

    this.utilsService.blockUIStart('Guardando...');
    this.tipoCambioService.guardar({
      idTipoCambio: this.TControls.idTipoCambio.value,
      fecha: this.fechaInicio.year.toString() + this.fechaInicio.month.toString().padStart(2, '0') + this.fechaInicio.day.toString().padStart(2, '0'),
      precioCompra: this.TControls.precioCompra.value,
      precioVenta: this.TControls.precioVenta.value,
      idUsuarioAud: this.currentUser.idUsuario
    }).subscribe(response => {
      if (response.tipo === 1) {
        this.utilsService.showNotification('Informacion guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onSetTipoCambio();
        this.DismissModal();}    
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  DismissModal(){
    this.modalService.dismissAll();
  }
}
