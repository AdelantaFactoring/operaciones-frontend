import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {CoreConfigService} from "../../../@core/services/config.service";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntil} from "rxjs/operators";
import {User} from "../../shared/models/auth/user";
import { UtilsService } from 'app/shared/services/utils.service';
import { LoginService } from './login.service';
import { menu } from 'app/shared/models/menu/menu';
import { Menu } from 'app/shared/models/seguridad/menu';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
//  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private utilsService: UtilsService,
    private loginService: LoginService,
    private _coreMenuService: CoreMenuService,
    //private _authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    // if (this._authenticationService.currentUserValue) {
    //   this._router.navigate(['/']);
    // }

    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // // Login
    // //this.loading = true;
    // sessionStorage.setItem('currentUser', JSON.stringify(new User()))
    // this._router.navigate(['/comercial/solicitudes/']);
    // // this._authenticationService
    // //   .login(this.f.email.value, this.f.password.value)
    // //   .pipe(first())
    // //   .subscribe(
    // //     data => {
    // //       this._router.navigate([this.returnUrl]);
    // //     },
    // //     error => {
    // //       this.error = error;
    // //       this.loading = false;
    // //     }
    // //   );
    this.iniciarSesion(false);

  }

  iniciarSesion(gmail: boolean): void {
    this.utilsService.blockUIStart('Iniciando sesión...');

    this.loading = true;
    this.loginService.login({
      idEmpresa: 1,
      // usuario: (gmail) ? this.socialUser.email : this.f.email.value,
      usuarioLogin: this.f.email.value,
      clave: this.f.password.value,
      google: gmail
    }).subscribe((response: User[]) => {
      
      if (response.length > 0) {
        // if (response.idUsuario != 0 && response.usuarioAsociacion.length > 0) {
        //   if (response.foto) {
        //     response.foto = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + response.foto);
        //   }

          sessionStorage.setItem('currentUser', JSON.stringify(response[0]));
          sessionStorage.setItem('currentUserPermission', JSON.stringify(response[0].menu));
          //console.log('ingrese');
          //sessionStorage.setItem('currentUser', JSON.stringify(new User()))
          // let menuUusario = JSON.parse(JSON.stringify(response[0].menu));
          // let _menus = menu;
          // let _menusCurrent = [];
          // for (let i = 0; i < _menus.length; i++) {
              
          //   const _menu = Object.create(_menus[i]);
          //   // if (_menu.id == "dashboard") {
          //   //   _menusCurrent.push(_menu);
          //   //   continue;
          //   // }
          //   _menu.children = [];
          //   let _menuHasChildren = false;
          //   for (let j = 0; j < _menus[i].children.length; j++) {
          //     const __menu = Object.create(_menus[i].children[j]);
          //     // const __menuUser = _userMenus.find(x => x.idMenu == Number(__menu.id));
              
          //     for (const item of menuUusario) {
          //       if (item.idMenu == Number(__menu.id) && item.acceso == true) {
                  
          //         _menu.children.push(__menu);
          //         _menuHasChildren = true;
          //         break;
          //       }
          //     }
          //     const __menuUser = null;
          //     // if (__menuUser != null) {
          //     //   _menu.children.push(__menu);
          //     //   _menuHasChildren = true;
          //     // } else {
          //     //   // _menus[i].children.splice(j, 1);
          //     //   // j--;
          //     // }
          //   }
          //   if (_menuHasChildren) {
          //     _menusCurrent.push(_menu);
          //   } else {
          //     // _menus.splice(i, 1);
          //     // i--;
          //   }
          // }
          // this.utilsService.setMenus(_menusCurrent);
          // this._coreMenuService.unregister('main');
          // this._coreMenuService.register('main', _menusCurrent);
          // this._coreMenuService.setCurrentMenu('main');

          this._router.navigate(['/comercial/solicitudes/']);

        //   this.guardarInformacionExtra(response);

        //   this._router.navigate(['/dashboard/principal']);
        // } else {
        //   this.error = "Inicio de sesión incorrecto";
        // }
      } else {
        this.error = "Inicio de sesión incorrecto";
      }

      this.loading = false;

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.loading = false;
      this.utilsService.blockUIStop();
    });
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['admin@demo.com', [Validators.required]],
      password: ['admin', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
