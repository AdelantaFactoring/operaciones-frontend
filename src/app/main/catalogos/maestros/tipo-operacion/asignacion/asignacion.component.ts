import {Component, Input, OnInit} from '@angular/core';
import {TablaMaestraRelacion} from "../../../../../shared/models/shared/tabla-maestra-relacion";
import {TablaMaestra} from "../../../../../shared/models/shared/tabla-maestra";

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.scss']
})
export class AsignacionComponent implements OnInit {
  @Input() asignaciones: TablaMaestraRelacion[];
  @Input() concepto: TablaMaestra[];
  @Input() mostrarSubTipo: boolean;

  constructor() { }

  ngOnInit(): void {

  }

  onTipoRelacion(idTipoRelacion_1: number): string {
    switch (idTipoRelacion_1) {
      case 1:
        return "Regular";
      case 2:
        return "Alterno";
      default:
        return "";
    }
  }

  onTipoConcepto(idTipoRelacion_2: number): string {
    switch (idTipoRelacion_2) {
      case 1:
        return "Interés";
      case 2:
        return "Gastos";
      case 3:
        return "Comisión Administrativo";
      default:
        return "";
    }
  }

  onEdicion(item: TablaMaestraRelacion): void {
    item.editado = true;
  }
}
