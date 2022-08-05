import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilsService} from "../../../shared/services/utils.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SolicitudesService} from "./solicitudes.service";
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {SolicitudDet} from "../../../shared/models/comercial/SolicitudDet";
import {environment} from '../../../../environments/environment';
import {SOLICITUD} from "../../../shared/helpers/url/comercial";
import Swal from 'sweetalert2';
import { UsuarioService } from 'app/main/seguridad/usuario/usuario.service';
import { SolicitudesGrillaComponent } from './solicitudes-grilla/solicitudes-grilla.component';
import { User } from 'app/shared/models/auth/user';
@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {

  @ViewChild(SolicitudesGrillaComponent) grilla: SolicitudesGrillaComponent;
  public currentUser: User;
  hasBaseDropZoneOver: boolean;
  public contentHeader: object;
  public solicitudes: SolicitudCab[];
  public submitted: boolean;
  public solicitudForm: FormGroup;
  public solicitudDetForm: FormGroup;
  public cambiarIcono: boolean = false;
  public activeId: number = 1;

  name = "Elija el archivo";
  cantXml = 0;
  CantPdf = 0;
  optClienteP = [];
  tipoServicio = "Factoring";
  solicitudDet: SolicitudDet[] = [];
  params = [];
  idSolicitudCab: number;
  idCedente: number;
  idAceptante: number;
  moneda: string;
  comisionEst: number;
  gastoContrato: number;
  comisionCart: number;
  servicioCobranza: number;
  servicioCustodia: number;
  idTipoOperacion: number = 1;
  public search: string = '';
  public searchCli: string = '';
  public pagProv: string;
  public rucPagProv: string;

  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;
  public collectionSizeCli: number = 0;
  public pageSizeCli: number = 8;
  public pageCli: number = 1;
  public razonSocial: string = '';
  public ruc: string = '';
  public selectedRowIds: number[] = [];
  public dataXml = [];
  
  public filtroForm: FormGroup;
  public oldFiltroForm: FormGroup;
  public optUsuario = [];

  get ReactiveIUForm(): any {
    return this.solicitudForm.controls;
  }

  get ReactiveDetForm(): any {
    return this.solicitudDetForm.controls;
  }

  constructor(private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private utilsService: UtilsService,
              private solicitudesService: SolicitudesService,
              private usuarioService: UsuarioService) {
    this.contentHeader = {
      headerTitle: 'Solicitudes',
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
            name: 'Comercial',
            isLink: false
          },
          {
            name: 'Solicitudes',
            isLink: false
          }
        ]
      }
    };
    this.solicitudForm = this.formBuilder.group({
      idSolicitudCab: [0],
      idCedente: [1],
      idAceptante: [1],
      comisionEstructuracion: [0.00],
      gastosContrato: [0],
      comisionCartaNotarial: [0],
      servicioCobranza: [0],
      servicioCustodia: [0],
      factoring: [false],
      confirming: [false],
      capitalTrabajo: [false],
      ruc: ['', Validators.required],
      razonSocial: ['', Validators.required]
    });
    this.solicitudDetForm = this.formBuilder.group({
      nroSolicitud: [''],
      moneda: [''],
      cedente: [''],
      rucCedente: [''],
      aceptante: [''],
      rucAceptante: [''],
      tipoOperacion: [''],
      bancoD: [''],
      ctaBancariaD: [''],
      tipoCtaBancariaD: [''],
      titularCtaBancariaD: [''],
      comisionCN: [''],
      comisionE: [''],
      financiamiento: [''],
      servicioCob: [''],
      servicioCus: [''],
      tnm: [''],
      tna: [''],
      tnmm: [''],
      tnam: [''],
      totalDesCIgv: [''],
      totalFacCIgv: [''],
      nombreC: [''],
      correoC: [''],
      correoConCopiaC: [''],
      telefonoC: [''],
      estado: ['']
    });

    this.filtroForm = this.formBuilder.group({
      usuario: [0]
    });
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.onRefrescar();
    this.hasBaseDropZoneOver = false;
    this.onUsuarioCombo();
    this.filtroForm.controls.usuario.setValue(this.currentUser.idUsuario);
  }

  // onListarSolicitudes(): void {
  //   this.utilsService.blockUIStart('Obteniendo información...');
  //   this.solicitudesService.listar({
  //     idConsulta: 1,
  //     idSubConsulta: 1,
  //     search: this.search,
  //     pageIndex: this.page,
  //     pageSize: this.pageSize
  //   }).subscribe((response: SolicitudCab[]) => {
  //     this.solicitudes = response;
  //     this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
  //
  //     this.utilsService.blockUIStop();
  //   }, error => {
  //     this.utilsService.blockUIStop();
  //     this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
  //   });
  // }

  onCancelar(): void {
    this.submitted = false;
    this.modalService.dismissAll();
  }

  onRefrescar(): void {
    this.activeId = 1;
    //this.grilla.onRefrescar(this.filtroForm.controls.usuario.value);
    //this.onListarSolicitudes();
  }

  onClienteList(modal, value): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.solicitudesService.listarCliente({
      idTipo: this.idTipoOperacion,
      search: this.searchCli,
      pageIndex: this.pageCli,
      pageSize: this.pageSizeCli
    }).subscribe(response => {
      this.optClienteP = response;

      this.collectionSizeCli = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    if (value == 1) {
      this.searchCli = '';
      setTimeout(() => {
        this.modalService.open(modal, {
          scrollable: true,
          backdrop: 'static',
          size: 'lg',
          beforeDismiss: () => {
            return true;
          }
        });
      }, 0);
    }
  }

  onUsuarioCombo(): void{
    this.utilsService.blockUIStart('Obteniendo información...');
    this.usuarioService.combo({
      idEmpresa: this.currentUser.idEmpresa
    }).subscribe(response => {
      this.optUsuario = response;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onChangeUsuario(): void{
    this.grilla.onRefrescar(this.filtroForm.controls.usuario.value);
  }
}
