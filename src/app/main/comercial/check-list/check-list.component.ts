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
import {SolicitudCabSustento} from "../../../shared/models/comercial/solicitudCab-sustento";
import Swal from "sweetalert2";
import {ClientePagadorService} from "../clientes/cliente-pagador/cliente-pagador.service";
import {ClientePagadorGastos} from "../../../shared/models/comercial/cliente-pagador-gastos";
import {ClienteGastos} from "../../../shared/models/comercial/cliente-gastos";

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.scss']
})
export class CheckListComponent implements OnInit {
  public contentHeader: object;
  public solicitudes: SolicitudCab[];
  public detalle: SolicitudDet[] = [];
  public sustentos: SolicitudCabSustento[] = [];
  public sustentosOld: SolicitudCabSustento[] = [];
  public contactos: ClienteContacto[] = [];
  public cuentas: ClienteCuenta[] = [];
  public gastos: ClienteGastos[] = [];
  public tiposArchivos: TablaMaestra[] = [];
  public tipoCT: TablaMaestra[] = [];
  public solicitudForm: FormGroup;
  public seleccionarTodo: boolean = false;
  public cambiarIcono: boolean = false;
  public search: string = '';
  public submitted: boolean = false;
  public archivos: Archivo[] = [];

  public moneda: string = '';
  public idCliente: number = 0;
  public codigo: string = '';
  public idTipoOperacion = 0;
  public nroCuentaBancariaDestino: string = '';
  public cciDestino: string = '';

  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  public hasBaseDropZoneOver: boolean = false;
  public archivosSustento: FileUploader = new FileUploader({
    //url: `${environment.apiUrl}${SOLICITUD.subirSustento}`,
    isHTML5: true
  });

  get ReactiveIUForm(): any {
    return this.solicitudForm.controls;
  }

  constructor(private utilsService: UtilsService,
              private checkListService: CheckListService,
              private clienteService: ClientesService,
              private clientePagadorService: ClientePagadorService,
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
      idTipoOperacion: [0],
      codigo: [{value: '', disabled: true}],
      rucCliente: [{value: '', disabled: true}],
      razonSocialCliente: [{value: '', disabled: true}],
      rucPagProv: [{value: '', disabled: true}],
      razonSocialPagProv: [{value: '', disabled: true}],
      moneda: [{value: '', disabled: true}],
      tipoOperacion: [{value: '', disabled: true}],
      tasaNominalMensual: [{value: 0, disabled: true}],
      tasaNominalAnual: [{value: 0, disabled: true}],
      tasaNominalMensualMora: [{value: 0, disabled: true}],
      tasaNominalAnualMora: [{value: 0, disabled: true}],
      financiamiento: [{value: 0, disabled: true}],
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
      // nroCuentaBancariaDestino: [''],
      // cciDestino: [''],
      tipoCuentaBancariaDestino: ['-', Validators.required],
      idTipoCT: [{value: 0, disabled: true}],
      montoCT: [{value: 0, disabled: true}],
      montoSolicitudCT: [{value: 0, disabled: true}],
      diasPrestamoCT: [{value: 0, disabled: true}],
      fechaPagoCT: [{value: 0, disabled: true}]
    });
  }

  async ngOnInit(): Promise<void> {
    this.utilsService.blockUIStart('Obteniendo información de maestros...');
    this.tiposArchivos = await this.onListarMaestros(6, 0);
    this.tipoCT = await this.onListarMaestros(5, 0);
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
      if (el.checkList)
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
    this.idCliente = item.idCliente;
    this.solicitudForm.controls.idTipoOperacion.setValue(item.idTipoOperacion);
    this.idTipoOperacion = item.idTipoOperacion;
    this.solicitudForm.controls.codigo.setValue(item.codigo);
    this.codigo = item.codigo;
    this.solicitudForm.controls.rucCliente.setValue(item.rucCliente);
    this.solicitudForm.controls.razonSocialCliente.setValue(item.razonSocialCliente);
    this.solicitudForm.controls.rucPagProv.setValue(item.rucPagProv);
    this.solicitudForm.controls.razonSocialPagProv.setValue(item.razonSocialPagProv);
    this.solicitudForm.controls.moneda.setValue(item.moneda);
    this.moneda = item.moneda;
    this.solicitudForm.controls.tipoOperacion.setValue(item.tipoOperacion);
    this.solicitudForm.controls.tasaNominalMensual.setValue(item.tasaNominalMensual);
    this.solicitudForm.controls.tasaNominalAnual.setValue(item.tasaNominalAnual);
    this.solicitudForm.controls.tasaNominalMensualMora.setValue(item.tasaNominalMensualMora);
    this.solicitudForm.controls.tasaNominalAnualMora.setValue(item.tasaNominalAnualMora);
    this.solicitudForm.controls.financiamiento.setValue(item.financiamiento);
    this.solicitudForm.controls.comisionEstructuracion.setValue(item.comisionEstructuracion);
    this.solicitudForm.controls.usarGastosContrato.setValue(item.usarGastosContrato);
    this.solicitudForm.controls.gastosContrato.setValue(item.gastosContrato);
    this.solicitudForm.controls.usarGastoVigenciaPoder.setValue(item.usarGastoVigenciaPoder);
    this.solicitudForm.controls.gastoVigenciaPoder.setValue(item.gastoVigenciaPoder);
    this.solicitudForm.controls.comisionCartaNotarial.setValue(item.comisionCartaNotarial);
    this.solicitudForm.controls.servicioCobranza.setValue(item.servicioCobranza);
    this.solicitudForm.controls.servicioCustodia.setValue(item.servicioCustodia);
    this.solicitudForm.controls.nombreContacto.setValue(item.nombreContacto);
    this.solicitudForm.controls.telefonoContacto.setValue(item.telefonoContacto);
    this.solicitudForm.controls.correoContacto.setValue(item.correoContacto);
    this.solicitudForm.controls.titularCuentaBancariaDestino.setValue(item.titularCuentaBancariaDestino);
    this.solicitudForm.controls.monedaCuentaBancariaDestino.setValue(item.monedaCuentaBancariaDestino);
    this.solicitudForm.controls.bancoDestino.setValue(item.bancoDestino);
    this.nroCuentaBancariaDestino = item.nroCuentaBancariaDestino;
    this.cciDestino = item.cciDestino;
    this.solicitudForm.controls.tipoCuentaBancariaDestino.setValue(item.tipoCuentaBancariaDestino);
    this.solicitudForm.controls.idTipoCT.setValue(item.idTipoCT);
    this.solicitudForm.controls.montoCT.setValue(item.montoCT);
    this.solicitudForm.controls.montoSolicitudCT.setValue(item.montoSolicitudCT);
    this.solicitudForm.controls.diasPrestamoCT.setValue(item.diasPrestamoCT);
    this.solicitudForm.controls.fechaPagoCT.setValue(item.fechaPagoCT);

    this.detalle = item.solicitudDet;
    this.sustentos = item.solicitudCabSustento;

    this.utilsService.blockUIStart("Obteniendo información...");
    this.clienteService.obtener({
      idCliente: item.idCliente
    }).subscribe((response: any) => {
      this.contactos = response.clienteContacto;
      this.cuentas = response.clienteCuenta;
      this.cuentas = this.cuentas.filter(f => f.codigoMoneda === item.moneda);
      this.gastos = response.clienteGastos;
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
    this.submitted = false;
    this.sustentosOld = [];
    this.nroCuentaBancariaDestino = "";
    this.cciDestino = "";
    this.solicitudForm.reset();
    this.onListarSolicitudes();
    this.archivos = [];
    this.codigo = "";
    this.archivosSustento.clearQueue();
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

  onAprobar(idEstado: number): void {
    let solicitudes = this.solicitudes.filter(f => f.seleccionado);
    if (solicitudes.length == 0) {
      this.utilsService.showNotification("Seleccione una o varias solicitudes", "", 2);
      return;
    }

    solicitudes.forEach(el => {
      el.idEstado = idEstado;
      el.idUsuarioAud = 1
    });

    this.utilsService.blockUIStart('Aprobando...');
    this.checkListService.cambiarEstado(solicitudes).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Información registrada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarSolicitudes();
      } else if (response.tipo == 2) {
        this.utilsService.blockUIStop();
      } else {
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
      }
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onActualizar(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.clientePagadorService.obtener({
      idCliente: this.idCliente,
      rucPagProv: this.solicitudForm.controls.rucPagProv.value
    }).subscribe((response: ClientePagadorGastos[]) => {
      let gasto = null;
      let existeGasto = false;

      if (response.length > 0) {
        if (response.filter(f => f.moneda === this.moneda).length > 0) {
          gasto = response.find(f => f.moneda === this.moneda);
          existeGasto = true;
        }
      }

      if (!existeGasto) {
        if (this.gastos.filter(f => f.codigoMoneda === this.moneda && f.idTipoOperacion === this.idTipoOperacion).length > 0) {
          gasto = this.gastos.find(f => f.codigoMoneda === this.moneda && f.idTipoOperacion === this.idTipoOperacion);
          existeGasto = true;
        }
      }

      if (gasto != null) {
        this.solicitudForm.controls.tasaNominalMensual.setValue(gasto.tasaNominalMensual);
        this.solicitudForm.controls.tasaNominalAnual.setValue(gasto.tasaNominalAnual);
        this.solicitudForm.controls.tasaNominalMensualMora.setValue(gasto.tasaNominalMensualMora);
        this.solicitudForm.controls.tasaNominalAnualMora.setValue(gasto.tasaNominalAnualMora);
        this.solicitudForm.controls.financiamiento.setValue(gasto.financiamiento);
        this.solicitudForm.controls.comisionEstructuracion.setValue(gasto.comisionEstructuracion);
        this.solicitudForm.controls.gastosContrato.setValue(gasto.gastosContrato);
        this.solicitudForm.controls.comisionCartaNotarial.setValue(gasto.comisionCartaNotarial);
        this.solicitudForm.controls.servicioCobranza.setValue(gasto.servicioCobranza);
        this.solicitudForm.controls.servicioCustodia.setValue(gasto.servicioCustodia);

        for (let item of this.detalle) {
          let valor = item.netoConfirmado * ((100 - gasto.financiamiento) / 100);
          valor = Math.round((valor + Number.EPSILON) * 100) / 100;
          if (item.fondoResguardo != valor)
            item.editado = true;
          item.fondoResguardo = valor;
        }

        this.utilsService.showNotification('Información de Gastos actualizado', '', 1);
      } else {
        this.utilsService.showNotification('No se encontró configuración de Gastos', '', 2);
      }
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onGuardar(): void {
    this.submitted = true;
    if (this.solicitudForm.invalid)
      return;
    if (this.nroCuentaBancariaDestino === "" && this.cciDestino === "")
      return;
    this.utilsService.blockUIStart("Guardando...");
    if (this.sustentosOld.length === 0)
      for (let item of this.sustentos) {
        this.sustentosOld.push({
          idSolicitudCabSustento: item.idSolicitudCabSustento,
          idSolicitudCab: item.idSolicitudCab,
          idTipo: item.idTipo,
          tipo: item.tipo,
          archivo: item.archivo,
          base64: item.base64,
          rutaArchivo: item.rutaArchivo,
          estado: item.estado,
          editado: item.editado
        });
      }
    else {
      this.sustentos = []
      for (let item of this.sustentosOld) {
        this.sustentos.push({
          idSolicitudCabSustento: item.idSolicitudCabSustento,
          idSolicitudCab: item.idSolicitudCab,
          idTipo: item.idTipo,
          tipo: item.tipo,
          archivo: item.archivo,
          base64: item.base64,
          rutaArchivo: item.rutaArchivo,
          estado: item.estado,
          editado: item.editado
        });
      }
    }

    for (let item of this.archivos) {
      this.sustentos.push({
        idSolicitudCabSustento: 0,
        idSolicitudCab: 0,
        idTipo: item.idTipo,
        tipo: "",
        archivo: item.nombre,
        base64: item.base64,
        rutaArchivo: "",
        estado: true,
        editado: true
      });
    }

    this.checkListService.actualizar({
      idSolicitudCab: this.solicitudForm.controls.idSolicitudCab.value,
      codigo: this.solicitudForm.controls.codigo.value,
      idTipoOperacion: this.solicitudForm.controls.idTipoOperacion.value,
      tasaNominalMensual: this.solicitudForm.controls.tasaNominalMensual.value,
      tasaNominalAnual: this.solicitudForm.controls.tasaNominalAnual.value,
      tasaNominalMensualMora: this.solicitudForm.controls.tasaNominalMensualMora.value,
      tasaNominalAnualMora: this.solicitudForm.controls.tasaNominalAnualMora.value,
      financiamiento: this.solicitudForm.controls.financiamiento.value,
      comisionEstructuracion: this.solicitudForm.controls.comisionEstructuracion.value,
      usarGastosContrato: this.solicitudForm.controls.usarGastosContrato.value,
      gastosContrato: this.solicitudForm.controls.gastosContrato.value,
      comisionCartaNotarial: this.solicitudForm.controls.comisionCartaNotarial.value,
      servicioCobranza: this.solicitudForm.controls.servicioCobranza.value,
      servicioCustodia: this.solicitudForm.controls.servicioCustodia.value,
      usarGastoVigenciaPoder: this.solicitudForm.controls.usarGastoVigenciaPoder.value,
      gastoVigenciaPoder: this.solicitudForm.controls.gastoVigenciaPoder.value,
      nombreContacto: this.solicitudForm.controls.nombreContacto.value,
      telefonoContacto: this.solicitudForm.controls.telefonoContacto.value,
      correoContacto: this.solicitudForm.controls.correoContacto.value,
      conCopiaContacto: this.solicitudForm.controls.conCopiaContacto.value,
      titularCuentaBancariaDestino: this.solicitudForm.controls.titularCuentaBancariaDestino.value,
      monedaCuentaBancariaDestino: this.solicitudForm.controls.monedaCuentaBancariaDestino.value,
      bancoDestino: this.solicitudForm.controls.bancoDestino.value,
      nroCuentaBancariaDestino: this.nroCuentaBancariaDestino,
      cciDestino: this.cciDestino,
      tipoCuentaBancariaDestino: this.solicitudForm.controls.tipoCuentaBancariaDestino.value,
      idTipoCT: 0,
      montoCT: 0,
      montoSolicitudCT: 0,
      diasPrestamoCT: 0,
      fechaPagoCT: '',
      idUsuarioAud: 1,
      solicitudDet: this.detalle.filter(f => f.editado),
      solicitudCabSustento: this.sustentos.filter(f => f.editado)
    }).subscribe((response: any) => {
      switch (response.tipo) {
        case 1:
          this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
          this.utilsService.blockUIStop();
          this.onListarSolicitudes();
          this.onCancelar();
          break;
        case 2:
          this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
          this.utilsService.blockUIStop();
          break;
        default:
          this.utilsService.showNotification(response.mensaje, 'Error', 3);
          this.utilsService.blockUIStop();
          break;
      }
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onEliminarArchivoAdjunto(item: SolicitudCabSustento): void {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Desea eliminar el archivo "${item.archivo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      }
    }).then(result => {
      if (result.value) {
        item.editado = true;
        item.estado = false;
      }
    });
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
    this.nroCuentaBancariaDestino = item.nroCuenta;
    this.cciDestino = item.cci;
    this.solicitudForm.controls.tipoCuentaBancariaDestino.setValue("-");
    modal.dismiss("Cross Click");
  }
}
