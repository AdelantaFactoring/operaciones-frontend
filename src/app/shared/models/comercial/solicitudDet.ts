export class SolicitudDet {
  idSolicitudDet: number;
  idSolicitudCab: number;
  razonSocialPagProv: string;
  rucPagProv: string;
  codigoUbigeoCliente: string;
  direccionCliente: string;
  codigoUbigeoPagProv: string;
  direccionPagProv: string;
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
  registroCavali: boolean;
  informacionAdicionalCavali: boolean;
  anotacionCavali: boolean;
  transferenciaContableCavali: boolean;
  retiroCavali: boolean;

  editado: boolean = true;
}
