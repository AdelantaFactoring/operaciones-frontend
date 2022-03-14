import {SolicitudDet} from "./solicitudDet";

export class SolicitudCab {
    seleccionado: boolean = false;
    idSolicitudCab: number;
    codigo: string;
    idCliente: number;
    razonSocialCliente: string;
    rucCliente: string;
    razonSocialPagProv: string;
    rucPagProv: string;
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
    idUsuarioAud: number;
    totalRows: number;
    solicitudDet: SolicitudDet[];

    cambiarIcono: boolean = false;
  }
