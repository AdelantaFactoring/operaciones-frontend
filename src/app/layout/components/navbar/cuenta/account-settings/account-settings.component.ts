import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from '../../../../../shared/services/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/shared/models/auth/user';
import { AccountSettingsService } from './account-settings.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Byte } from '@angular/compiler/src/util';
import { Location } from '@angular/common';
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
  nombreFoto: string;
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
    private accountSettingsService: AccountSettingsService,
    private _router: Router,
    private location: Location,
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
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      // email: ['', Validators.required],
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

  async onArchivoABase64(file): Promise<any> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async imageView(event): Promise<void> {
    const filecaptured = event.target.files[0];
    if (filecaptured != undefined) {
      this.nombreFoto = event.target.files[0].name;  
    
      this.base64(filecaptured).then((image: any) => {
        this.foto = image.base; 
      }) 
      let base64 = await this.onArchivoABase64(event.target.files[0]);
      this.fotoriginal = base64;   
    }
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
    this.usuario = this.currentUser.usuarioLogin;
    this.nombre = this.currentUser.nombre;
    this.apPaterno = this.currentUser.apellidoPaterno;
    this.apMaterno = this.currentUser.apellidoMaterno;
    this.foto = this.currentUser.base64;
    //this.email = this.currentUser.
  }

  onCambiarClave(): void {    
    this.DetailSubmitted = true;      
    if (this.CambiarContraseniaForm.invalid) {
      return;
    }
    this.utilsService.blockUIStart("Guardando nueva contraseña...");
    setTimeout(() => {
      this.utilsService.blockUIStop();        
      this.accountSettingsService.cambioClave({
        idEmpresa: this.currentUser.idEmpresa,
        idUsuario: this.currentUser.idUsuario,
        clave: this.claveActual,
        claveNueva: this.claveNueva
      }).subscribe(response => {
        if (response.tipo == 1) {
          this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
          //this.listarFoda();
          this.claveNueva = '';
          this.claveReNueva = '';
          this.DetailSubmitted = false;
        } else if (response.tipo == 2) {
          this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
        } else {
          this.utilsService.showNotification(response.mensaje, 'Error', 3);
        }
      }, error => {
        this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      });
    }, 2500);
  }

  onUpdateCuenta(): void {
    this.IDSubmitted = true;
    if (this.InsertUpdateForm.invalid) {
      return;
    }    
    this.utilsService.blockUIStart("Actualizando usuario...");
      this.accountSettingsService.ActualizarDatos({
        idEmpresa: this.currentUser.idEmpresa,
        idUsuario: this.currentUser.idUsuario,
        nombre: this.nombre,
        apellidoPaterno: this.apPaterno,
        apellidoMaterno: this.apMaterno,
        base64: this.fotoriginal ?? '',
        archivoFoto: this.nombreFoto ?? ''
      }).subscribe(response => {
        if (response.tipo == 1) {
          this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
          //this.onGetCuenta();
        } else if (response.tipo == 2) {
          this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
        } else {
          this.utilsService.showNotification(response.mensaje, 'Error', 3);
        }
      }, error => {
        this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      });
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
  }

  logout() {
    sessionStorage.removeItem("currentUser");
    this._router.navigate(['/auth/login']);
  }

  onQuitarFoto(): void{
    this.foto = '';
  }
  onCancelar(): void{
    this._router.navigate(['/comercial/solicitudes/']);
  }
}
