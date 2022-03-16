import {Component, OnInit} from '@angular/core';
import {SolicitudCab} from "../../../shared/models/comercial/solicitudCab";
import {UtilsService} from "../../../shared/services/utils.service";
import {CheckListService} from "./check-list.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {SolicitudDet} from "../../../shared/models/comercial/solicitudDet";
import {FileUploader} from "ng2-file-upload";
import {environment} from "../../../../environments/environment";
import {SOLICITUD} from "../../../shared/helpers/url/comercial";
import {ClientesService} from "../clientes/clientes.service";
import {ClienteContacto} from "../../../shared/models/comercial/cliente-contacto";
import {ClienteCuenta} from "../../../shared/models/comercial/cliente-cuenta";
import {Archivo} from "../../../shared/models/comercial/archivo";
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.scss']
})
export class CheckListComponent implements OnInit {
  public contentHeader: object;
  public solicitudes: SolicitudCab[];
  public detalle: SolicitudDet[];
  public contactos: ClienteContacto[];
  public cuentas: ClienteCuenta[];
  public tiposArchivos: TablaMaestra[];
  public solicitudForm: FormGroup;
  public seleccionarTodo: boolean = false;
  public cambiarIcono: boolean = false;
  public search: string = '';
  public submitted: boolean = false;
  public archivos: Archivo[]

  public nroCuentaBancariaDestino: string = '';
  public cciDestino: string = '';

  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  public hasBaseDropZoneOver: boolean = false;
  public archivosSustento: FileUploader = new FileUploader({
    url: `${environment.apiUrl}${SOLICITUD.subirSustento}`,
    isHTML5: true
  });

  get ReactiveIUForm(): any {
    return this.solicitudForm.controls;
  }

  constructor(private utilsService: UtilsService,
              private checkListService: CheckListService,
              private clienteService: ClientesService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private tablaMaestraService: TablaMaestraService) {
    this.contentHeader = {
      headerTitle: 'Check list',
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
            name: 'Check list',
            isLink: false
          }
        ]
      }
    };
    this.solicitudForm = this.formBuilder.group({
      idSolicitudCab: [0],
      codigo: [{value: '', disabled: true}],
      rucCliente: [{value: '', disabled: true}],
      razonSocialCliente: [{value: '', disabled: true}],
      rucPagProv: [{value: '', disabled: true}],
      razonSocialPagProv: [{value: '', disabled: true}],
      moneda: [{value: '', disabled: true}],
      tipoOperacion: [{value: '', disabled: true}],
      comisionEstructuracion: [{value: 0, disabled: true}],
      usarGastosContrato: [false],
      gastosContrato: [{value: 0, disabled: true}],
      comisionCartaNotarial: [{value: 0, disabled: true}],
      servicioCobranza: [{value: 0, disabled: true}],
      servicioCustodia: [{value: 0, disabled: true}],
      usarGastoVigenciaPoder: [false],
      gastoVigenciaPoder: [0],
      nombreContacto: ['', Validators.required],
      telefonoContacto: ['', Validators.required],
      correoContacto: ['', Validators.required],
      conCopiaContacto: [''],
      titularCuentaBancariaDestino: ['', Validators.required],
      monedaCuentaBancariaDestino: ['', Validators.required],
      bancoDestino: ['', Validators.required],
      nroCuentaBancariaDestino: [''],
      cciDestino: [''],
      tipoCuentaBancariaDestino: ['-', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    this.utilsService.blockUIStart('Obteniendo información de maestros...');
    this.tiposArchivos = await this.onListarMaestros(6, 0);
    this.utilsService.blockUIStop();

    this.onListarSolicitudes();
  }

  async onListarMaestros(idTabla: number, idColumna: number): Promise<TablaMaestra[]> {
    return await this.tablaMaestraService.listar({
      idTabla: idTabla,
      idColumna: idColumna
    }).then((response: TablaMaestra[]) => response, error => [])
      .catch(error => []);
  }

  onListarSolicitudes(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.checkListService.listar({
      idConsulta: 4,
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: SolicitudCab[]) => {
      this.solicitudes = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onSeleccionarTodo(): void {
    this.solicitudes.forEach(el => {
      el.seleccionado = this.seleccionarTodo;
    });
  }

  onRefrescar(): void {
    this.onListarSolicitudes();
  }

  onCambiarVisibilidadDetalleTodo(): void {
    this.cambiarIcono = !this.cambiarIcono;
    this.solicitudes.forEach(el => {
      el.cambiarIcono = this.cambiarIcono;
      document.getElementById('tr' + el.idSolicitudCab).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
      document.getElementById('detail' + el.idSolicitudCab).style.display = (el.cambiarIcono) ? "block" : "none";
    });
  }

  onCambiarVisibilidadDetalle(item: any): void {
    item.cambiarIcono = !item.cambiarIcono;
    document.getElementById('tr' + item.idSolicitudCab).style.visibility = (item.cambiarIcono) ? "visible" : "collapse";
    document.getElementById('detail' + item.idSolicitudCab).style.display = (item.cambiarIcono) ? "block" : "none";
  }

  onEditar(item: SolicitudCab, modal: any): void {
    this.solicitudForm.controls.idSolicitudCab.setValue(item.idSolicitudCab);
    // this.clienteForm.controls.ruc.setValue(item.ruc);
    // this.clienteForm.controls.razonSocial.setValue(item.razonSocial);
    // this.clienteForm.controls.direccionPrincipal.setValue(item.direccionPrincipal);
    // this.clienteForm.controls.direccionFacturacion.setValue(item.direccionFacturacion);
    // this.clienteForm.controls.cedente.setValue(item.cedente);
    // this.clienteForm.controls.aceptante.setValue(item.aceptante);
    // this.clienteForm.controls.capitalTrabajo.setValue(item.capitalTrabajo);
    this.detalle = item.solicitudDet;

    this.utilsService.blockUIStart("Obteniendo información...");
    this.clienteService.obtener({
      idCliente: item.idCliente
    }).subscribe((response: any) => {
      this.contactos = response.clienteContacto;
      this.cuentas = response.clienteCuenta;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        //size: 'lg',
        windowClass: 'my-class',
        animation: true,
        centered: false,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onCancelar(): void {
    this.modalService.dismissAll();
  }

  async onArchivoABase64(file): Promise<any> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  onGuardar(): void {
    this.submitted = true;
    if (this.solicitudForm.invalid)
      return;
    if (this.nroCuentaBancariaDestino === "" && this.cciDestino === "")
      return;

  }

  async fileOverBase(e: any): Promise<void> {
    this.hasBaseDropZoneOver = e;
    if (e === false) {
      let cola = this.archivosSustento.queue;
      let nombres = cola.map(item => item?.file?.name)
        .filter((value, index, self) => self.indexOf(value) === index)
      let sinDuplicado = [];
      for (let el of cola) {
        let duplicado = cola.filter(f => f?.file?.name === el.file.name);
        if (duplicado.length > 1) {
          if (sinDuplicado.filter(f => f?.file?.name === el.file.name).length === 0) {
            let ultimo = duplicado.sort((a, b) => b._file.lastModified - a._file.lastModified)[0]
            sinDuplicado.push(ultimo);
          }
        } else {
          sinDuplicado.push(duplicado[0]);
        }
      }

      this.archivosSustento.queue = sinDuplicado;
      this.archivos = [];
      for (let item of sinDuplicado) {
        let base64 = await this.onArchivoABase64(item._file);
        this.archivos.push({
          idFila: this.utilsService.autoIncrement(this.archivos),
          idTipo: 8,
          nombre: item.file.name,
          tamanio: `${(item.file.size / 1024 / 1024).toLocaleString('es-pe', {minimumFractionDigits: 2})} MB`,
          base64: base64
        });
      }
    }
  }

  onSeleccioneContacto(modal): void {
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        //size: 'lg',
        windowClass: 'my-class',
        animation: true,
        centered: false,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onSeleccionarContacto(item: ClienteContacto, modal): void {
    this.solicitudForm.controls.nombreContacto.setValue(`${item.apellidoPaterno} ${item.apellidoMaterno}, ${item.nombre}`);
    this.solicitudForm.controls.telefonoContacto.setValue(item.telefono);
    this.solicitudForm.controls.correoContacto.setValue(item.correo);
    modal.dismiss("Cross Click");
  }

  onSeleccioneCuenta(modal): void {
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        //size: 'lg',
        windowClass: 'my-class',
        animation: true,
        centered: false,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onSeleccionarCuenta(item: ClienteCuenta, modal): void {
    this.solicitudForm.controls.titularCuentaBancariaDestino.setValue(item.titular);
    this.solicitudForm.controls.monedaCuentaBancariaDestino.setValue(item.moneda);
    this.solicitudForm.controls.bancoDestino.setValue(item.banco);
    this.solicitudForm.controls.nroCuentaBancariaDestino.setValue(item.nroCuenta);
    this.solicitudForm.controls.cciDestino.setValue(item.cci);
    this.solicitudForm.controls.tipoCuentaBancariaDestino.setValue("-");
    modal.dismiss("Cross Click");
  }
}
