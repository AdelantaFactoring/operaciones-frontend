import {LiquidacionDocumentoDet} from "./liquidaciondocumento-det";

export class LiquidacionDocumentoCab {
  idEmpresa: number;
  idLiquidacionDocumentoCab: number;
  idLiquidacionCab: number;
  idTipoDocumento: number;
  codigoTipoDocumento: string;
  tipoDocumento: string;
  prefijo: string;
  serie: number;
  correlativo: number;
  idTipoOperacion: number;
  codigoTipoOperacion: string;
  tipoOperacion: string;
  idTipoNota: number;
  codigoTipoNota: string;
  motivo: string;
  nroDocumento: string;
  codigo: string;
  codigoSolicitud: string;
  idCliente: number;
  rucCliente: string;
  razonSocialCliente: string;
  direccionCliente: string;
  fechaEmision: any;
  fechaEmisionFormat: string;
  idMoneda: number;
  moneda: string;
  idFormaPago: number;
  codigoFormaPago: string;
  formaPago: string;
  idMedioPago: number;
  codigoMedioPago: string;
  medioPago: string;
  fechaVencimiento: any;
  fechaVencimientoFormat: string;
  igv: number;
  monto: number;
  montoIGV: number;
  montoTotal: number;
  montoLetra: string;
  idTipoDocumentoReferencia: number;
  nroDocumentoReferencia: string;
  idBienServicioDetraccion: number;
  tasaDetraccion: number;
  montoDetraccion: number;
  nroCuentaBcoNacion: string;
  idMedioPagoDetraccion: number;
  tipoCambioMoneda: number;
  idEstado: number;
  estado: string;
  archivoPDF: string;
  archivoXML: string;
  totalRows: number;
  idUsuarioAud: number;
  liquidacionDocumentoDet: LiquidacionDocumentoDet[] = [];
  seleccionado: boolean = false;
  cambiarIcono: boolean = false;
}
