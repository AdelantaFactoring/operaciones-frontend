import {Component, OnInit} from '@angular/core';
import {TablaMaestra} from "../../../../shared/models/shared/tabla-maestra";
import {ContentHeader} from "../../../../layout/components/content-header/content-header.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilsService} from "../../../../shared/services/utils.service";
import {MaestrosService} from "../maestros.service";
import {TablaMaestraRelacion} from "../../../../shared/models/shared/tabla-maestra-relacion";
import {User} from "../../../../shared/models/auth/user";
import {TablaMaestraService} from "../../../../shared/services/tabla-maestra.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-tipo-operacion',
  templateUrl: './tipo-operacion.component.html',
  styleUrls: ['./tipo-operacion.component.scss']
})
export class TipoOperacionComponent implements OnInit {
  public contentHeader: ContentHeader;
  private currentUser: User;
  public pageSize: number = 10;
  public search: string = '';
  public collectionSize: number = 0;
  public page: number = 1;

  public tipoOperacionForm: FormGroup;
  private oldTipoOperacionForm: FormGroup;
  public submitted: boolean;
  public tablaMaestra: TablaMaestra[] = [];
  public tablaMaestraRelacion: TablaMaestraRelacion[] = [];
  private idTabla: number = 4;
  public concepto: TablaMaestra[] = [];
  //private oldMaestro: TablaMaestra;
  public mostrarSubTipo: boolean = false;


  constructor(private utilsService: UtilsService,
              private maestrosService: MaestrosService,
              private tablaMaestraService: TablaMaestraService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,) {
    this.contentHeader = {
      headerTitle: 'Tipo Operación',
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
            name: 'Tipo Operación',
            isLink: false
          }
        ]
      }
    };
    this.tipoOperacionForm = formBuilder.group({
      idTabla: [this.idTabla],
      idColumna: [0],
      valor: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
    this.oldTipoOperacionForm = this.tipoOperacionForm.value;
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.utilsService.blockUIStart('Obteniendo maestros...');
    this.concepto = await this.onListarMaestros(16, 0);
    this.concepto.forEach(f => f.descripcion = `${f.valor} - ${f.descripcion}`);
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
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  // onCancelar(item: TablaMaestra): void {
  //   if (item.asignar) {
  //     item.idColumna2 = this.oldMaestro.idColumna2;
  //     item.descripcion2 = this.oldMaestro.descripcion2;
  //     item.asignar = false;
  //   }
  // }
  //
  // async onConfirmarCambio(item: TablaMaestra): Promise<void> {
  //   if (item.asignar) {
  //     if (item.idColumna2 === 0) return;
  //     if (await this.onGuardarRelacion(item)) {
  //       item.descripcion2 = this.concepto.find(f => f.idColumna === item.idColumna2).descripcion;
  //       item.asignar = false;
  //     }
  //   }
  // }
  //
  private async onGuardarRelacion(item: TablaMaestraRelacion): Promise<boolean> {
    let response = await this.maestrosService.guardarRelacionAsync({
      idTablaMaestraRelacion: item.idTablaMaestraRelacion,
      idTabla_1: this.idTabla,
      idColumna_1: item.idColumna_1,
      idTabla_2: 16,
      idColumna_2: item.idColumna_2,
      idTipoRelacion_1: item.idTipoRelacion_1,
      idTipoRelacion_2: item.idTipoRelacion_2,
      idUsuarioAud: this.currentUser.idUsuario
    }).then((response: any) => response, error => null)
      .catch(error => null);

    return response.tipo === 1;
  }

  async onAsignar(item: TablaMaestra, modal): Promise<void> {
    this.mostrarSubTipo = [1].includes(item.idColumna);
    await this.maestrosService.listarRelacionAsync({
      idTabla1: this.idTabla,
      idTabla2: 16
    }).then((response: TablaMaestraRelacion[]) => {
      this.tablaMaestraRelacion = response.filter(f => f.idColumna_1 === item.idColumna);
      // for (let el of this.tablaMaestra) {
      //   let rel = response.find(f => f.idColumna_1 === el.idColumna);
      //   el.idColumna2 = rel != null ? rel.idColumna_2 : 0;
      //   el.descripcion2 = rel != null ? rel.valor_2 + ' - ' + rel.descripcion_2 : '';
      // }
      setTimeout(() => {
        this.modalService.open(modal, {
          scrollable: true,
          backdrop: 'static',
          //windowClass: 'my-class1',
          animation: true,
          size: 'lg',
          beforeDismiss: () => {
            return true;
          }
        });
      }, 0);
    }).catch(error => []);
  }

  async onGuardarAsignacion(modal: any): Promise<void> {
    let count: number = 0;
    const save = this.tablaMaestraRelacion.filter(f => f.editado);
    if (save.length === 0) return;
    this.utilsService.blockUIStart("Guardando...");
    for (const item of save) {
      if (item.idColumna_2 === 0) continue;
      if (await this.onGuardarRelacion(item)) {
        item.editado = false;
        count++;
      }
    }

    if (save.length === count) {
      this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
      this.utilsService.blockUIStop();
    } else if (save.length === count) {
      this.utilsService.showNotification(`${count} de ${save.length} guardado(s) correctamente`, 'Información', 4);
      this.utilsService.blockUIStop();
    } else if (count === 0) {
      this.utilsService.showNotification(`Error al actualizar`, 'Error', 3);
      this.utilsService.blockUIStop();
    }

    modal.dismiss();
  }

  onCancelarAsignacion(modal: any): void {
    modal.dismiss();
  }
}
