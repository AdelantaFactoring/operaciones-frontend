import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ToastrService} from 'ngx-toastr';
import {Menu} from '../models/auth/user';
import {FormControl} from "@angular/forms";
import {TablaMaestra} from "../models/shared/tabla-maestra";
import {RequestMethod} from "../helpers/request-method";
import {Observable} from "rxjs";

class Mes {
  idMes: number;
  mes: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  @BlockUI() blockUI: NgBlockUI;

  meses: Mes[] = [];
  private requestMethod = new RequestMethod();

  constructor(
    private toastr: ToastrService
  ) {
  }

  showNotification(message: string, title: string, idType: number): void {
    if (idType === 1) {
      this.toastr.success(message, title, {
        progressBar: true,
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    } else if (idType === 2) {
      this.toastr.warning(message, title, {
        progressBar: true,
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    } else if (idType === 3) {
      this.toastr.error(message, title, {
        progressBar: true,
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    }
  }

  blockUIStart(message: string): void {
    this.blockUI.start(message);
  }

  blockUIStop(): void {
    this.blockUI.stop();
  }

  mesCombo(): Mes[] {
    this.meses = [
      {
        idMes: 1,
        mes: 'Enero'
      },
      {
        idMes: 2,
        mes: 'Febrero'
      },
      {
        idMes: 3,
        mes: 'Marzo'
      },
      {
        idMes: 4,
        mes: 'Abril'
      },
      {
        idMes: 5,
        mes: 'Mayo'
      },
      {
        idMes: 6,
        mes: 'Junio'
      },
      {
        idMes: 7,
        mes: 'Julio'
      },
      {
        idMes: 8,
        mes: 'Agosto'
      },
      {
        idMes: 9,
        mes: 'Setiembre'
      },
      {
        idMes: 10,
        mes: 'Octubre'
      },
      {
        idMes: 11,
        mes: 'Noviembre'
      },
      {
        idMes: 12,
        mes: 'Diciembre'
      }
    ];

    return this.meses;
  }

  autoIncrement(array: any[]): number {
    const ids = array.map(m => m.idFila);

    if (ids.length > 0) {
      const sorted = ids.sort((a, b) => a - b);
      return sorted[sorted.length - 1] + 1;
    }
    return 1;
  }

  formatoFecha_YYYYMMDD($event: any): string {
    if ($event === null)
      return null;

    return `${$event.year}${String($event.month).padStart(2, "0")}${String($event.day).padStart(2, "0")}`;
  }

  formatoFecha_YYYYMM($event: any): string {
    if ($event === null)
      return null;

    return `${$event.year}${String($event.month).padStart(2, "0")}`;
  }

  getAccess(idMenu): Menu {// '/module/component/'
    //const url = router.routerState.snapshot.url;
    let router: Router;
    const _menus = this.getUserMenus();
    const _menu = _menus.find(x => x.idMenu == idMenu);
    //console.log('menu', _menus);

    if (_menu.acceso == false) {
      //console.log('access not found');
      router.navigate(['miscellaneous/not-authorized']);
    }

    return _menu;
  }

  getUserMenus(): Menu[] {
    if (this.isAuth())
      return JSON.parse(sessionStorage.getItem('currentUserPermission'));
    else return null;
    //  JSON.parse(sessionStorage.getItem('currentUser'));
  }

  isAuth(): boolean {
    return sessionStorage.getItem('currentUser') ? true : false;
  }

  setMenus(data: any) {
    sessionStorage.setItem('menus', JSON.stringify(data));
  }

  nameValidator(control: FormControl): { [key: string]: boolean } {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\=\[\]{};:"\\|,<>\/?]/;
    if (control.value && nameRegexp.test(control.value)) {
      return {invalidName: true};
    }
  }

  // nameValidator(control: FormControl): { [key: string]: boolean } {
  //   const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  //   if (control.value && nameRegexp.test(control.value)) {
  //     return { invalidName: true };
  //   }
  // }

  agregarTodos(idTabla: number, tabla: TablaMaestra[]): TablaMaestra[] {
    tabla.push({
      idTabla: idTabla,
      idColumna: 0,
      valor: '',
      descripcion: '(Todos)'
    });

    // @ts-ignore
    return [...tabla.sort((a, b) => a.idColumna - b.idColumna)];
  }

  descargarArchivo(url: string): void {
    this.requestMethod.get(url, null, {responseType: 'blob'})
      .subscribe((res: Response) => {
        console.log(res);
        let a = document.createElement("a");
        a.href = URL.createObjectURL(res);
        console.log(a.href);
        a.download = "file";
        a.click();
      })
  }
}
