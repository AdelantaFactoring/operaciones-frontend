import {LiquidacionDevolucionSustento} from "./liquidacionDevolucion-Sustento";

export class LiquidacionDevolucion {
  idEmpresa: number;
  idLiquidacionDevolucion: number;
  idLiquidacionDet: number;
  codigo: string;
  codigoSolicitud: string;
  idCliente: number;
  rucCliente: string;
  razonSocialCliente: string;
  rucPagProv: string;
  razonSocialPagProv: string;
  moneda: string;
  tipoOperacion: string;
  nroDocumento: string;
  monto: number;
  titularCuentaBancariaDestino: string;
  monedaCuentaBancariaDestino: string;
  bancoDestino: string;
  nroCuentaBancariaDestino: string;
  cciDestino: string;
  tipoCuentaBancariaDestino: string;
  checkList: boolean;
  descuento: number;
  tipoCambioMoneda: number;
  montoConversion: number;
  fechaDesembolso: string;
  observacion: string;
  correoEnviado: boolean;
  idEstado: number;
  estado: string;
  idUsuarioAud: number;
  totalRows: number;
  seleccionado: boolean;
  liquidacionDevolucionSustento: LiquidacionDevolucionSustento[];
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string;
  fechaModificacion: string;
}
