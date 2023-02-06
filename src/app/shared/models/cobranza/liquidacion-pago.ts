export class LiquidacionPago {
  nro: number;
  idLiquidacionPago: number;
  idLiquidacionDet: number;
  fechaConfirmada: string;
  fechaPago: string;
  diasMora: number;
  montoCobrar: number;
  montoPago: number;
  fondoResguardoUsado: number;
  tipoPago: string;
  interes: number;
  gastos: number;
  saldoDeuda: number;
  exceso: number;
  observacion: string;
  comprobanteGenerado1: number;
  comprobanteGenerado2: number;
  flagPagoInteresConfirming: boolean;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string;
  fechaModificacion: string;
}
