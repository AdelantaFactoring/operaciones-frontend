import {LiquidacionDet} from "./liquidacion-det";

export class LiquidacionCab {
  idLiquidacionCab: number;
  idSolicitudCab: number;
  codigo: string;
  idCliente: number;
  rucCliente: string;
  razonSocialCliente: string;
  rucPagProv: string;
  razonSocialPagProv: string;
  moneda: string;
  montoTotal: number;
  deudaAnterior: number;
  nuevoMontoTotal: number;
  idTipoOperacion: number;
  idTipoCT: number;
  titularCuentaBancariaDestino: string;
  monedaCuentaBancariaDestino: string;
  bancoDestino: string;
  nroCuentaBancariaDestino: string;
  cciDestino: string;
  tipoCuentaBancariaDestino: string;
  checkList: boolean;
  idEstado: number;
  estado: string;
  totalRows: number;
  idUsuarioAud: number;
  liquidacionDet: LiquidacionDet[]
  cambiarIcono: boolean = false;
  seleccionado: boolean = false;

  edicion: boolean = false;
}
