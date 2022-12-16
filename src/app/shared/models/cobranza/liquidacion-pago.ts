export class LiquidacionPago {
  idLiquidacionPago: number;
  idLiquidacionDet: number;
  fechaConfirmada: string;
  fechaPago: string;
  diasMora: number;
  montoCobrar: number;
  montoPago: number;
  fondoReguardoUsado: number;
  tipoPago: string;
  interes: number;
  gastos: number;
  saldoDeuda: number;
  observacion: string;
  comprobanteGenerado1: number;
  comprobanteGenerado2: number;
  flagPagoInteresConfirming: boolean;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string;
  fechaModificacion: string;
}
