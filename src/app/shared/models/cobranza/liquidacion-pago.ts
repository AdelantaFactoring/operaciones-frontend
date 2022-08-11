export class LiquidacionPago {
  idLiquidacionPago: number;
  idLiquidacionDet: number;
  fechaConfirmada: string;
  fechaPago: string;
  diasMora: number;
  montoCobrar: number;
  montoPago: number;
  tipoPago: string;
  interes: number;
  gastos: number;
  saldoDeuda: number;
  observacion: string;
  comprobanteGenerado1: number;
  comprobanteGenerado2: number;
  flagPagoInteresConfirming: boolean;
}
