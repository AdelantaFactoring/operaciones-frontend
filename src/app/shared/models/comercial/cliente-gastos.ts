export class ClienteGastos {
  idClienteGastos: number;
  idCliente: number;
  idTipoOperacion: number;
  idMoneda: number = 1;
  moneda: string;
  tasaNominalMensual: number;
  tasaNominalAnual: number;
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
