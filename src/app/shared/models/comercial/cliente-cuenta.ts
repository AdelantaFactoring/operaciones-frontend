export class ClienteCuenta {
  idClienteCuenta: number;
  idCliente: number;
  titular: string;
  banco: string;
  idMoneda: number = 1;
  moneda: string;
  codigoMoneda: string;
  nroCuenta: string;
  cci: string;
  tipoCuenta: string;
  predeterminado: boolean = false;

  idFila: number;
  edicion: boolean = false;
  editado: boolean = false;

}
