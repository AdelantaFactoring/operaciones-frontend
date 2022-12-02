import {Component, OnInit} from '@angular/core';
import {TablaMaestra} from "../../../../shared/models/shared/tabla-maestra";
import {UtilsService} from "../../../../shared/services/utils.service";
import {MaestrosService} from "../maestros.service";
import {TablaMaestraService} from "../../../../shared/services/tabla-maestra.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from "sweetalert2";

@Component({
  selector: 'app-concepto-comprobante',
  templateUrl: './concepto-comprobante.component.html',
  styleUrls: ['./concepto-comprobante.component.scss']
})
export class ConceptoComprobanteComponent implements OnInit {
  public contentHeader: any;
  public tablaMaestra: TablaMaestra[];
  public tipoAfectacion: TablaMaestra[];

  public maestroForm: FormGroup;
  public oldMaestroForm: FormGroup;

  public oldMaestro: TablaMaestra;

  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  private idTabla: number = 16;
  public submitted: boolean = false;

  constructor(private utilsService: UtilsService,
              private maestrosService: MaestrosService,
              private tablaMaestraService: TablaMaestraService,
              private formBuilder: FormBuilder) {
    this.contentHeader = {
      headerTitle: 'Concepto',
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
            name: 'Catálogos',
            isLink: false
          },
          {
            name: 'Maestros',
            isLink: false
          },
          {
            name: 'Concepto (Comprobante de pago)',
            isLink: false
          }
        ]
      }
    };
    this.maestroForm = formBuilder.group({
      idTabla: [this.idTabla],
      idColumna: [0],
      valor: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
    this.oldMaestroForm = this.maestroForm.value;
  }

  async ngOnInit(): Promise<void> {
    this.utilsService.blockUIStart('Obteniendo maestros...');
    this.tipoAfectacion = await this.onListarMaestros(22, 0);
    this.tipoAfectacion.forEach(f => f.descripcion = `${f.valor} - ${f.descripcion}`);
    this.utilsService.blockUIStop();
    this.onListar();
  }

  async onListarMaestros(idTabla: number, idColumna: number): Promise<TablaMaestra[]> {
    return await this.tablaMaestraService.listar({
      idTabla: idTabla,
      idColumna: idColumna
    }).then((response: TablaMaestra[]) => response, error => [])
      .catch(error => []);
  }

  onListar(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.maestrosService.listar({
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize,
      idTabla: this.idTabla
    }).subscribe((response: TablaMaestra[]) => {
      this.tablaMaestra = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  async onAgregar(): Promise<void> {
    this.submitted = true;
    if (this.maestroForm.invalid) return;

    let item = {
      idTabla: this.idTabla,
      idColumna: 0,
      valor: this.maestroForm.controls.valor.value,
      descripcion: this.maestroForm.controls.descripcion.value,
      totalRows: 0,
      tipoAfectacion: '',
      idTipoAfectacion: 0,
      edicion: false,
      editado: false,
      idFila: this.utilsService.autoIncrement(this.tablaMaestra),
      asignar: false
    };

    if (await this.onGuardar(item)) {
      this.onListar();
      this.submitted = false;
      this.maestroForm.reset(this.oldMaestroForm);
    }
  }

  onEditar(item: TablaMaestra): void {
    this.oldMaestro = {...item};
    item.edicion = true;
  }

  onCancelar(item: TablaMaestra): void {
    if (item.asignar) {
      item.idTipoAfectacion = this.oldMaestro.idTipoAfectacion;
      item.tipoAfectacion = this.oldMaestro.tipoAfectacion;
      item.asignar = false;
    } else {
      item.valor = this.oldMaestro.valor;
      item.descripcion = this.oldMaestro.descripcion;
      item.edicion = this.oldMaestro.edicion;
    }
  }

  onEliminar(item: TablaMaestra): void {
    if (item.idColumna == 0) {
      this.tablaMaestra = this.tablaMaestra.filter(f => f.idFila != item.idFila);
    } else {
      Swal.fire({
        title: 'Confirmación',
        text: `¿Desea eliminar el registro "${item.valor}"?, esta acción no podrá revertirse`,
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
          // item.estado = false;
          // item.editado = true;
        }
      });
    }
  }

  async onConfirmarCambio(item: TablaMaestra): Promise<void> {
    if (item.asignar) {
      item.idTipoAfectacion = item.idTipoAfectacion;
      item.tipoAfectacion = this.tipoAfectacion.find(f => f.idColumna === item.idTipoAfectacion).descripcion;
      item.asignar = false;
    } else {
      if (this.onInvalido(item)) return;
      if (await this.onGuardar(item)) {
        item.edicion = false;
        item.editado = true;
        this.onListar();
      }
    }
  }

  onAsignar(item: TablaMaestra): void {
    this.oldMaestro = {...item};
    item.asignar = true;
  }

  onInvalido(item: TablaMaestra): boolean {
    if (item.valor === '' || item.descripcion === '')
      return true;

    return false;
  }

  private async onGuardar(item: TablaMaestra): Promise<boolean> {
    this.utilsService.blockUIStart("Guardando...");
    let response = await this.maestrosService.guardarAsync(item)
      .then((response: any) => response, error => null)
      .catch(error => null);

    let res = false;
    switch (response.tipo) {
      case 1:
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        res = true;
        break;
      case 2:
        this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
        this.utilsService.blockUIStop();
        res = false;
        break;
      default:
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
        res = false;
        break;
    }

    return res;
  }
}
