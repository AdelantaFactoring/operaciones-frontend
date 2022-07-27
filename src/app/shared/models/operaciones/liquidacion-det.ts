export class LiquidacionDet {
  idLiquidacionDet: number;
  idLiquidacionCab: number;
  idSolicitudDet: number;
  rucPagProv: string;
  razonSocialPagProv: string;
  titularCuentaBancariaDestino: string;
  monedaCuentaBancariaDestino: string;
  bancoDestino: string;
  nroCuentaBancariaDestino: string;
  cciDestino: string;
  tipoCuentaBancariaDestino: string;
  tasaNominalMensual: number;
  tasaNominalAnual: number;
  tasaNominalMensualMora: number;
  tasaNominalAnualMora: number;
  financiamiento: number;
  comisionEstructuracion: number;
  montoComisionEstructuracion: number;
  comisionEstructuracionIGV: number;
  comisionEstructuracionConIGV: number;
  gastosContrato: number;
  gastoVigenciaPoder: number;
  comisionCartaNotarial: number;
  servicioCobranza: number;
  servicioCustodia: number;
  gastosDiversos: number;
  gastosDiversosIGV: number;
  gastosDiversosConIGV: number;
  nroDocumento: string;
  fechaConfirmado: string;
  netoConfirmado: number;
  interesRestanteServicio: number;
  fondoResguardo: number;
  fechaOperacion: any;
  fechaOperacionFormat: string;
  diasEfectivo: number;
  igv: number;
  montoCobrar: number;
  interes: number;
  interesIGV: number;
  interesConIGV: number;
  montoTotalFacturado: number;
  montoNotaCreditoDevolucion: number;
  montoDesembolso: number;
  diasMora: number;
  pago: number;
  saldo: number;
  porcentajePago: number;
  interesPago: number;
  gastosPago: number;
  idUsuarioAud: number;

  edicion: boolean = false;
  editado: boolean = false;
  cambioConfirmado: boolean = false;
}
