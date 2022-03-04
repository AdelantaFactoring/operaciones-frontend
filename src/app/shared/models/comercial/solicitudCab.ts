import {SolicitudDet} from "./solicitudDet";

export class SolicitudCab {
    idSolicitud: number;
    codigo: string;
    idCedente: number;
    razonSocialCedente: string;
    rucCedente: string;
    idAceptante: string;
    razonSocialAceptante: string;
    rucAceptante: string;
    moneda: string;
    comisionEstructuracion: number;
    gastosContrato: number;
    comisionCartaNotarial: number;
    servicioCobranza: number;
    servicioCustodia: number;
    idEstado: number;
    estado: string;
    idTipoOperacion: number;
    tipoOperacion: string;
    fechaCreacion: string;
    totalRows: number;
    solicitudDet: SolicitudDet[]
  }
