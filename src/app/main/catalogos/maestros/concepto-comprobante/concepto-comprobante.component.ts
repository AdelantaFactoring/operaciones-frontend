import {Component, OnInit} from '@angular/core';
import {TablaMaestra} from "../../../../shared/models/shared/tabla-maestra";
import {UtilsService} from "../../../../shared/services/utils.service";
import {MaestrosService} from "../maestros.service";
import {TablaMaestraService} from "../../../../shared/services/tabla-maestra.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from "sweetalert2";
import {TablaMaestraRelacion} from 'app/shared/models/shared/tabla-maestra-relacion';
import {User} from "../../../../shared/models/auth/user";

@Component({
  selector: 'app-concepto-comprobante',
  templateUrl: './concepto-comprobante.component.html',
  styleUrls: ['./concepto-comprobante.component.scss']
})
export class ConceptoComprobanteComponent implements OnInit {
  public currentUser: User;
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
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.utilsService.blockUIStart('Obteniendo maestros...');
    this.tipoAfectacion = await this.onListarMaestros(22, 0);
    this.tipoAfectacion.forEach(f => f.descripcion = `${f.valor} - ${f.descripcion}`);
    this.utilsService.blockUIStop();
    await this.onListar();
  }

  async onListarMaestros(idTabla: number, idColumna: number): Promise<TablaMaestra[]> {
    return await this.tablaMaestraService.listar({
      idTabla: idTabla,
      idColumna: idColumna
    }).then((response: TablaMaestra[]) => response, error => [])
      .catch(error => []);
  }

  async onListar(): Promise<void> {
    this.utilsService.blockUIStart('Obteniendo información...');
    await this.maestrosService.listarAsync({
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize,
      idTabla: this.idTabla
    }).then(async (response: TablaMaestra[]) => {
      this.tablaMaestra = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;

      await this.maestrosService.listarRelacionAsync({
        idTabla1: this.idTabla,
        idTabla2: 22
      }).then((response: TablaMaestraRelacion[]) => {
        for (let el of this.tablaMaestra) {
          let rel = response.find(f => f.idColumna_1 === el.idColumna);
          el.idTipoAfectacion = rel != null ? rel.idColumna_2 : 0;
          el.tipoAfectacion = rel != null ? rel.valor_2 + ' - ' + rel.descripcion_2 : '';
        }
      }).catch(error => []);

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
    if (this.tablaMaestra.filter(f => f.edicion).length > 0) {
      this.utilsService.showNotification("Termine una edición primero.", 'alerta', 2);
      return;
    }

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
      if (item.idTipoAfectacion === 0) return;
      if (await this.onGuardarRelacion(item)) {
        item.tipoAfectacion = this.tipoAfectacion.find(f => f.idColumna === item.idTipoAfectacion).descripcion;
        item.asignar = false;
      }
    } else {
      if (this.onInvalido(item)) return;
      if (await this.onGuardar(item)) {
        item.edicion = false;
        item.editado = true;
        await this.onListar();
      }
    }
  }

  onAsignar(item: TablaMaestra): void {
    if (this.tablaMaestra.filter(f => f.asignar).length > 0) {
      this.utilsService.showNotification("Termine una asignación primero.", 'alerta', 2);
      return;
    }
    this.oldMaestro = {...item};
    item.asignar = true;
  }

  onInvalido(item: TablaMaestra): boolean {
    if (item.valor === '' || item.descripcion === '')
      return true;

    return false;
  }

  private async onGuardarRelacion(item: TablaMaestra): Promise<boolean> {
    this.utilsService.blockUIStart("Guardando...");
    let response = await this.maestrosService.guardarRelacionAsync({
      idTabla_1: this.idTabla,
      idColumna_1: item.idColumna,
      idTabla_2: 22,
      idColumna_2: item.idTipoAfectacion,
      idUsuarioAud: this.currentUser.idUsuario
    }).then((response: any) => response, error => null)
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
