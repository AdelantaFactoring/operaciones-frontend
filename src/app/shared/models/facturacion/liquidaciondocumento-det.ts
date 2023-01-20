export class LiquidacionDocumentoDet {
  idLiquidacionDocumentoDet: number;
  idLiquidacionDocumentoCab: number;
  idTipoAfectacion: number;
  codigoTipoAfectacion: string;
  tipoAfectacion: string;
  codigo: string;
  concepto: string;
  um: string;
  uM_Desc: string;
  cantidad: number;
  precioUnitario: number;
  precioUnitarioIGV: number;
  montoTotal: number;
  total: number = 0;
  nroDocumentoReferencia: string;
  estado: boolean;

  idFila: number;
  edicion: boolean = false;
  editado: boolean = false;
}
