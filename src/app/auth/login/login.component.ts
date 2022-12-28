import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {CoreConfigService} from "../../../@core/services/config.service";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntil} from "rxjs/operators";
import {User} from "../../shared/models/auth/user";
import {UtilsService} from 'app/shared/services/utils.service';
import {LoginService} from './login.service';
import {menu} from 'app/shared/models/menu/menu';
import {Menu} from 'app/shared/models/seguridad/menu';
import {CoreMenuService} from '@core/components/core-menu/core-menu.service';

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
    private _coreMenuService: CoreMenuService
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
        sessionStorage.setItem('currentUser', JSON.stringify(response[0]));
        sessionStorage.setItem('currentUserPermission', JSON.stringify(response[0].menu));
        if (response[0].menu.filter(f => f.idMenu === 5 && f.acceso).length > 0)
          this._router.navigate(['/comercial/solicitudes/']);
        else if (response[0].menu.filter(f => f.acceso).length > 0) {
          let menu = response[0].menu.filter(f => f.acceso)[0];
          let _menu = this._coreMenuService.getCurrentMenu();
          let find: boolean = false;
          for (const m of _menu) {
            if (m.children.filter(f => f.id === String(menu.idMenu)).length > 0) {
              find = true;
              this._router.navigate([`/${m.children.find(f => f.id === String(menu.idMenu)).url}/`]);
              break;
            }
          }

          if (!find)
            this.error = "El usuario no tiene asignado ningún módulo del menú";
        }
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
      email: ['', Validators.required],
      password: ['', Validators.required]
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
