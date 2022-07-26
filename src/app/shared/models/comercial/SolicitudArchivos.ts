export class SolicitudArchivos {
    tipo: number;
    mensaje: string;
    codFactura: string;
    rucCab: string;
    razonSocialCab: string;
    rucDet: string;
    razonSocialDet: string;
    tipoMoneda: string;
    netoPendiente: number;
    subTotal: number;
    igv: number;
    total: number;
    valorVenta: number;
    fechaEmision: string;
    fechaVencimiento: string;
    nombreXML: string;
    nombrePDF: string;
    formaPago: string = "";
    estado: boolean = false;
    observacion: string = "";
    totalExcel: number = 0;

    nombreContacto: string = "";
    telefonoContacto: string = "";
    correoContacto: string = "";
    titularCuentaBancariaDestino: string = "";
    monedaCuentaBancariaDestino: string = "";
    bancoDestino: string = "";
    nroCuentaBancariaDestino: string = "";
    cCIDestino: string = "";
    tipoCuentaBancariaDestino: string = "";

    codigoUbigeoCab: string = "";
    direccionCab: string = "";
    codigoUbigeoDet: string = "";
    direccionDet: string = "";

    idTipoArchivo: number = 0;
    archivoSustento: string = "";

    estadoUbigeoCab: number;
    estadoUbigeoDet: number;
    estadoDireccionCab: number;
    estadoDireccionDet: number;
    netoPendienteOld: number;
    estadoNetoPen: number;
}

export class SolicitudArchivosXlsx {
    ruc: string;
    razonSocialProv: string;
    tipoDocumento: string;
    documento: string;
    fechaVencimiento: string = "";
    moneda: string;
    netoPagar: number = 0;
    banco: string;
    ctaBancaria: string = "";
    cci: string = "";
    tipoCuenta: string;
  }
