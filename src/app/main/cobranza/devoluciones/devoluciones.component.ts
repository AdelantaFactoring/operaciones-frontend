import { Component, OnInit } from '@angular/core';
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
  public nroCuentaBancariaDestino: string;
  public cciDestino: string;

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
      titularCuentaBancariaDestino: ['', Validators.required],
      monedaCuentaBancariaDestino: ['', Validators.required],
      bancoDestino: ['', Validators.required],
      tipoCuentaBancariaDestino: ['-', Validators.required]
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
    this.nroCuentaBancariaDestino = item.nroCuenta;
    this.cciDestino = item.cci;
    this.devolucionForm.controls.tipoCuentaBancariaDestino.setValue(item.tipoCuenta);
    // this.codigoMonedaDet = item.codigoMoneda;
    // this.moneda = item.moneda;
    // this.tipoCambioMoneda = 0;
    modal.dismiss("Cross Click");
  }

  onEditar(modal: any, cab: LiquidacionDevolucion): void {
    this.ver = cab.idEstado == 2 ? true : false;
    this.devolucionForm.controls.idLiquidacionDevolucion.setValue(cab.idLiquidacionDevolucion);
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
    this.devolucionForm.controls.montoConversion.setValue(cab.montoConversion);
    this.devolucionForm.controls.titularCuentaBancariaDestino.setValue(cab.titularCuentaBancariaDestino);
    this.devolucionForm.controls.monedaCuentaBancariaDestino.setValue(cab.monedaCuentaBancariaDestino);
    this.devolucionForm.controls.bancoDestino.setValue(cab.bancoDestino);
    this.nroCuentaBancariaDestino = cab.nroCuentaBancariaDestino;
    this.cciDestino = cab.cciDestino;
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

  }

  onCancelar(): void {

  }
}
