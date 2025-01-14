import {Component, Input, OnInit} from '@angular/core';
import {ClienteGastos} from "../../../../shared/models/comercial/cliente-gastos";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TablaMaestra} from "../../../../shared/models/shared/tabla-maestra";
import {UtilsService} from "../../../../shared/services/utils.service";
import {ClientesService} from "../clientes.service";
import Swal from "sweetalert2";
import { User } from 'app/shared/models/auth/user';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.scss']
})
export class GastosComponent implements OnInit {
  public currentUser: User;
  public submittedGastos: boolean;
  public gastosForm: FormGroup;
  public oldGastos: ClienteGastos;

  @Input() gastos: ClienteGastos[];
  @Input() monedas: TablaMaestra[];
  @Input() idTipoOperacion: number;

  get ReactiveIUFormGastos(): any {
    return this.gastosForm.controls;
  }

  constructor(private formBuilder: FormBuilder,
              private utilsService: UtilsService,
              private clienteService: ClientesService,) {
    this.gastosForm = this.formBuilder.group({
      idMoneda: [1],
      tasaNominalMensual: [0, [Validators.required, Validators.min(0.01)]],
      tasaNominalAnual: [0, [Validators.required, Validators.min(0.01)]],
      tasaNominalMensualMora: [{ value: 0, validators: [Validators.required, Validators.min(0.01)]}],
      tasaNominalAnualMora: [0, [Validators.required, Validators.min(0.01)]],
      financiamiento: [0],
      comisionEstructuracion: [0],
      gastosContrato: [0],
      comisionCartaNotarial: [0],
      servicioCobranza: [0],
      servicioCustodia: [0]
    });
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  }

  fGastos(id: number): ClienteGastos[] {
    return this.gastos.filter(f => f.idTipoOperacion === id);
  }

  onAgregarGastos(): void {
    if (this.gastos.filter(a => a.edicion).length > 0) {
      this.utilsService.showNotification("Primero debe finalizar la edición del registro actual (gastos)", 'Alerta', 2);
      return;
    }

    this.submittedGastos = true;
    if (this.gastosForm.invalid)
      return;

    let moneda = this.monedas.find(f => f.idColumna === this.gastosForm.controls.idMoneda.value).descripcion;
    if (this.gastos.filter(f => f.idMoneda === this.gastosForm.controls.idMoneda.value && f.idTipoOperacion === this.idTipoOperacion).length > 0) {
      this.utilsService.showNotification(`Ya existen gastos con el tipo de moneda '${moneda}'`, "", 2);
      return;
    }

    this.gastos.push({
      idClienteGastos: 0,
      idCliente: 0,
      idTipoOperacion: this.idTipoOperacion,
      idMoneda: this.gastosForm.controls.idMoneda.value,
      moneda: moneda,
      codigoMoneda: "",
      tasaNominalMensual: this.gastosForm.controls.tasaNominalMensual.value,
      tasaNominalAnual: this.gastosForm.controls.tasaNominalAnual.value,
      tasaNominalMensualMora: this.gastosForm.controls.tasaNominalMensualMora.value,
      tasaNominalAnualMora: this.gastosForm.controls.tasaNominalAnualMora.value,
      financiamiento: this.gastosForm.controls.financiamiento.value,
      comisionEstructuracion: this.gastosForm.controls.comisionEstructuracion.value,
      gastosContrato: this.gastosForm.controls.gastosContrato.value,
      comisionCartaNotarial: this.gastosForm.controls.comisionCartaNotarial.value,
      servicioCobranza: this.gastosForm.controls.servicioCobranza.value,
      servicioCustodia: this.gastosForm.controls.servicioCustodia.value,
      idFila: this.utilsService.autoIncrement(this.gastos),
      edicion: false,
      editado: true
    });
    this.gastosForm.reset();
    this.gastosForm.controls.idMoneda.setValue(1);
    this.submittedGastos = false;
  }

  onEditarGastos(item: ClienteGastos): void {
    if (this.gastos.filter(f => f.edicion && f.idFila != item.idFila).length > 0) {
      this.utilsService.showNotification("Guarda o confirma los cambios primero", "Advertencia", 2);
      return;
    }
    this.oldGastos = {
      idClienteGastos: item.idClienteGastos,
      idCliente: item.idCliente,
      idTipoOperacion: item.idTipoOperacion,
      idMoneda: item.idMoneda,
      moneda: item.moneda,
      codigoMoneda: item.codigoMoneda, //20230626 15:24
      tasaNominalMensual: item.tasaNominalMensual,
      tasaNominalAnual: item.tasaNominalAnual,
      tasaNominalMensualMora: item.tasaNominalMensualMora,
      tasaNominalAnualMora: item.tasaNominalAnualMora,
      financiamiento: item.financiamiento,
      comisionEstructuracion: item.comisionEstructuracion,
      gastosContrato: item.gastosContrato,
      comisionCartaNotarial: item.comisionCartaNotarial,
      servicioCobranza: item.servicioCobranza,
      servicioCustodia: item.servicioCustodia,
      idFila: item.idFila,
      edicion: item.edicion,
      editado: item.editado
    };
    item.edicion = true;
  }

  onCancelarGastos(item: ClienteGastos): void {
    item.idClienteGastos = this.oldGastos.idClienteGastos;
    item.idCliente = this.oldGastos.idCliente;
    item.idTipoOperacion = this.oldGastos.idTipoOperacion;
    item.idMoneda = this.oldGastos.idMoneda;
    item.moneda = this.oldGastos.moneda;
    item.codigoMoneda = this.oldGastos.codigoMoneda; //20230626 15:24
    item.tasaNominalMensual = this.oldGastos.tasaNominalMensual;
    item.tasaNominalAnual = this.oldGastos.tasaNominalAnual;
    item.tasaNominalMensualMora = this.oldGastos.tasaNominalMensualMora;
    item.tasaNominalAnualMora = this.oldGastos.tasaNominalAnualMora;
    item.financiamiento = this.oldGastos.financiamiento;
    item.comisionEstructuracion = this.oldGastos.comisionEstructuracion;
    item.gastosContrato = this.oldGastos.gastosContrato;
    item.comisionCartaNotarial = this.oldGastos.comisionCartaNotarial;
    item.servicioCobranza = this.oldGastos.servicioCobranza;
    item.servicioCustodia = this.oldGastos.servicioCustodia;
    item.idFila = this.oldGastos.idFila;
    item.edicion = this.oldGastos.edicion;
    item.editado = this.oldGastos.editado;
  }

  onConfirmarCambioGastos(item: ClienteGastos): void {
    item.moneda = this.monedas.find(f => f.idColumna === item.idMoneda).descripcion;
    item.edicion = false;
    item.editado = true;
  }

  onEliminar(item: ClienteGastos): void {
    if (item.idClienteGastos == 0) {
      this.gastos = this.gastos.filter(f => f.idFila != item.idFila);
    } else {
      Swal.fire({
        title: 'Confirmación',
        text: `¿Desea eliminar el registro?, esta acción no podrá revertirse`,
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
          this.utilsService.blockUIStart('Eliminando...');
          this.clienteService.eliminarGastos({
            idClienteGastos: item.idClienteGastos,
            idUsuarioAud: this.currentUser.idUsuario
          }).subscribe(response => {
            if (response.tipo === 1) {
              this.gastos = this.gastos.filter(f => f.idFila != item.idFila);
              this.utilsService.showNotification('Registro eliminado correctamente', 'Confirmación', 1);
              this.utilsService.blockUIStop();
            } else if (response.tipo === 2) {
              this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
            } else {
              this.utilsService.showNotification(response.mensaje, 'Error', 3);
            }

            this.utilsService.blockUIStop();
          }, error => {
            this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
            this.utilsService.blockUIStop();
          });
        }
      });
    }
  }

  onCambioTNM($event, tipoTasa: number): void {
    if (tipoTasa === 1) {
      this.gastosForm.controls.tasaNominalAnual.setValue(Math.round(((Number($event) * 12) + Number.EPSILON) * 100) / 100);
      this.gastosForm.controls.tasaNominalMensualMora.setValue(Math.round((Number($event) + Number.EPSILON) * 100) / 100);
      this.gastosForm.controls.tasaNominalAnualMora.setValue(Math.round(((Number($event) * 12) + Number.EPSILON) * 100) / 100);
    } else {
      this.gastosForm.controls.tasaNominalAnualMora.setValue(Math.round(((Number($event) * 12) + Number.EPSILON) * 100) / 100);
    }
  }

  onCambioTNM_Fila(fila: ClienteGastos, tipoTasa: number): void {
    if (tipoTasa === 1) {
      fila.tasaNominalAnual = Math.round(((fila.tasaNominalMensual * 12) + Number.EPSILON) * 100) / 100;
      fila.tasaNominalMensualMora = Math.round((fila.tasaNominalMensual + Number.EPSILON) * 100) / 100;
      fila.tasaNominalAnualMora = Math.round(((fila.tasaNominalMensual * 12) + Number.EPSILON) * 100) / 100;
    } else {
      fila.tasaNominalAnualMora = Math.round(((fila.tasaNominalMensual * 12) + Number.EPSILON) * 100) / 100;
    }
  }
}
