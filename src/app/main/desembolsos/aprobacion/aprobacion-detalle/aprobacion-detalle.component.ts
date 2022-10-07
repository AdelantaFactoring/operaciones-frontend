import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LiquidacionDet} from "../../../../shared/models/operaciones/liquidacion-det";

@Component({
  selector: 'app-aprobacion-detalle',
  templateUrl: './aprobacion-detalle.component.html',
  styleUrls: ['./aprobacion-detalle.component.scss']
})
export class AprobacionDetalleComponent implements OnInit {
  @Input() infoBanco: LiquidacionDet[];
  @Input() detalleForm: FormGroup;

  public nroCuentaBancariaDestino: string = "";
  public cciDestino: string = "";

  get ReactiveIUForm(): any {
    return this.detalleForm.controls;
  }

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    // @ts-ignore
    let info = [ ...new Map(this.infoBanco.map(x => [x["rucPagProv"], x])).values()][0]
    this.ReactiveIUForm.monedaCuentaBancariaDestino.setValue(info.monedaCuentaBancariaDestino);
    this.ReactiveIUForm.bancoDestino.setValue(info.bancoDestino);
    this.nroCuentaBancariaDestino = info.nroCuentaBancariaDestino;
    this.cciDestino = info.cciDestino;
    this.ReactiveIUForm.tipoCuentaBancariaDestino.setValue(info.tipoCuentaBancariaDestino);
  }

  onCambio() {
    this.infoBanco.forEach(el => {
      el.monedaCuentaBancariaDestino = this.ReactiveIUForm.monedaCuentaBancariaDestino.value;
      el.bancoDestino = this.ReactiveIUForm.bancoDestino.value;
      el.nroCuentaBancariaDestino = this.nroCuentaBancariaDestino;
      el.cciDestino = this.cciDestino;
      el.tipoCuentaBancariaDestino = this.ReactiveIUForm.tipoCuentaBancariaDestino.value;
    });
  }
}
