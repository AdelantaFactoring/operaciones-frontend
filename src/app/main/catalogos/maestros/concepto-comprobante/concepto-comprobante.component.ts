import {Component, OnInit} from '@angular/core';
import {TablaMaestra} from "../../../../shared/models/shared/tabla-maestra";
import {UtilsService} from "../../../../shared/services/utils.service";
import {MaestrosService} from "../maestros.service";
import {TablaMaestraService} from "../../../../shared/services/tabla-maestra.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from "sweetalert2";
import {TablaMaestraRelacion} from 'app/shared/models/shared/tabla-maestra-relacion';
import {User} from "../../../../shared/models/auth/user";
import {ContentHeader} from "../../../../layout/components/content-header/content-header.component";

@Component({
  selector: 'app-concepto-comprobante',
  templateUrl: './concepto-comprobante.component.html',
  styleUrls: ['./concepto-comprobante.component.scss']
})
export class ConceptoComprobanteComponent implements OnInit {
  public currentUser: User;
  public contentHeader: ContentHeader;
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
          const rel = response.find(f => f.idColumna_1 === el.idColumna);
          el.idTablaMaestraRelacion = rel != null ? rel.idTablaMaestraRelacion : 0;
          el.idColumna2 = rel != null ? rel.idColumna_2 : 0;
          el.descripcion2 = rel != null ? rel.valor_2 + ' - ' + rel.descripcion_2 : '';
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
      descripcion2: '',
      idColumna2: 0,
      idTablaMaestraRelacion: 0,
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
      item.idColumna2 = this.oldMaestro.idColumna2;
      item.descripcion2 = this.oldMaestro.descripcion2;
      item.asignar = false;
    } else {
      item.valor = this.oldMaestro.valor;
      item.descripcion = this.oldMaestro.descripcion;
      item.edicion = this.oldMaestro.edicion;
    }
  }

  onEliminar(item: TablaMaestra): void {
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
        this.utilsService.blockUIStart("Eliminando...");
        this.maestrosService.eliminar({
          idTabla: item.idTabla,
          idColumna: item.idColumna,
          idUsuarioAud: this.currentUser.idUsuario
        }).subscribe((response: any) => {
          switch (response.tipo) {
            case 1:
              this.utilsService.blockUIStop();
              this.utilsService.showNotification("Eliminación satisfactoria", "", 1);
              this.onListar();
              break;
            case 2:
              this.utilsService.blockUIStop();
              this.utilsService.showNotification(response.mensaje, "Validación", 2);
              break;
            case 0:
              this.utilsService.blockUIStop();
              this.utilsService.showNotification(response.mensaje, "", 3);
              break;
          }
        }, error => {
          this.utilsService.blockUIStop();
          this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
        });
      }
    });
  }

  async onConfirmarCambio(item: TablaMaestra): Promise<void> {
    if (item.asignar) {
      if (item.idColumna2 === 0) return;
      if (await this.onGuardarRelacion(item)) {
        //item.descripcion2 = this.tipoAfectacion.find(f => f.idColumna === item.idColumna2).descripcion;
        //item.asignar = false;
        await this.onListar();
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
      idTablaMaestraRelacion: item.idTablaMaestraRelacion,
      idTabla_1: this.idTabla,
      idColumna_1: item.idColumna,
      idTabla_2: 22,
      idColumna_2: item.idColumna2,
      idTipoRelacion_1: 0,
      idTipoRelacion_2: 0,
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
