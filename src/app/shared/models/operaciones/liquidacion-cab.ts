import {LiquidacionDet} from "./liquidacion-det";

export class LiquidacionCab {
  idLiquidacionCab: number;
  idSolicitudCab: number;
  codigo: string;
  rucCliente: string;
  razonSocialCliente: string;
  rucPagProv: string;
  razonSocialPagProv: string;
  moneda: string;
  montoTotal: number;
  deudaAnterior: number;
  nuevoMontoTotal: number;
  idEstado: number;
  estado: string;
  totalRows: number;
  liquidacionDet: LiquidacionDet[]
  cambiarIcono: boolean = false;
  seleccionado: boolean = false;
}
