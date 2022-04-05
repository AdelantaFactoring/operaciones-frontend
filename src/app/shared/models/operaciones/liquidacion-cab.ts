import {LiquidacionDet} from "./liquidacion-det";
import { LiquidacionCabSustento } from "./LiquidacionCab-Sustento";
import { LiquidacionCabSeleccionados } from "./liquidacionCab_Seleccionados";

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
  liquidacionDet: LiquidacionDet[];
  liquidacionCabSustento: LiquidacionCabSustento[];
  liquidacionCabSeleccionados: LiquidacionCabSeleccionados[];
  cambiarIcono: boolean = false;
  seleccionado: boolean = false;
  tipoCambioMoneda: number;
  montoTotalConversion: number;
  idUsuarioAud: number;
  edicion: boolean = false;
}
