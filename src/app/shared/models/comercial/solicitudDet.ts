export class SolicitudDet {
  idSolicitudDet: number;
  idSolicitudCab: number;
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
  idProcesoRespuestaCavali: number;
  codigoRespuestaCavali: string;
  idProcesoRespuestaAnotacion: number;
  codigoRespuestaAnotacion: string;

  editado: boolean = true;
}
