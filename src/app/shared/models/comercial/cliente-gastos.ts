export class ClienteGastos {
  idClienteGastos: number;
  idCliente: number;
  idTipoOperacion: number;
  idMoneda: number = 1;
  moneda: string;
  codigoMoneda: string;
  tasaNominalMensual: number;
  tasaNominalAnual: number;
  tasaNominalMensualMora: number;
  tasaNominalAnualMora: number;
  financiamiento: number;
  comisionEstructuracion: number;
  gastosContrato: number;
  comisionCartaNotarial: number;
  servicioCobranza: number;
  servicioCustodia: number;

  idFila: number;
  edicion: boolean = false;
  editado: boolean = false;
}
