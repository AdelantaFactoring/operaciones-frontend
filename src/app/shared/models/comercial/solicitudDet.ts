export class SolicitudDet {
  idSolicitudDet: number;
  idSolicitudCab: number;
  nroDocumento: string;
  tasaNominalMensual: number;
  tasaNominalAnual: number;
  financiamiento: number;
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

  editado: boolean = false;
}
