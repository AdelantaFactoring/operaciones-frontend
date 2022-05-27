export class LiquidacionDocumentoDet {
  idLiquidacionDocumentoDet: number;
  idLiquidacionDocumentoCab: number;
  codigo: string;
  concepto: string;
  um: string;
  cantidad: number;
  precioUnitario: number;
  precioUnitarioIGV: number;
  montoTotal: number;
  estado: boolean;

  idFila: number;
  edicion: boolean = false;
  editado: boolean = false;
}
