import {Component, OnInit} from '@angular/core';
import {ContentHeader} from "../../../layout/components/content-header/content-header.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import { TablaMaestra } from 'app/shared/models/shared/tabla-maestra';
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";
import {UtilsService} from "../../../shared/services/utils.service";
import {CavaliService} from "./cavali.service";
import {SolicitudCavali} from "../../../shared/models/operaciones/solicitud-cavali";
import { User } from 'app/shared/models/auth/user';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cavali',
  templateUrl: './cavali.component.html',
  styleUrls: ['./cavali.component.scss']
})
export class CavaliComponent implements OnInit {
  public currentUser: User;
  public contentHeader: ContentHeader;
  public filtroForm: FormGroup;
  public oldFiltroForm: FormGroup;
  public solicitudes: SolicitudCavali[];

  public operationType: TablaMaestra[] = [];
  public state: TablaMaestra[] = [];

  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  public filterFecha: any;
  constructor(private formBuilder: FormBuilder,
              private tablaMaestraService: TablaMaestraService,
              private utilsService: UtilsService,
              private cavaliService: CavaliService,
              private calendar: NgbCalendar,) {
    this.contentHeader = {
      headerTitle: 'Cavali',
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
            name: 'Operaciones',
            isLink: false
          },
          {
            name: 'Cavali',
            isLink: false
          }
        ]
      }
    };
    this.filtroForm = formBuilder.group({
      nroDocumento: [''],
      tipoProceso: [0],
      estado: [0],
      fechaDesde: [''],
      fechaHasta: ['']
    });
    this.oldFiltroForm = this.filtroForm.value;

    let fecha = new Date();
    fecha.setDate(fecha.getDate() -  Number(5));
    this.filterFecha = {
      desde: {
        year: fecha.getFullYear(),
        month: fecha.getMonth() + 1,
        day: fecha.getDate()
      },
      hasta: this.calendar.getToday()
    };
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.utilsService.blockUIStart("Obteniendo información de maestros...");
    this.operationType = this.utilsService.agregarTodos(27, await this.onListarMaestros(27, 0));
    this.state = this.utilsService.agregarTodos(28, await this.onListarMaestros(28, 0));
    this.utilsService.blockUIStop();
    this.onListarCavali();
  }

  async onListarMaestros(idTabla: number, idColumna: number): Promise<TablaMaestra[]> {
    return await this.tablaMaestraService.listar({
      idTabla: idTabla,
      idColumna: idColumna
    }).then((response: TablaMaestra[]) => response, error => [])
      .catch(error => []);
  }

  onListarCavali(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.cavaliService.listar({
      nroDocumento: this.filtroForm.controls.nroDocumento.value,
      idTipoProceso: this.filtroForm.controls.tipoProceso.value,
      fechaDesde: this.utilsService.formatoFecha_YYYYMMDD(this.filterFecha.desde),
      fechaHasta: this.utilsService.formatoFecha_YYYYMMDD(this.filterFecha.hasta),
      idEstado: this.filtroForm.controls.estado.value,
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: SolicitudCavali[]) => {
      this.solicitudes = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onLimpiarFiltro($event): void {
    if ($event === 'reload') {
      this.filtroForm.reset(this.oldFiltroForm);
    }
  }

  onActualizarEstado(): void {
    this.utilsService.blockUIStart("Actualizando...");
    this.cavaliService.consultarFactura({
      idUsuarioAud: this.currentUser.idUsuario
    }).subscribe(response => {
      if (response.tipo === 1) {
        this.onListarCavali();
        this.utilsService.showNotification('Información Actualizada', 'Confirmación', 1);
        this.utilsService.blockUIStop();
      } else if (response.tipo === 2) {
        this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
      } else {
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
      }
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }
}
