import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ContentHeader} from "../../../layout/components/content-header/content-header.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {Usuario} from "../../../shared/models/seguridad/usuario";
import {Auditoria} from "../../../shared/models/seguridad/auditoria";
import {UtilsService} from "../../../shared/services/utils.service";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";
import {AuditoriaService} from "./auditoria.service";
import * as fileSaver from 'file-saver';
import {UsuarioService} from "../usuario/usuario.service";
import {User} from "../../../shared/models/auth/user";

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent implements OnInit, AfterViewInit {
  @ViewChild('coreCard') coreCard;
  private currentUser: User;
  public contentHeader: ContentHeader;
  public filtroForm: FormGroup;
  private oldFiltroForm: FormGroup;
  public tablas: TablaMaestra[];
  public usuarios: Usuario[];
  public accion: TablaMaestra[];

  public pageSize: number = 10;
  public search: string = '';
  public collectionSize: number;
  public page: number = 1;
  public auditoria: Auditoria[] = [];

  private clearingForm: boolean;

  constructor(private utilsService: UtilsService,
              private formBuilder: FormBuilder,
              private tablaMaestraService: TablaMaestraService,
              private auditoriaService: AuditoriaService,
              private usuarioService: UsuarioService) {
    this.contentHeader = {
      headerTitle: 'Auditoría',
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
            name: 'Seguridad',
            isLink: false
          },
          {
            name: 'Auditoría',
            isLink: false
          }
        ]
      }
    };

    this.filtroForm = this.formBuilder.group({
      tabla: [0],
      desde: [{year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()}],
      hasta: [{year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()}],
      usuario: [0],
      accion: [0],
    });
    this.oldFiltroForm = this.filtroForm.value;
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.utilsService.blockUIStart('Obteniendo información de maestros...');
    this.tablas = this.utilsService.agregarTodos( 999, await this.onListarMaestros(999, 0));
    this.accion = this.utilsService.agregarTodos(998, await this.onListarMaestros(998, 0));
    this.utilsService.blockUIStop();
    this.onUsuarioCombo();
    this.onListar();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.coreCard.collapse();
      this.coreCard.onclickEvent.collapseStatus = true;
    }, 0);
  }

  onUsuarioCombo(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.usuarioService.combo({
      idEmpresa: this.currentUser.idEmpresa
    }).subscribe(response => {
      this.usuarios = response;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  async onListarMaestros(idTabla: number, idColumna: number): Promise<TablaMaestra[]> {
    return await this.tablaMaestraService.listar({
      idTabla: idTabla,
      idColumna: idColumna
    }).then((response: TablaMaestra[]) => response, error => [])
      .catch(error => []);
  }

  onLimpiarFiltro($event: string): void {
    if ($event === 'reload') {
      this.clearingForm = true;
      this.filtroForm.reset(this.oldFiltroForm);
      this.clearingForm = false;
      this.onListar();
    }
  }

  onListar(): void {
    if (this.clearingForm) return;
    this.utilsService.blockUIStart('Obteniendo información...');
    this.auditoriaService.listar({
      idTabla: this.filtroForm.get("tabla").value,
      desde: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.get("desde").value),
      hasta: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.get("hasta").value),
      idUsuario: this.filtroForm.get("usuario").value,
      idAccion: this.filtroForm.get("accion").value,
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: Auditoria[]) => {
      this.auditoria = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onExportar(): void {
    const desde = this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.get("desde").value);
    const hasta = this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.get("hasta").value);

    this.utilsService.blockUIStart('Exportando archivo...');
    this.auditoriaService.exportar({
      idTabla: this.filtroForm.get("tabla").value,
      desde: desde,
      hasta: hasta,
      idUsuario: this.filtroForm.get("usuario").value,
      idAccion: this.filtroForm.get("accion").value,
      search: this.search,
      pageIndex: 1,
      pageSize: 999999999
    }).subscribe(s => {
      let blob: any = new Blob([s], {type: 'application/vnd.ms-excel'});
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, `Auditoria_${desde}_${hasta}.xlsx`);
      this.utilsService.showNotification('Exportación satisfactoria', 'Confirmación', 1);
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }
}
