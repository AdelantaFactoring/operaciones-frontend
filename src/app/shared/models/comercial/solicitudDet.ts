import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

export class SolicitudDet {
  idSolicitudDet: number;
  nroDocumento: string;
  tasaNominalMensual: number;
  tasaNominalAnual: number;
  financiamiento: number;
  fechaConfirmado: NgbDate;
  fechaConfirmadoFormat: string;
  netoConfirmado: number;
  idEstado: number;
  estado: number;
  montoSinIGV: number;
  montoConIGV: number;
  fondoResguardo: number;
  archivoXML: string;
  archivoPDF: string;
}
