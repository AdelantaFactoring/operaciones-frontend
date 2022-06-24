export class SolicitudDet {
  idSolicitudDet: number;
  idSolicitudCab: number;
  razonSocialPagProv: string;
  rucPagProv: string;
  titularCuentaBancariaDestino: string;
  monedaCuentaBancariaDestino: string;
  bancoDestino: string;
  nroCuentaBancariaDestino: string;
  cciDestino: string;
  tipoCuentaBancariaDestino: string;
  nroDocumento: string;
  fechaConfirmado: any;
  fechaConfirmadoFormat: string;
  netoConfirmado: number;
  idEstado: number;
  estado: number;
  montoSinIGV: number;
  montoConIGV: number;
  fondoResguardo: number;
  formaPago: string;
  archivoXML: string;
  archivoPDF: string;
  rutaArchivoXML: string;
  rutaArchivoPDF: string;
  idProcesoRespuestaCavali: number;
  codigoRespuestaCavali: string;
  estadoRespuestaCavali: string;
  idProcesoRespuestaAnotacion: number;
  codigoRespuestaAnotacion: string;
  estadoRespuestaAnotacion: string;

  editado: boolean = true;
}
