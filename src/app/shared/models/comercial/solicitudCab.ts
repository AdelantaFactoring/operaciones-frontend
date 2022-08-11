import {SolicitudDet} from "./solicitudDet";
import {SolicitudCabSustento} from "./solicitudCab-sustento";

export class SolicitudCab {
  idEmpresa: number;
  seleccionado: boolean = false;
  idSolicitudCab: number;
  codigo: string;
  idCliente: number;
  razonSocialCliente: string;
  rucCliente: string;
  razonSocialPagProv: string;
  rucPagProv: string;
  moneda: string;
  tasaNominalMensual: number;
  tasaNominalAnual: number;
  tasaNominalMensualMora: number;
  tasaNominalAnualMora: number;
  financiamiento: number;
  comisionEstructuracion: number;
  usarGastosContrato: boolean;
  gastosContrato: number;
  comisionCartaNotarial: number;
  servicioCobranza: number;
  servicioCustodia: number;
  usarGastoVigenciaPoder: boolean;
  gastoVigenciaPoder: number;
  nombreContacto: string;
  telefonoContacto: string;
  correoContacto: string;
  conCopiaContacto: string;
  titularCuentaBancariaDestino: string;
  monedaCuentaBancariaDestino: string;
  bancoDestino: string;
  nroCuentaBancariaDestino: string;
  cciDestino: string;
  tipoCuentaBancariaDestino: string;
  idTipoCT: number;
  tipoCT: string;
  montoCT: number;
  montoSolicitudCT: number;
  diasPrestamoCT: number;
  fechaPagoCT: string;
  igvct: number;
  idTipoRegistro: number = 0;
  idEstado: number;
  estado: string;
  alterno: boolean;
  observacionRechazo: string;
  flagPagoInteresAdelantado: boolean;

  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string;
  fechaModificacion: string;

  idTipoOperacion: number;
  tipoOperacion: string;
  idUsuarioAud: number;
  totalRows: number;
  checkList: boolean;
  solicitudDet: SolicitudDet[];
  solicitudCabSustento: SolicitudCabSustento[];

  cambiarIcono: boolean = false;
  cavali: boolean = false;
  anotacion: boolean = false;
  flagCavali: boolean = false;
}
