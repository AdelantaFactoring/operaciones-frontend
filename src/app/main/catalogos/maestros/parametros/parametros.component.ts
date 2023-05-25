import {Component, OnInit} from '@angular/core';
import {User} from "../../../../shared/models/auth/user";
import {UtilsService} from "../../../../shared/services/utils.service";
import {MaestrosService} from "../maestros.service";
import {TablaMaestra} from "../../../../shared/models/shared/tabla-maestra";

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})
export class ParametrosComponent implements OnInit {
  public currentUser: User;
  public contentHeader: any;
  public tablaMaestra: TablaMaestra[] = [];
  public oldMaestro: TablaMaestra;

  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  private idTabla: number = 1000;
  public correos: any[] = [];
  public valores: any[] = [];
  public bValor: boolean = false;

  public numeros: number[] = [2, 3];
  public booleanos: number[] = [1, 12, 13];
  public items: number[] = [4, 5, 14];

  constructor(private utilsService: UtilsService,
              private maestrosService: MaestrosService) {
    this.contentHeader = {
      headerTitle: 'Parámetros Generales',
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
            isLink: false
          },
          {
            name: 'Maestros',
            isLink: false
          },
          {
            name: 'Parámetros Generales',
            isLink: false
          }
        ]
      }
    };
  }

  ngOnInit(): void {
    this.onListar();
  }

  onListar(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.maestrosService.listar({
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize,
      idTabla: this.idTabla
    }).subscribe(async (response: TablaMaestra[]) => {
      this.tablaMaestra = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onEditar(item: TablaMaestra): void {
    if (this.tablaMaestra.filter(f => f.edicion).length > 0) {
      this.utilsService.showNotification("Termine una edición primero.", 'alerta', 2);
      return;
    }

    if (this.items.includes(item.idColumna)) {
      this.correos = [];
      this.valores = [];
      for (const el of item.valor.split(';')) {
        this.correos.push({name: el});
        this.valores.push({name: el});
      }
    } else if (this.booleanos.includes(item.idColumna)) {
      this.bValor = item.valor === '1';
    }

    this.oldMaestro = {...item};
    item.edicion = true;
  }

  onCancelar(item: TablaMaestra): void {
    item.valor = this.oldMaestro.valor;
    item.descripcion = this.oldMaestro.descripcion;
    item.edicion = this.oldMaestro.edicion;
  }

  async onConfirmarCambio(item: TablaMaestra): Promise<void> {
    if (await this.onGuardar(item)) {
      item.edicion = false;
    }
  }

  onCambioValor($event: any, item: TablaMaestra, tipo: number): void {
    switch (tipo) {
      case 2:
        let valores: string = '';
        for (const el of ($event as any[])) {
          valores += el.name + ";";
        }

        item.valor = valores.slice(0, valores.length - 1);
        break;
      case 3:
        item.valor = ($event as boolean) ? "1" : "0";
        break;
    }
  }

  validar(idColumna: number, tipo: number): boolean {
    let result: boolean;
    switch (tipo) {
      case 1:
        return this.numeros.includes(idColumna);
      case 2:
        return this.items.includes(idColumna);
      case 3:
        return this.booleanos.includes(idColumna);
    }

    return result;
  }

  private async onGuardar(item: TablaMaestra): Promise<boolean> {
    this.utilsService.blockUIStart("Guardando...");
    let response = await this.maestrosService.guardarAsync(item)
      .then((response: any) => response, error => null)
      .catch(error => null);

    let res = false;
    switch (response.tipo) {
      case 1:
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        res = true;
        break;
      case 2:
        this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
        this.utilsService.blockUIStop();
        res = false;
        break;
      default:
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
        res = false;
        break;
    }

    return res;
  }
}
