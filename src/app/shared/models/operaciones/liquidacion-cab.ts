import {LiquidacionDet} from "./liquidacion-det";
import { LiquidacionCabSustento } from "./LiquidacionCab-Sustento";
import { LiquidacionCabSeleccionados } from "./liquidacionCab_Seleccionados";

export class LiquidacionCab {
  idEmpresa: number;
  idLiquidacionCab: number;
  idSolicitudCab: number;
  codigo: string;
  codigoSolicitud: string;
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
  tipoOperacion: string;
  idTipoCT: number;
  titularCuentaBancariaDestino: string;
  monedaCuentaBancariaDestino: string;
  bancoDestino: string;
  nroCuentaBancariaDestino: string;
  cciDestino: string;
  tipoCuentaBancariaDestino: string;
  observacion: string;
  checkList: boolean;
  idEstado: number;
  estado: string;
  correoValidacionEnviado: boolean;
  totalRows: number;
  liquidacionDet: LiquidacionDet[];
  liquidacionCabSustento: LiquidacionCabSustento[];
  //liquidacionCabSeleccionados: LiquidacionCabSeleccionados[];
  cambiarIcono: boolean = false;
  seleccionado: boolean = false;
  tipoCambioMoneda: number;
  montoTotalConversion: number;
  netoConfirmadoTotal: number;
  interesRestanteServicioTotal: number;
  pagoTotal: number;
  saldoTotal: number;
  porcentajePagoTotal: number;
  idUsuarioAud: number;
  edicion: boolean = false;
  idDestino: number;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string;
  fechaModificacion: string;
  alterno: boolean;
  flagPagoInteresAdelantado: boolean;

  tipoNotificacion: number;

  interesConIGV_Total: number;
  gastosDiversosConIGV_Total: number;
  montoFacturado_Total: number;
  fecha_PAI: string;
  monto_PAI: number;
  observacion_PAI: string;
  flagPagoInteresConfirming: boolean;

  fechaOperacion_Global_ORG: string;
  fechaOperacion_Global_MOD: any;

  idUsuarioCreacionSolicitud: number;

  flagSeleccionado: boolean = false;

  idEjecutivo: number;
  usuarioNombreCompleto: string;
}
