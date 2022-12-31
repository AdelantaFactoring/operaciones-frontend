import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GastosMora} from 'app/shared/models/catalogos/gastos-mora';
import {TablaMaestra} from "../../../shared/models/shared/tabla-maestra";
import {TablaMaestraService} from "../../../shared/services/tabla-maestra.service";
import {UtilsService} from "../../../shared/services/utils.service";
import {User} from "../../../shared/models/auth/user";
import {TablaMaestraRelacion} from "../../../shared/models/shared/tabla-maestra-relacion";
import {GastosMoraService} from "./gastos-mora.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-gastos-mora',
  templateUrl: './gastos-mora.component.html',
  styleUrls: ['./gastos-mora.component.scss']
})
export class GastosMoraComponent implements OnInit {
  private currentUser: User;
  public contentHeader: any;
  public gastosMoraForm: FormGroup;
  public oldGastosMoraForm: FormGroup;

  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  public submitted: boolean = false;
  public moneda: TablaMaestra[];
  public gastosMora: GastosMora[];
  public oldGastosMora: GastosMora;

  constructor(
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private tablaMaestraService: TablaMaestraService,
    private gastosMoraService: GastosMoraService
  ) {
    this.contentHeader = {
      headerTitle: 'Gastos por Mora',
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
            name: 'Gastos por Mora',
            isLink: false
          }
        ]
      }
    };
    this.gastosMoraForm = formBuilder.group({
      idGastosMora: [0],
      moneda: [null, Validators.required],
      dias: [null, Validators.required],
      monto: [null, Validators.required]
    });
    this.oldGastosMoraForm = this.gastosMoraForm.value;
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.utilsService.blockUIStart('Obteniendo maestros...');
    this.moneda = await this.onListarMaestros(1, 0);
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
    this.gastosMoraService.listar({
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe(async (response: GastosMora[]) => {
      this.gastosMora = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onAgregar(): void {
    this.submitted = true;
    if (this.gastosMoraForm.invalid) return;

    this.utilsService.blockUIStart('Guardando...');
    this.gastosMoraService.guardar({
      idGastosMora: 0,
      idMoneda: this.gastosMoraForm.controls.moneda.value,
      dias: this.gastosMoraForm.controls.dias.value,
      monto: this.gastosMoraForm.controls.monto.value,
      idUsuarioAud: this.currentUser.idUsuario
    }).subscribe((response: any) => {
      switch (response.tipo) {
        case 1:
          this.utilsService.blockUIStop();
          this.utilsService.showNotification("Información actualizada", "", 1);
          this.onListar();
          this.gastosMoraForm.reset(this.oldGastosMoraForm);
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

  onEditar(item: GastosMora): void {
    if (this.gastosMora.filter(f => f.edicion).length > 0) {
      this.utilsService.showNotification("Termine una edición primero.", 'alerta', 2);
      return;
    }
    this.oldGastosMora = {...item};
    item.edicion = true;
  }

  onCancelar(item: GastosMora): void {
    item.idMoneda = this.oldGastosMora.idMoneda;
    item.moneda = this.oldGastosMora.moneda;
    item.dias = this.oldGastosMora.dias;
    item.monto = this.oldGastosMora.monto;
    item.edicion = this.oldGastosMora.edicion;
  }

  onEliminar(item: GastosMora): void {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Desea eliminar el registro seleccionado?, esta acción no podrá revertirse`,
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

      }
    });
  }

  onConfirmarCambio(item: GastosMora): void {
    if ((item.idMoneda === 0 || item.idMoneda === null) || item.dias === null || item.monto === null) return;

    this.utilsService.blockUIStart('Guardando...');
    this.gastosMoraService.guardar({
      idGastosMora: item.idGastosMora,
      idMoneda: item.idMoneda,
      dias: item.dias,
      monto: item.monto,
      idUsuarioAud: this.currentUser.idUsuario
    }).subscribe((response: any) => {
      switch (response.tipo) {
        case 1:
          this.utilsService.blockUIStop();
          this.utilsService.showNotification("Información actualizada", "", 1);
          this.onListar();
          this.gastosMoraForm.reset(this.oldGastosMoraForm);
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
}
