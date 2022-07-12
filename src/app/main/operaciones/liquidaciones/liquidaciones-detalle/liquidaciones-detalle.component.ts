import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {LiquidacionDet} from "../../../../shared/models/operaciones/liquidacion-det";
import {LiquidacionCab} from "../../../../shared/models/operaciones/liquidacion-cab";

@Component({
  selector: 'app-liquidaciones-detalle',
  templateUrl: './liquidaciones-detalle.component.html',
  styleUrls: ['./liquidaciones-detalle.component.scss']
})
export class LiquidacionesDetalleComponent implements OnInit {
  @Input() dataCab: LiquidacionCab;
  @Input() dataDet: LiquidacionDet;

  public detalleForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

  }

}
