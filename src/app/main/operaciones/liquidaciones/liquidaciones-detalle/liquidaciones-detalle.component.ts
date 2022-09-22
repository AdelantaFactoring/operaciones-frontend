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
  @Input() mostrar: string;
  @Input() dataCab: LiquidacionCab;
  @Input() dataDet: LiquidacionDet;

  public detalleForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

  }

  onCalcular(cab: LiquidacionCab, det: LiquidacionDet): void {
    let diasEfectivo = det.diasEfectivo;
    if (cab.idTipoOperacion != 2) {
      const fecConfirmado = new Date(parseInt(det.fechaConfirmado.split('/')[2]),
        parseInt(det.fechaConfirmado.split('/')[1]) - 1,
        parseInt(det.fechaConfirmado.split('/')[0]), 0, 0, 0);
      const fecOperacion = new Date(parseInt(det.fechaOperacionFormat.split('/')[2]),
        parseInt(det.fechaOperacionFormat.split('/')[1]) - 1,
        parseInt(det.fechaOperacionFormat.split('/')[0]), 0, 0, 0);

      const diffTime = Math.abs(fecOperacion.getTime() - fecConfirmado.getTime());
      diasEfectivo = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    det.diasEfectivo = diasEfectivo;

    if (cab.idTipoOperacion != 2) {
      det.interes = Math.round((det.montoCobrar * ((det.tasaNominalAnual / 100) / 360) * det.diasEfectivo) * 100) / 100;
      det.interesIGV = (cab.idTipoOperacion == 1 && !cab.alterno) ? 0 : Math.round((det.interes * (det.igv / 100)) * 100) / 100;
      det.interesConIGV = det.interes + det.interesIGV;
    }
    det.gastosDiversos = det.gastosContrato + det.gastoVigenciaPoder + det.servicioCustodia
      + det.servicioCobranza + det.comisionCartaNotarial;
    det.gastosDiversosIGV = Math.round((det.gastosDiversos * (det.igv / 100)) * 100) / 100;
    det.gastosDiversosConIGV = Math.round((det.gastosDiversos + det.gastosDiversosIGV) * 100) / 100;
    det.montoTotalFacturado = Math.round((det.gastosDiversosConIGV + det.interesConIGV) * 100) / 100;
    if (cab.idTipoCT != 1)
      det.montoDesembolso = (cab.idTipoOperacion != 3) ? Math.round(((det.montoCobrar - det.montoTotalFacturado - det.comisionEstructuracionConIGV) + det.montoNotaCreditoDevolucion) * 100) / 100 : det.montoDesembolso;

    det.editado = true;
  }

  onCambiarFechaOperacion($event: any, cab: LiquidacionCab, item: LiquidacionDet) {
    item.fechaOperacionFormat = `${String($event.day).padStart(2, '0')}/${String($event.month).padStart(2, '0')}/${$event.year}`;
    item.editado = true;
    this.onCalcular(cab, item);
  }
}
