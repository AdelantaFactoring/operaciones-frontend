import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {NgbModal, NgbCalendar} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
//import {SolicitudesService} from "./solicitudes.service";
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {ColumnMode} from '@swimlane/ngx-datatable';
import {RespuestaPagadorService} from "./respuesta-pagador.service";

@Component({
  selector: 'app-respuesta-pagador',
  templateUrl: './respuesta-pagador.component.html',
  styleUrls: ['./respuesta-pagador.component.scss']
})
export class RespuestaPagadorComponent implements OnInit {
  public contentHeader: object;
  public ColumnMode = ColumnMode;
  public submitted: boolean;
  public solicitudes: SolicitudCab[] = [];
  // public solicitudForm: FormGroup;
  @ViewChild('tableRowDetails') tableRowDetails: any;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private calendar: NgbCalendar,
    private respuestaPagadorService: RespuestaPagadorService
  ) {
    this.contentHeader = {
      headerTitle: 'Respuesta Pagador',
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
            name: 'Respuesta Pagador',
            isLink: false
          }
        ]
      }
    };
  }

  ngOnInit(): void {
    this.onListarSolicitudes();
  }

  rowDetailsToggleExpand(row) {
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }

  onListarSolicitudes(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.respuestaPagadorService.listar({
      idEstado: 1,
      search: '',
      pageIndex: 1,
      pageSize: 10
    }).subscribe((response: SolicitudCab[]) => {
      this.solicitudes = response;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onRegistrarFacturas(): void {
    console.log(this.solicitudes);
  }
}
