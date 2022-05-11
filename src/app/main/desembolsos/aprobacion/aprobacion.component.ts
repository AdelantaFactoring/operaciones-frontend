import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ClientesService} from 'app/main/comercial/clientes/clientes.service';
import {DESEMBOLSO} from 'app/shared/helpers/url/desembolso';
import {Archivo} from 'app/shared/models/comercial/archivo';
import {ClienteCuenta} from 'app/shared/models/comercial/cliente-cuenta';
import {LiquidacionCab} from 'app/shared/models/operaciones/liquidacion-cab';
import {LiquidacionDet} from 'app/shared/models/operaciones/liquidacion-det';
import {LiquidacionCabSustento} from 'app/shared/models/operaciones/LiquidacionCab-Sustento';
import {LiquidacionCabSeleccionados} from 'app/shared/models/operaciones/liquidacionCab_Seleccionados';
import {TablaMaestra} from 'app/shared/models/shared/tabla-maestra';
import {TablaMaestraService} from 'app/shared/services/tabla-maestra.service';
import {UtilsService} from 'app/shared/services/utils.service';
import {environment} from 'environments/environment';
import {FileUploader} from 'ng2-file-upload';
import {AprobacionService} from './aprobacion.service';
import * as fileSaver from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aprobacion',
  templateUrl: './aprobacion.component.html',
  styleUrls: ['./aprobacion.component.scss']
})
export class AprobacionComponent implements OnInit {
  public contentHeader: object;

  public solicitudForm: FormGroup;
  public search: string = '';
  public page: number = 1;
  public pageSize: number = 10;
  public collectionSize: number;
  public desembolsos: LiquidacionCab[] = [];
  public desembolsoDet: LiquidacionDet[] = [];
  public totalMontoDescembolso: number;
  public cuentas: ClienteCuenta[] = [];
  public cambiarIcono: boolean = false;
  public seleccionarTodo: boolean = false;
  public seleccionado: LiquidacionCabSeleccionados[] = [];

  public codigo: string = '';
  public nroCuentaBancariaDestino: string;
  public cciDestino: string;
  public codigoMonedaCab: string = '';
  public codigoMonedaDet: string;
  public moneda: string;
  public montoConvertido: number = 0;
  public tipoCambioMoneda: number = 0;
  public submitted: boolean = false;
  public sustentos: LiquidacionCabSustento[] = [];
  public sustentosOld: LiquidacionCabSustento[] = [];
  public archivos: Archivo[] = [];
  public tiposArchivos: TablaMaestra[] = [];
  public reportURL = environment.apiUrl + DESEMBOLSO.GenerarArchivo;
  public ver: boolean = false;
  public hasBaseDropZoneOver: boolean = false;
  public archivosSustento: FileUploader = new FileUploader({
    //url: `${environment.apiUrl}${SOLICITUD.subirSustento}`,
    isHTML5: true
  });

  sundayDate = null;

  get ReactiveIUForm(): any {
    return this.solicitudForm.controls;
  }

  constructor(
    private utilsService: UtilsService,
    private desembolsoService: AprobacionService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private clienteService: ClientesService,
    private tablaMaestraService: TablaMaestraService
  ) {
    this.contentHeader = {
      headerTitle: 'Aprobación',
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
            name: 'Desembolsos',
            isLink: false
          },
          {
            name: 'Aprobación',
            isLink: false
          }
        ]
      }
    };
    this.solicitudForm = this.formBuilder.group({
      idSolicitudCab: [0],
      idLiquidacionCab: [0],
      idTipoOperacion: [0],
      codigo: [{value: '', disabled: true}],
      rucCliente: [{value: '', disabled: true}],
      razonSocialCliente: [{value: '', disabled: true}],
      rucPagProv: [{value: '', disabled: true}],
      razonSocialPagProv: [{value: '', disabled: true}],
      moneda: [{value: '', disabled: true}],
      montoTotal: [{value: 0, disabled: true}],
      deudaAnterior: [{value: '', disabled: true}],
      nuevoMontoTotal: [{value: 0, disabled: true}],
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
      // nombreContacto: [''],
      // telefonoContacto: [''],
      // correoContacto: [''],
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
      fechaPagoCT: [{value: 0, disabled: true}],
      montoDescontarCT: [{value: 0, disabled: true}],
      interesConIGVCT: [{value: 0, disabled: true}],
      gastosConIGVCT: [{value: 0, disabled: true}],
      totFacurarConIGVCT: [{value: 0, disabled: true}],
      totDesembolsarConIGVCT: [{value: 0, disabled: true}],
      tipoCambioMoneda: [{value: 0, disabled: false}],
      montoConvertido: [{value: 0, disabled: true}, Validators.required]
    });
  };

  async ngOnInit(): Promise<void> {
    this.onListarDesembolso();
    this.tiposArchivos = await this.onListarMaestros(8, 0);
    this.getLastSunday();
  }

  getLastSunday(): void {
    var t = new Date();
    t.setDate(t.getDate() - t.getDay() + 7);

    this.sundayDate = {
      year: t.getFullYear(),
      month: t.getMonth() + 1,
      day: t.getDate()
    };
  }

  async onListarMaestros(idTabla: number, idColumna: number): Promise<TablaMaestra[]> {
    return await this.tablaMaestraService.listar({
      idTabla: idTabla,
      idColumna: idColumna
    }).then((response: TablaMaestra[]) => response, error => [])
      .catch(error => []);
  }

  onListarDesembolso(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.desembolsoService.listar({
      idConsulta: 2, // enviar 2
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: LiquidacionCab[]) => {
      this.desembolsos = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
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
    if (this.tipoCambioMoneda === 0 && this.codigoMonedaCab !== this.codigoMonedaDet) {
      this.utilsService.showNotification('El monto en Tipo de Cambio no puede se 0', 'Alerta', 2);
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
        idLiquidacionCabSustento: 0,
        idLiquidacionCab: 0,
        idTipoSustento: 2,
        idTipo: item.idTipo,
        tipo: "",
        archivo: item.nombre,
        base64: item.base64,
        rutaArchivo: "",
        estado: true,
        editado: true
      });
    }

    this.desembolsoService.actualizar({
      idLiquidacionCab: this.solicitudForm.controls.idLiquidacionCab.value,
      codigo: this.codigo,
      titularCuentaBancariaDestino: this.solicitudForm.controls.titularCuentaBancariaDestino.value,
      monedaCuentaBancariaDestino: this.solicitudForm.controls.monedaCuentaBancariaDestino.value,
      bancoDestino: this.solicitudForm.controls.bancoDestino.value,
      nroCuentaBancariaDestino: this.nroCuentaBancariaDestino,
      cciDestino: this.cciDestino,
      tipoCuentaBancariaDestino: this.solicitudForm.controls.tipoCuentaBancariaDestino.value,
      tipoCambioMoneda: this.tipoCambioMoneda,
      montoTotalConversion: this.montoConvertido,
      idUsuarioAud: 1,
      liquidacionCabSustento: this.sustentos.filter(f => f.editado)
    }).subscribe((response: any) => {
      switch (response.tipo) {
        case 1:
          this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
          this.utilsService.blockUIStop();
          this.onListarDesembolso();
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

  async fileOverBase(e: any): Promise<void> {
    this.hasBaseDropZoneOver = e;
    if (e === false) {
      let cola = this.archivosSustento.queue;
      // for (const item of this.archivosSustento.queue) {
      //   if (!item?.file?.name.includes(".eml")) {
      //     item.remove();
      //   }
      // }

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
          idTipo: 2,
          idTipoSustento: 2,
          nombre: item.file.name,
          tamanio: `${(item.file.size / 1024 / 1024).toLocaleString('es-pe', {minimumFractionDigits: 2})} MB`,
          base64: base64
        });
      }
    }
  }

  onSeleccionarTodo(): void {
    this.desembolsos.forEach(el => {
      if (el.checkList && el.idEstado <= 5)
        el.seleccionado = this.seleccionarTodo;
    });
  }

  onCambiarVisibilidadDetalle(item: any): void {
    item.cambiarIcono = !item.cambiarIcono;
    document.getElementById('tr' + item.idLiquidacionCab).style.visibility = (item.cambiarIcono) ? "visible" : "collapse";
    document.getElementById('detail' + item.idLiquidacionCab).style.display = (item.cambiarIcono) ? "block" : "none";
  }

  onCambiarVisibilidadDetalleTodo(): void {
    this.cambiarIcono = !this.cambiarIcono;
    this.desembolsos.forEach(el => {
      el.cambiarIcono = this.cambiarIcono;
      document.getElementById('tr' + el.idLiquidacionCab).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
      document.getElementById('detail' + el.idLiquidacionCab).style.display = (el.cambiarIcono) ? "block" : "none";
    });
  }

  onEditar(item: LiquidacionCab, modal: any): void {
    this.ver = item.idEstado == 5 ? true : false;

    this.desembolsoDet = item.liquidacionDet;
    this.totalMontoDescembolso = 0;
    for (const row of this.desembolsoDet) {
      this.totalMontoDescembolso += row.montoDesembolso;
    }
    this.solicitudForm.controls.idLiquidacionCab.setValue(item.idLiquidacionCab);
    //this.idCliente = item.idCliente;
    this.solicitudForm.controls.idTipoOperacion.setValue(item.idTipoOperacion);
    this.solicitudForm.controls.codigo.setValue(item.codigo);
    this.codigo = item.codigo;
    this.solicitudForm.controls.rucCliente.setValue(item.rucCliente);
    this.solicitudForm.controls.razonSocialCliente.setValue(item.razonSocialCliente);
    this.solicitudForm.controls.rucPagProv.setValue(item.rucPagProv);
    this.solicitudForm.controls.razonSocialPagProv.setValue(item.razonSocialPagProv);
    this.solicitudForm.controls.moneda.setValue(item.moneda);
    this.codigoMonedaCab = item.moneda;
    this.codigoMonedaDet = item.tipoCambioMoneda == 0 ? item.moneda : '';
    this.solicitudForm.controls.montoConvertido.setValue(item.montoTotalConversion);
    this.solicitudForm.controls.tipoCambioMoneda.setValue(item.tipoCambioMoneda);

    this.tipoCambioMoneda = item.tipoCambioMoneda;

    this.solicitudForm.controls.montoTotal.setValue(item.nuevoMontoTotal);
    this.solicitudForm.controls.deudaAnterior.setValue(item.deudaAnterior);
    this.solicitudForm.controls.nuevoMontoTotal.setValue(item.nuevoMontoTotal);
    this.solicitudForm.controls.titularCuentaBancariaDestino.setValue(item.titularCuentaBancariaDestino);
    this.solicitudForm.controls.monedaCuentaBancariaDestino.setValue(item.monedaCuentaBancariaDestino);
    this.solicitudForm.controls.bancoDestino.setValue(item.bancoDestino);
    this.nroCuentaBancariaDestino = item.nroCuentaBancariaDestino;
    this.cciDestino = item.cciDestino;
    this.solicitudForm.controls.tipoCuentaBancariaDestino.setValue(item.tipoCuentaBancariaDestino);
    this.solicitudForm.controls.idTipoCT.setValue(item.idTipoCT);

    // this.detalle = item.solicitudDet;
    this.sustentos = item.liquidacionCabSustento.filter(x => x.idTipoSustento === 2);
    // this.onCalcularCT(item);

    this.utilsService.blockUIStart("Obteniendo información...");
    this.clienteService.obtener({
      idCliente: item.idCliente
    }).subscribe((response: any) => {

      // this.contactos = response.clienteContacto;
      this.cuentas = response.clienteCuenta;
      // this.cuentas = this.cuentas.filter(f => f.codigoMoneda === item.moneda);
      // this.gastos = response.clienteGastos;
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
    // this.nroCuentaBancariaDestino = "";
    // this.cciDestino = "";
    this.solicitudForm.reset();
    this.onListarDesembolso();
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
    this.codigoMonedaDet = item.codigoMoneda;
    this.moneda = item.moneda;
    this.tipoCambioMoneda = 0;
    modal.dismiss("Cross Click");
  }

  onConvertirMontoTotal(): void {
    if (this.codigoMonedaCab != this.codigoMonedaDet) {
      if (this.codigoMonedaCab == "PEN") {
        this.montoConvertido = Math.round((this.totalMontoDescembolso / this.tipoCambioMoneda) * 100) / 100;
        this.solicitudForm.controls.montoConvertido.setValue(this.montoConvertido);
      } else {
        this.montoConvertido = Math.round((this.totalMontoDescembolso * this.tipoCambioMoneda) * 100) / 100;
        this.solicitudForm.controls.montoConvertido.setValue(this.montoConvertido);
      }
    }
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

  onAprobar(idEstado: number): void {
    // @ts-ignore
    let liquidaciones = [...this.desembolsos.filter(f => f.seleccionado)];

    if (liquidaciones.length === 0) {
      this.utilsService.showNotification("Seleccione una o varias liquidaciones", "", 2);
      return;
    }

    let valid = true;
    for (let item of liquidaciones) {
      if (item.idEstado != 4) {
        valid = false;
        break;
      }
    }

    if (!valid) {
      this.utilsService.showNotification('Seleccione solo liquidaciones con estado "Desembolso Pendiente"', "", 2);
      return;
    }

    liquidaciones.forEach(el => {
      el.idEmpresa = 1;
      el.idEstado = idEstado;
      el.idUsuarioAud = 1;
    });

    this.utilsService.blockUIStart('Confirmando...');
    this.desembolsoService.cambiarEstado(liquidaciones).subscribe(response => {
      if (response.comun.tipo == 1) {
        this.utilsService.showNotification('Confirmación Satisfactoria', 'Confirmación', 1);
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
        this.onListarDesembolso();
      } else if (response.comun.tipo == 2) {
        this.utilsService.showNotification(response.mensaje, 'Validación', 2);
        this.utilsService.blockUIStop();
      } else if (response.comun.tipo == 0) {
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
      }
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onGenerarArchivo(): void {
    let liquidaciones = [...this.desembolsos.filter(f => f.seleccionado)];

    if (liquidaciones.length === 0) {
      this.utilsService.showNotification("Seleccione una o varias liquidaciones", "", 2);
      return;
    }

    for (const item of liquidaciones) {
      if (item.idEstado !== 3 && item.idEstado > 4) {
        this.utilsService.showNotification('Seleccione solo liquidaciones con estados "Aprobado"', 'Alerta', 2);
        return;
      } else {
        if (item.liquidacionCabSustento.filter(x => x.idTipoSustento === 2 && x.idTipo === 2).length === 0) {
          this.utilsService.showNotification('La liquidación con código ' + item.codigo + ' no contiene archivo(s) de sustento con tipo Confirmación de desembolsos', 'Alerta', 2);
          return;
        }
      }
    }

    liquidaciones.forEach(el => {
      el.idEmpresa = 1;
      el.idEstado = 4;
      el.idUsuarioAud = 1;
    });

    this.utilsService.blockUIStart('Generando archivo...');
    this.desembolsoService.cambiarEstado(liquidaciones).subscribe(response => {
      if (response.comun.tipo == 1) {
        this.utilsService.blockUIStop();
        this.utilsService.blockUIStart('Exportando archivo...');
        this.desembolsoService.export(liquidaciones).subscribe(s => {
          let blob: any = new Blob([s], {type: 'application/vnd.ms-excel'});
          const url = window.URL.createObjectURL(blob);
          fileSaver.saveAs(blob, 'Archivo'
            + this.sundayDate.year.toString()
            + this.sundayDate.month.toString().padStart(2, "0")
            + this.sundayDate.day.toString().padStart(2, "0")
            + '.xlsx');
          this.utilsService.showNotification('Generación satisfactoria', 'Confirmación', 1);
          this.utilsService.blockUIStop();
          this.onListarDesembolso();
        }, error => {
          this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
          this.utilsService.blockUIStop();
        });
      } else if (response.comun.tipo == 2) {
        this.utilsService.showNotification(response.mensaje, 'Validación', 2);
        this.utilsService.blockUIStop();
      } else if (response.comun.tipo == 0) {
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
      }
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }

  onEliminarArchivo(item): void {
    //item.remove();
    let archivo = item.nombre;
    let id = 0;
    for (const arch of this.archivosSustento.queue) {
      if (arch?.file?.name == archivo) {
        arch.remove();
        break;
      }
    }

    for (const row of this.archivos) {
      if (row.nombre === archivo) {
        this.archivos.splice(id, 1)
      }
      id = id + 1;
    }
  }

  onEliminarArchivoAdjunto(item: LiquidacionCabSustento): void {
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

  onEnviar(idTipo: number, cab: LiquidacionCab): void {
    let liquidaciones = idTipo == 1 ? [...this.desembolsos.filter(f => f.seleccionado)] : [{...cab}];

    if (idTipo == 1) {
      if (liquidaciones.length === 0) {
        this.utilsService.showNotification("Seleccione una o varias liquidaciones", "", 2);
        return;
      }
    }

    if (liquidaciones.filter(f => f.liquidacionDet.filter(f => f.edicion || f.editado).length > 0).length > 0) {
      this.utilsService.showNotification("Guarda o cancela los cambios primero", "Advertencia", 2);
      return;
    }

    // if (liquidaciones.filter(f =>
    //   f.liquidacionDet.filter(f1 =>
    //     f1.montoTotalFacturado < Number(this.montoTotalFacturadoMinimoTM[0].valor)).length > 0).length > 0) {
    //   Swal.fire({
    //     title: 'Advertencia',
    //     html: `
    //         <p style="text-align: justify">La(s) siguiente(s) liquidacion(es) no supera(n) el monto total facturado mínimo de ${this.montoTotalFacturadoMinimoTM[0].valor}. ¿Desea continuar?</p>
    //         <div class="table-responsive">
    //           <table class="table table-hover">
    //             <thead>
    //             <tr>
    //               <th>N° Liquidación</th>
    //             </tr>
    //             </thead>
    //             <tbody>
    //             ${this.onFilas2(liquidaciones)}
    //             </tbody>
    //           </table>
    //         </div>`,
    //     icon: 'warning',
    //     width: '500px',
    //     showCancelButton: true,
    //     confirmButtonText: '<i class="fa fa-check"></i> Sí',
    //     cancelButtonText: '<i class="fa fa-times"></i> No',
    //     customClass: {
    //       confirmButton: 'btn btn-warning',
    //       cancelButton: 'btn btn-secondary'
    //     },
    //   }).then(result => {
    //     if (result.value) {
    //       this._OnEnviar(liquidaciones);
    //     }
    //   });
    // } else
    //   this._OnEnviar(liquidaciones);
  }
}
