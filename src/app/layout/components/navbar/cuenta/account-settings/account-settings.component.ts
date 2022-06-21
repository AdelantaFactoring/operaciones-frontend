import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from '../../../../../shared/services/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { User } from 'app/shared/models/auth/user';
import { AccountSettingsService } from './account-settings.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Byte } from '@angular/compiler/src/util';
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {

  public view: string;
  public files: any = [];

  public claveForm: FormGroup;
  public contentHeader: object;
  public searchValue = '';
  public currentUser: User;
  public ColumnMode = ColumnMode;
  public avatarImage: string;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };
  forPageOptions = [10, 25, 50, 100];
  idAcceso: number;

  public passwordTextTypeOld: boolean;
  public passwordTextTypeNew: boolean;
  public passwordTextTypeEqual: boolean;
  //General
  usuario = '';
  nombre = '';
  email = '';
  apPaterno = '';
  apMaterno = '';
  idPersona: number;

  //Cambio de contraseña
  claveActual = '';
  claveNueva = '';
  claveReNueva = '';
  diferente: boolean;

  //auditoria
  idUsuarioAud: number;
  fechaCreacion = '';
  fechaModificacion = '';
  usuarioCreacion = '';
  usuarioModificacion = '';
  idsingtype: number;
  refresh: boolean;
  foto: any;
  value = 0;
  archivo :any;
  fotoriginal: any;
  //@ViewChild(DatatableComponent) table: DatatableComponent;

  public InsertUpdateForm: FormGroup;
  public CambiarContraseniaForm: FormGroup;

  public IDSubmitted = false;
  public DetailSubmitted = false;

  constructor(
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private accountSettingsService: AccountSettingsService
  ) {

    this.contentHeader = {
      headerTitle: 'Configurando Cuenta',
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
            name: 'Cuenta',
            isLink: false,
            link: '/'
          },
          {
            name: 'Configurando Cuenta',
            isLink: false
          }
        ]
      }
    };
    this.InsertUpdateForm = this.formBuilder.group({
      usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      email: ['', Validators.required],
    });

    this.CambiarContraseniaForm = this.formBuilder.group({
      actualcontrasenia: ['', Validators.required],
      nuevacontrasenia: ['', Validators.required],
      repitecontrasenia: ['', Validators.required]
    });
  }
  get ReactiveIUForm() {
    return this.InsertUpdateForm.controls;
  }

  get ReactiveContraseniaForm() {
    return this.CambiarContraseniaForm.controls;
  }

  start() {
    this.value = 1;
    this.refresh = false;
  }
  left() {
    this.value = 0;
    this.refresh = true;

  }

  ngOnInit(): void {
    this.value = 1;
    this.refresh = false;

    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    // if (this.currentUser.foto == null) {
    //   this.currentUser.foto = null;
    // }
    // else{
    //   this.currentUser.foto = this.currentUser.foto.changingThisBreaksApplicationSecurity;
    // }
    this.onGetCuenta();
  }

  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      
      reader.onload = (event: any) => {
        // this.currentUser.foto = event.target.result;
      };
      
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  imageView(event): any {    
    const filecaptured = event.target.files[0];
    this.base64(filecaptured).then((image: any) => {
      this.foto = image.base;      
      this.fotoriginal =this.foto.substr(23,99999999999999999);
    })        
  }

  base64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);            
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);            
      const reader = new FileReader();      
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve(
          {
            base: reader.result
          }
        );
      };
      
      reader.onerror = error => {
        resolve(
          {
            // blob: $event,
            // image,
            base: null
          }
        );
      };
    } catch (error) {
      return null;
    }
  })


  onCancelModal(): void {
    this.IDSubmitted = false;
    this.DetailSubmitted = false;
    this.modalService.dismissAll();
  }

  onGetCuenta(): void {
    // this.accountSettingsService.getCuenta({
    //   idAsociacion: this.currentUser.idAsociacion,
    //   idUsuario: this.currentUser.idUsuario
    // }).subscribe(response => {
    //   this.usuario = response[0].usuario;
    //   this.nombre = response[0].nombres;
    //   this.email = response[0].email;
    //   this.apPaterno = response[0].apellidoPaterno;
    //   this.apMaterno = response[0].apellidoMaterno;
    //   this.claveActual = response[0].clave;
    //   this.idPersona = response[0].idPersona;
    // });
  }

  onCambiarClave(): void {    
    // this.DetailSubmitted = true;      
    // if (this.CambiarContraseniaForm.invalid) {
    //   return;
    // }
    // this.utilsService.blockUIStart("Guardando nueva contraseña...");
    // setTimeout(() => {
    //   this.utilsService.blockUIStop();     
    //   if (this.claveActual == "" || this.claveNueva == "") {
    //     this.utilsService.showNotification('No se guardo la información', 'Dejaste un campo vacío.', 2)
    //   }     
    //   this.accountSettingsService.updateClave({
    //     idAsociacion: this.currentUser.idAsociacion,
    //     idUsuario: this.currentUser.idUsuario,
    //     claveAntigua: this.claveActual,
    //     claveNueva: this.claveNueva
    //   }).subscribe(response => {
    //     if (response.tipo == 1) {
    //       this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
    //       //this.listarFoda();
    //       this.claveNueva = '';
    //       this.claveReNueva = '';
    //     } else if (response.tipo == 2) {
    //       this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
    //     } else {
    //       this.utilsService.showNotification(response.mensaje, 'Error', 3);
    //     }
    //   }, error => {
    //     this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
    //   });
    // }, 2500);
  }

  onUpdateCuenta(): void {
    this.IDSubmitted = true;
    if (this.InsertUpdateForm.invalid) {
      return;
    }    
    this.utilsService.blockUIStart("Actualizando usuario...");
    // setTimeout(() => {      
    //   this.utilsService.blockUIStop();      
    //   if (this.nombre == "" || this.apPaterno == "" || this.apMaterno == "" || this.email == "" || this.usuario == "") {
    //     this.utilsService.showNotification('No se guardo la información', 'Dejaste un campo vacío.', 2)
    //   }      
    //   this.accountSettingsService.updateCuenta({
    //     idAsociacion: this.currentUser.idAsociacion,
    //     usuario: this.usuario,
    //     idPersona: this.idPersona,
    //     nombres: this.nombre,
    //     apellidoPaterno: this.apPaterno,
    //     apellidoMaterno: this.apMaterno,
    //     email: this.email,
    //     foto: this.fotoriginal,
    //     idUsuario: this.currentUser.idUsuario
    //   }).subscribe(response => {
    //     if (response.tipo == 1) {
    //       this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
    //       this.onGetCuenta();
    //     } else if (response.tipo == 2) {
    //       this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
    //     } else {
    //       this.utilsService.showNotification(response.mensaje, 'Error', 3);
    //     }
    //   }, error => {
    //     this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
    //   });
    // }, 2000);
  }

  mostrarClave(value) {
    if (value == 1) {
      this.passwordTextTypeOld = !this.passwordTextTypeOld;
    }
    else if (value == 2) {
      this.passwordTextTypeNew = !this.passwordTextTypeNew;
    }
    else {
      this.passwordTextTypeEqual = !this.passwordTextTypeEqual;
    }
  }

  onChangeValidar(): void {
    if (this.claveNueva != this.claveReNueva) {
      this.diferente = true;
    }
    else {
      this.diferente = false;
    }
    // if (this.loginForm.invalid) {
    //   return;
    // }
  }
}
