import { LiquidacionCab } from "../operaciones/liquidacion-cab";
import { LiquidacionDet } from "../operaciones/liquidacion-det";
import { LiquidacionCabSustento } from "../operaciones/LiquidacionCab-Sustento";

export class Dashboard {
  empresaCuenta: string;
  liquidacionCab: LiquidacionCab[];
  liquidacionDet: LiquidacionDet[];
  liquidacionCabSustento: LiquidacionCabSustento[];
  //liquidacionCabSeleccionados: LiquidacionCabSeleccionados[];
  liquidacionDevolucion: string;
  liquidacionDevolucionSustento: null;
  liquidacionDocumentoCab: null;
  liquidacionDocumentoDet: null;

  idLiquidacionCab: number;
  idMoneda: number;
  codMoneda: string;
  flagSeleccionado: boolean;
  idEjecutivo: number;
  usuario: string;
  idPagador: number;
  rucPagador: string;
  pagador: string;
  pagadorSector: string;
  nuevoMontoTotal: number;
  porcentajePagoTotal: number;
  saldoTotal: number;
  idTipoOperacion: number;
  detalle: Detalle[];

  cambiarIcono: boolean = false;

  netoConfirmado: number;
  pagoTotal: number;

  
  flagPagoInteresAdelantado: boolean;
  interesConIGV_Total: number;
  gastosDiversosConIGV_Total: number;
  montoFacturado_Total: number;
}

export class Detalle {
  pagador: string;
  monto: number;
  recaudado: number;
}
