import {Component, OnInit} from '@angular/core';
import {LiquidacionDevolucion} from "../../../shared/models/cobranza/liquidacion-devolucion";
import {UtilsService} from "../../../shared/services/utils.service";
import {DevolucionesService} from "./devoluciones.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FileUploader} from "ng2-file-upload";
import {Archivo} from "../../../shared/models/comercial/archivo";
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";
import {LiquidacionDevolucionSustento} from "../../../shared/models/cobranza/liquidacionDevolucion-Sustento";
import Swal from "sweetalert2";
import {ClienteCuenta} from "../../../shared/models/comercial/cliente-cuenta";
import {ClientesService} from "../../comercial/clientes/clientes.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.scss']
})
export class DevolucionesComponent implements OnInit {
  public submitted: boolean = false;
  public contentHeader: object;
  public devoluciones: LiquidacionDevolucion[] = [];
  public sustentos: LiquidacionDevolucionSustento[] = [];
  public sustentosOld: LiquidacionDevolucionSustento[] = [];
  public tiposArchivos: TablaMaestra[] = [];
  public cuentas: ClienteCuenta[] = [];
  public seleccionarTodo: boolean = false;
  public devolucionForm: FormGroup;
  public ver: boolean = false;
  public hasBaseDropZoneOver: boolean = false;
  public archivosSustento: FileUploader = new FileUploader({
    isHTML5: true
  });
  public archivos: Archivo[] = [];

  public codigo: string = '';
  public codigoMonedaCab: string = '';
  public codigoMonedaDet: string = '';
  public tipoCambioMoneda: number = 0;

  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  get ReactiveIUForm(): any {
    return this.devolucionForm.controls;
  }

  constructor(private utilsService: UtilsService,
              private formBuilder: FormBuilder,
              private devolucionesService: DevolucionesService,
              private modalService: NgbModal,
              private clienteService: ClientesService,
              private tablaMaestraService: TablaMaestraService) {
    this.contentHeader = {
      headerTitle: 'Devoluciones',
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
            name: 'Cobranza',
            isLink: false
          },
          {
            name: 'Devoluciones',
            isLink: false
          }
        ]
      }
    };
    this.devolucionForm = this.formBuilder.group({
      idLiquidacionDevolucion: [0],
      idLiquidacionDet: [0],
      codigo: [{value: '', disabled: true}],
      rucCliente: [{value: '', disabled: true}],
      razonSocialCliente: [{value: '', disabled: true}],
      rucPagProv: [{value: '', disabled: true}],
      razonSocialPagProv: [{value: '', disabled: true}],
      moneda: [{value: '', disabled: true}],
      tipoOperacion: [{value: '', disabled: true}],
      nroDocumento: [{value: '', disabled: true}],
      monto: [{value: 0, disabled: true}],
      tipoCambioMoneda: [{value: 0, disabled: false}],
      montoConversion: [{value: 0, disabled: true}],
      fechaDesembolso: [{value: null}],
      titularCuentaBancariaDestino: [''],
      monedaCuentaBancariaDestino: [''],
      bancoDestino: [''],
      nroCuentaBancariaDestino: [''],
      cciDestino: [''],
      tipoCuentaBancariaDestino: ['']
    });
  }

  async ngOnInit(): Promise<void> {
    this.tiposArchivos = await this.onListarMaestros(11, 0);
    this.onListarDevolucion();
  }

  async onListarMaestros(idTabla: number, idColumna: number): Promise<TablaMaestra[]> {
    return await this.tablaMaestraService.listar({
      idTabla: idTabla,
      idColumna: idColumna
    }).then((response: TablaMaestra[]) => response, error => [])
      .catch(error => []);
  }

  onListarDevolucion(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.devolucionesService.listar({
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: LiquidacionDevolucion[]) => {
      this.devoluciones = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onSeleccionarTodo(): void {
    this.devoluciones.forEach(el => {
      if (el.checkList)
        el.seleccionado = this.seleccionarTodo;
    });
  }

  onSeleccionarCuenta(item: ClienteCuenta, modal): void {
    this.devolucionForm.controls.titularCuentaBancariaDestino.setValue(item.titular);
    this.devolucionForm.controls.monedaCuentaBancariaDestino.setValue(item.moneda);
    this.devolucionForm.controls.bancoDestino.setValue(item.banco);
    this.devolucionForm.controls.nroCuentaBancariaDestino.setValue(item.nroCuenta);
    this.devolucionForm.controls.cciDestino.setValue(item.cci);
    this.devolucionForm.controls.tipoCuentaBancariaDestino.setValue(item.tipoCuenta);
    this.codigoMonedaDet = item.codigoMoneda;
    this.tipoCambioMoneda = 0;
    modal.dismiss("Cross Click");
  }

  onConvertirMontoTotal(): void {
    if (this.codigoMonedaCab != this.codigoMonedaDet) {
      if (this.codigoMonedaCab == "PEN") {
        this.devolucionForm.controls.montoConversion.setValue(Math.round((this.devolucionForm.controls.monto.value / this.tipoCambioMoneda) * 100) / 100);
      } else {
        this.devolucionForm.controls.montoConversion.setValue(Math.round((this.devolucionForm.controls.monto.value * this.tipoCambioMoneda) * 100) / 100);
      }
    }
  }

  onEditar(modal: any, cab: LiquidacionDevolucion): void {
    this.ver = cab.idEstado === 2 ? true : false;
    this.devolucionForm.controls.idLiquidacionDevolucion.setValue(cab.idLiquidacionDevolucion);
    this.devolucionForm.controls.idLiquidacionDet.setValue(cab.idLiquidacionDet);
    this.devolucionForm.controls.codigo.setValue(cab.codigo);
    this.codigo = cab.codigo;
    this.devolucionForm.controls.rucCliente.setValue(cab.rucCliente);
    this.devolucionForm.controls.razonSocialCliente.setValue(cab.razonSocialCliente);
    this.devolucionForm.controls.rucPagProv.setValue(cab.rucPagProv);
    this.devolucionForm.controls.razonSocialPagProv.setValue(cab.razonSocialPagProv);
    this.devolucionForm.controls.moneda.setValue(cab.moneda);
    this.devolucionForm.controls.tipoOperacion.setValue(cab.tipoOperacion);
    this.devolucionForm.controls.nroDocumento.setValue(cab.nroDocumento);
    this.devolucionForm.controls.monto.setValue(cab.monto);
    this.devolucionForm.controls.tipoCambioMoneda.setValue(cab.tipoCambioMoneda);
    this.codigoMonedaCab = cab.moneda;
    this.codigoMonedaDet = cab.tipoCambioMoneda == 0 ? cab.moneda : '';
    this.devolucionForm.controls.montoConversion.setValue(cab.montoConversion);
    if (cab.fechaDesembolso === "")
      this.devolucionForm.controls.fechaDesembolso.setValue(null);
    else
      this.devolucionForm.controls.fechaDesembolso.setValue({
        year: Number(cab.fechaDesembolso.split('/')[2]),
        month: Number(cab.fechaDesembolso.split('/')[1]),
        day: Number(cab.fechaDesembolso.split('/')[0])
      });
    this.devolucionForm.controls.titularCuentaBancariaDestino.setValue(cab.titularCuentaBancariaDestino);
    this.devolucionForm.controls.monedaCuentaBancariaDestino.setValue(cab.monedaCuentaBancariaDestino);
    this.devolucionForm.controls.bancoDestino.setValue(cab.bancoDestino);
    this.devolucionForm.controls.nroCuentaBancariaDestino.setValue(cab.nroCuentaBancariaDestino);
    this.devolucionForm.controls.cciDestino.setValue(cab.cciDestino);
    this.devolucionForm.controls.tipoCuentaBancariaDestino.setValue(cab.tipoCuentaBancariaDestino);

    this.sustentos = cab.liquidacionDevolucionSustento;

    this.utilsService.blockUIStart("Obteniendo información...");
    this.clienteService.obtener({
      idCliente: cab.idCliente
    }).subscribe((response: any) => {
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

  async onArchivoABase64(file): Promise<any> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
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

  async fileOverBase(e: any): Promise<void> {
    this.hasBaseDropZoneOver = e;
    if (e === false) {
      let cola = this.archivosSustento.queue;

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
          idTipoSustento: 0,
          idTipo: 1,
          nombre: item.file.name,
          tamanio: `${(item.file.size / 1024 / 1024).toLocaleString('es-pe', {minimumFractionDigits: 2})} MB`,
          base64: base64
        });
      }
    }
  }

  onEliminarArchivo(item: Archivo): void {

  }

  onEliminarArchivoAdjunto(item: LiquidacionDevolucionSustento): void {
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

  onGuardar(): void {
    this.submitted = true;
    if (this.devolucionForm.invalid)
      return;

    if (this.tipoCambioMoneda === 0 && this.codigoMonedaCab !== this.codigoMonedaDet) {
      this.utilsService.showNotification('El Tipo de Cambio no puede se 0', 'Alerta', 2);
      return;
    }

    this.utilsService.blockUIStart("Guardando...");
    if (this.sustentosOld.length === 0) {
      // @ts-ignore
      this.sustentosOld = [...this.sustentos];
    } else {
      this.sustentos = [...this.sustentosOld];
    }

    for (let item of this.archivos) {
      this.sustentos.push({
        idLiquidacionDevolucionSustento: 0,
        idLiquidacionDevolucion: 0,
        idTipo: item.idTipo,
        tipo: "",
        archivo: item.nombre,
        base64: item.base64,
        rutaArchivo: "",
        estado: true,
        editado: true
      });
    }

    let fechaDesembolso = this.devolucionForm.controls.fechaDesembolso.value;

    this.devolucionesService.actualizar({
      idLiquidacionDevolucion: this.devolucionForm.controls.idLiquidacionDevolucion.value,
      idLiquidacionDet: this.devolucionForm.controls.idLiquidacionDet.value,
      codigo: this.codigo,
      titularCuentaBancariaDestino: this.devolucionForm.controls.titularCuentaBancariaDestino.value,
      monedaCuentaBancariaDestino: this.devolucionForm.controls.monedaCuentaBancariaDestino.value,
      bancoDestino: this.devolucionForm.controls.bancoDestino.value,
      nroCuentaBancariaDestino: this.devolucionForm.controls.nroCuentaBancariaDestino.value,
      cciDestino: this.devolucionForm.controls.cciDestino.value,
      tipoCuentaBancariaDestino: this.devolucionForm.controls.tipoCuentaBancariaDestino.value,
      tipoCambioMoneda: this.tipoCambioMoneda,
      montoConversion: this.devolucionForm.controls.montoConversion.value,
      fechaDesembolso: fechaDesembolso === null ? '' : `${fechaDesembolso.year}${String(fechaDesembolso.month).padStart(2, '0')}${String(fechaDesembolso.day).padStart(2, '0')}`,
      idUsuarioAud: 1,
      liquidacionDevolucionSustento: this.sustentos.filter(f => f.editado)
    }).subscribe((response: any) => {
      switch (response.tipo) {
        case 1:
          this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
          this.utilsService.blockUIStop();
          this.onCancelar();
          break;
        case 2:
          this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
          this.utilsService.blockUIStop();
          this.sustentos = [...this.sustentosOld];
          break;
        default:
          this.utilsService.showNotification(response.mensaje, 'Error', 3);
          this.utilsService.blockUIStop();
          this.sustentos = [...this.sustentosOld];
          break;
      }
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onCancelar(): void {
    this.submitted = false;
    this.sustentosOld = [];
    // this.nroCuentaBancariaDestino = "";
    // this.cciDestino = "";
    this.devolucionForm.reset();
    this.onListarDevolucion();
    this.archivos = [];
    this.codigo = "";
    this.archivosSustento.clearQueue();
    this.modalService.dismissAll();
  }

  onGenerarArchivo(): void {
    let liquidaciones = [...this.devoluciones.filter(f => f.seleccionado)];

    if (liquidaciones.length === 0) {
      this.utilsService.showNotification("Seleccione una o varias devoluciones", "", 2);
      return;
    }

    for (const item of liquidaciones) {
      if (item.idEstado != 1) {
        this.utilsService.showNotification('Seleccione solo devoluciones con estado "Pendiente" y que hayan sido revisadas', 'Alerta', 2);
        return;
      }
    }

    liquidaciones.forEach(el => {
      el.idEmpresa = 1;
      el.idEstado = 1;
      el.idUsuarioAud = 1;
    });

    this.utilsService.blockUIStart('Generando archivo...');
    this.devolucionesService.cambiarEstado(liquidaciones).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.blockUIStop();
        this.utilsService.blockUIStart('Exportando archivo...');
        this.devolucionesService.export(liquidaciones).subscribe(s => {
          let blob: any = new Blob([s], {type: 'application/vnd.ms-excel'});
          const url = window.URL.createObjectURL(blob);
          fileSaver.saveAs(blob, 'ArchivoDevolucion_'
            + new Date().getFullYear().toString()
            + new Date().getMonth().toString().padStart(2, "0")
            + new Date().getDate().toString().padStart(2, "0")
            + '.xlsx');
          this.utilsService.showNotification('Generación satisfactoria', 'Confirmación', 1);
          this.utilsService.blockUIStop();
          this.onListarDevolucion();
        }, error => {
          this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
          this.utilsService.blockUIStop();
        });
      } else if (response.tipo == 2) {
        this.utilsService.showNotification(response.mensaje, 'Validación', 2);
        this.utilsService.blockUIStop();
      } else if (response.tipo == 0) {
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
      }
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onAprobar(idEstado: number): void {
// @ts-ignore
    let liquidaciones = [...this.devoluciones.filter(f => f.seleccionado)];

    if (liquidaciones.length === 0) {
      this.utilsService.showNotification("Seleccione una o varias devoluciones", "", 2);
      return;
    }

    for (let item of liquidaciones) {
      if (item.idEstado != 1) {
        this.utilsService.showNotification('Seleccione solo devoluciones con estado "Pendiente"', "", 2);
        return;
      } else {
        if (item.liquidacionDevolucionSustento.filter(x => x.idTipo === 1).length === 0) {
          this.utilsService.showNotification('La devolución con código ' + item.codigo + ' no contiene archivo(s) de sustento con tipo "Confirmación de Devolución"', 'Alerta', 2);
          return;
        }
      }
    }

    liquidaciones.forEach(el => {
      el.idEmpresa = 1;
      el.idEstado = idEstado;
      el.idUsuarioAud = 1;
    });

    this.utilsService.blockUIStart('Confirmando...');
    this.devolucionesService.cambiarEstado(liquidaciones).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Confirmación Satisfactoria', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarDevolucion();
      } else if (response.tipo == 2) {
        this.utilsService.showNotification(response.mensaje, 'Validación', 2);
        this.utilsService.blockUIStop();
      } else if (response.tipo == 0) {
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
      }
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onFilas(liquidaciones: any): string {
    let filas = "";
    for (const item of liquidaciones) {
      filas += `<tr><td>${item.codigo}</td>
                  <td>${item.correoEnviado === 1 ? '<i class="text-success fa fa-check"></i>' :
        (item.correoEnviado === 0 ? '<i class="text-danger cursor-pointer fa fa-ban"></i>' :
          '<i class="text-secondary cursor-pointer fa fa-minus-circle"></i>')}</td>
                </tr>`
    }
    return filas;
  }

  onEnviar(idTipo: number, cab: LiquidacionDevolucion): void {
    let liquidaciones = idTipo == 1 ? [...this.devoluciones.filter(f => f.seleccionado)] : [{...cab}];

    if (idTipo == 1) {
      if (liquidaciones.length === 0) {
        this.utilsService.showNotification("Seleccione una o varias devoluciones", "", 2);
        return;
      }
    }

    for (let item of liquidaciones) {
      if (item.idEstado != 2) {
        this.utilsService.showNotification('Seleccione solo liquidaciones con estado "Desembolsado"', "", 2);
        return;
      }
    }

    liquidaciones.forEach(el => {
      el.idEmpresa = 1;
      el.idUsuarioAud = 1;
    });

    this.utilsService.blockUIStart('Enviando...');
    this.devolucionesService.enviarCorreo(liquidaciones).subscribe(response => {
      if (response.comun.tipo == 1) {
        //this.utilsService.showNotification('Enviado correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();

        Swal.fire({
          title: 'Información',
          html: `
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                <tr>
                  <th>N° Liquidación</th>
                  <th>Correo Enviado</th>
                </tr>
                </thead>
                <tbody>
                ${this.onFilas(response.liquidacionCabValidacion)}
                </tbody>
              </table>
            </div>
            <p style="text-align: right"><i class="text-success cursor-pointer fa fa-check"></i> : Enviado &nbsp;&nbsp;
            <i class="text-danger cursor-pointer fa fa-ban"></i> : No Enviado</p>`,
          icon: 'info',
          width: '750px',
          showCancelButton: false,
          confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
          customClass: {
            confirmButton: 'btn btn-info',
          },
        }).then(result => {
          if (result.value) {
          }
        });
        this.onListarDevolucion();
      } else if (response.comun.tipo == 0) {
        this.utilsService.showNotification(response.comun.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
      }

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }
}
