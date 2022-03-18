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
    formaPago: string;
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
}

export class SolicitudArchivosXlsx {
    ruc: string;
    razonSocialProv: string;
    documento: string;
    fechaRegistro: string = "";
    fechaVencimiento: string = "";
    moneda: string;
    total: number = 0;
    pagar: number = 0;
    banco: string;
    ctaBancaria: string = "";
    cci: string = "";
    tipoCuenta: string;
    correo: string;
    nombreContacto: string;
    telefono: string;
    rubro: string;
  }