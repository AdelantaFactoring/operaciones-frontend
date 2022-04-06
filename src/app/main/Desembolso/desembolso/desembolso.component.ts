import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from 'app/auth/login/login.component';
import { ClientesService } from 'app/main/comercial/clientes/clientes.service';
import { DESEMBOLSO } from 'app/shared/helpers/url/desembolso';
import { Archivo } from 'app/shared/models/comercial/archivo';
import { ClienteCuenta } from 'app/shared/models/comercial/cliente-cuenta';
import { SolicitudCab } from 'app/shared/models/comercial/solicitudCab';
import { LiquidacionCab } from 'app/shared/models/operaciones/liquidacion-cab';
import { LiquidacionDet } from 'app/shared/models/operaciones/liquidacion-det';
import { LiquidacionCabSustento } from 'app/shared/models/operaciones/LiquidacionCab-Sustento';
import { LiquidacionCabSeleccionados } from 'app/shared/models/operaciones/liquidacionCab_Seleccionados';
import { TablaMaestra } from 'app/shared/models/shared/tabla-maestra';
import { TablaMaestraService } from 'app/shared/services/tabla-maestra.service';
import { UtilsService } from 'app/shared/services/utils.service';
import { environment } from 'environments/environment';
import { FileUploader } from 'ng2-file-upload';
import { DesembolsoService } from './desembolso.service';
import * as fileSaver from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-desembolso',
  templateUrl: './desembolso.component.html',
  styleUrls: ['./desembolso.component.scss']
})
export class DesembolsoComponent implements OnInit {
  public contentHeader: object;

  public solicitudForm: FormGroup;
  public search: string = '';
  public page: number = 1;
  public pageSize: number = 10;
  public collectionSize: number;
  public desembolso: LiquidacionCab[] = [];
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
    private desembolsoService: DesembolsoService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private clienteService: ClientesService,
    private tablaMaestraService: TablaMaestraService
  ) { 
    this.contentHeader = {
      headerTitle: 'Desembolso',
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
            name: 'Desembolso',
            isLink: false
          },
          {
            name: 'Aprobación Desembolso',
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
      tipoCambioDollar: [{value: 0, disabled: false}],
      montoConvertido: [{value: 0, disabled: true}, Validators.required]
    });
  };

  async ngOnInit(): Promise<void> {
    this.onListarDesembolso();
    this.tiposArchivos = await this.onListarMaestros(6, 0);
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
      this.desembolso = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onConformimar(): void{

  }

  onGuardar(): void {
    this.submitted = true;
    if (this.solicitudForm.invalid)
      return;
    if (this.tipoCambioMoneda === 0 && this.codigoMonedaCab !== this.codigoMonedaDet)
      return;

    this.utilsService.blockUIStart("Guardando...");
    if (this.sustentosOld.length === 0)
      for (let item of this.sustentos) {
        this.sustentosOld.push({
          idLiquidacionCabSustento: item.idLiquidacionCabSustento,
          idLiquidacionCab: item.idLiquidacionCab,
          idTipoSustento: item.idTipoSustento,
          tipoSustento: item.tipoSustento,
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
          idLiquidacionCabSustento: item.idLiquidacionCabSustento,
          idLiquidacionCab: item.idLiquidacionCab,
          idTipoSustento: item.idTipoSustento,
          tipoSustento: item.tipoSustento,
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
        idLiquidacionCabSustento: 0,
        idLiquidacionCab: 0,
        idTipoSustento: 0,
        tipoSustento: "",
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
          base64: ""
        });
      }
    }
  }

  onConfirmar(): void{

  }

  onSeleccionarTodo(): void {
    this.desembolso.forEach(el => {
      if(el.checkList)
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
    this.desembolso.forEach(el => {
      el.cambiarIcono = this.cambiarIcono;
      document.getElementById('tr' + el.idLiquidacionCab).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
      document.getElementById('detail' + el.idLiquidacionCab).style.display = (el.cambiarIcono) ? "block" : "none";
    });
  }
  onEditar(item: LiquidacionCab, modal: any): void {
    
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
    this.solicitudForm.controls.tipoCambioDollar.setValue(item.tipoCambioMoneda);
  
    this.tipoCambioMoneda = item.tipoCambioMoneda;

    this.solicitudForm.controls.montoTotal.setValue(item.nuevoMontoTotal);
    this.solicitudForm.controls.titularCuentaBancariaDestino.setValue(item.titularCuentaBancariaDestino);
    this.solicitudForm.controls.monedaCuentaBancariaDestino.setValue(item.monedaCuentaBancariaDestino);
    this.solicitudForm.controls.bancoDestino.setValue(item.bancoDestino);
    this.nroCuentaBancariaDestino = item.nroCuentaBancariaDestino;
    this.cciDestino = item.cciDestino;
    this.solicitudForm.controls.tipoCuentaBancariaDestino.setValue(item.tipoCuentaBancariaDestino);
    this.solicitudForm.controls.idTipoCT.setValue(item.idTipoCT);

    // this.detalle = item.solicitudDet;
    this.sustentos = item.liquidacionCabSustento;
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
    //this.submitted = false;
    // this.sustentosOld = [];
    // this.nroCuentaBancariaDestino = "";
    // this.cciDestino = "";
    this.solicitudForm.reset();
    // this.onListarSolicitudes();
    // this.archivos = [];
    this.codigo = "";
    //this.archivosSustento.clearQueue();
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
    modal.dismiss("Cross Click");
  }
  
  onConvertirMontoTotal(): void
  { 
    if (this.codigoMonedaCab != this.codigoMonedaDet) {
      if (this.codigoMonedaCab == "PEN") {
        this.montoConvertido = Math.round((this.totalMontoDescembolso / this.tipoCambioMoneda) * 100) / 100;
        this.solicitudForm.controls.montoConvertido.setValue(this.montoConvertido);
      }
      else
      {
        this.montoConvertido = Math.round((this.totalMontoDescembolso * this.tipoCambioMoneda) * 100) / 100;
        this.solicitudForm.controls.montoConvertido.setValue(this.montoConvertido);
      }
    }
  }

  onAprobar(idEstado: number, tipo: number): void {
    // @ts-ignore
    let liquidaciones = [...this.desembolso.filter(f => f.seleccionado)];

    
    if (liquidaciones.length === 0) {
      this.utilsService.showNotification("Seleccione una o varias liquidaciones", "", 2);
      return;
    }

    liquidaciones.forEach(el => {
      el.idEstado = idEstado;
      el.idUsuarioAud = 1;
    });
    
    if (tipo == 2) {
      for (const item of liquidaciones) {
        if (item.liquidacionCabSustento.length === 0) {
          this.utilsService.showNotification('La liquidación con codigo ' + item.codigo + ' no contiene un(os) archivo(s) de sustento', 'Alerta', 2);
          return;
        }
      }
    }
    
    this.utilsService.blockUIStart('Aprobando...');
    this.desembolsoService.cambiarEstado(liquidaciones).subscribe(response => {
      if (response.tipo == 1) {
        this.utilsService.showNotification('Aprobación Satisfactoria', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onGenerarArchivo(liquidaciones);
        if (tipo != 2) {
          this.onListarDesembolso();
        }
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

  onGenerarArchivo(item): void{
    
    this.utilsService.blockUIStart('Exportando archivo EXCEL...');

    this.desembolsoService.export(item).subscribe(s => {
      let blob: any = new Blob([s], { type: 'application/vnd.ms-excel' });
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, 'Archivo'
        + this.sundayDate.year.toString()
        + this.sundayDate.month.toString().padStart(2, "0")
        + this.sundayDate.day.toString().padStart(2, "0")
        + '.xlsx');
      this.utilsService.showNotification('No todas las lineas de programa han sido incluidas en el Excel', 'Operación satisfactoria', 4);
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });
  }
 
  onEliminarArchivo(item): void{
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

}