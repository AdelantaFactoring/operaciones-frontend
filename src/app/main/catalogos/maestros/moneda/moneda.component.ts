import {Component, OnInit} from '@angular/core';
import {User} from "../../../../shared/models/auth/user";
import {TablaMaestra} from "../../../../shared/models/shared/tabla-maestra";
import {UtilsService} from "../../../../shared/services/utils.service";
import {MaestrosService} from "../maestros.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-moneda',
  templateUrl: './moneda.component.html',
  styleUrls: ['./moneda.component.scss']
})
export class MonedaComponent implements OnInit {
  public currentUser: User;
  public contentHeader: any;
  public tablaMaestra: TablaMaestra[] = [];
  public oldMaestro: TablaMaestra;
  public monedaForm: FormGroup;
  public oldMonedaForm: FormGroup;

  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  private idTabla: number = 1;
  public submitted: boolean;

  constructor(private utilsService: UtilsService,
              private maestrosService: MaestrosService,
              private formBuilder: FormBuilder) {
    this.contentHeader = {
      headerTitle: 'N° Comprobante (ND)',
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
            name: 'N° Comprobante (ND)',
            isLink: false
          }
        ]
      }
    };
    this.monedaForm = formBuilder.group({
      idTabla: [this.idTabla],
      idColumna: [0],
      valor: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
    this.oldMonedaForm = this.monedaForm.value;
  }

  ngOnInit(): void {
    this.onListar();
  }

  onListar(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.maestrosService.listar({
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize,
      idTabla: this.idTabla
    }).subscribe(async (response: TablaMaestra[]) => {
      this.tablaMaestra = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
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
    item.valor = this.oldMaestro.valor;
    item.descripcion = this.oldMaestro.descripcion;
    item.edicion = this.oldMaestro.edicion;
  }

  async onConfirmarCambio(item: TablaMaestra): Promise<void> {
    if (await this.onGuardar(item)) {
      item.edicion = false;
    }
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

  async onAgregar(): Promise<void> {
    this.submitted = true;
    if (this.monedaForm.invalid) return;

    let item = {
      idTabla: this.idTabla,
      idColumna: 0,
      valor: this.monedaForm.controls.valor.value,
      descripcion: this.monedaForm.controls.descripcion.value,
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
      this.monedaForm.reset(this.oldMonedaForm);
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
          idUsuarioAud: 0
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
}
