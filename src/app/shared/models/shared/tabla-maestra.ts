export class TablaMaestra {
  idTabla: number;
  idColumna: number;
  valor: string;
  descripcion: string;

  totalRows: number = 0;
  idFila: number = 0;
  edicion: boolean = false;
  editado: boolean = false;
  asignar: boolean = false;

  idTablaMaestraRelacion: number;
  idColumna2: number;
  descripcion2: string;

  constructor(params: Partial<TablaMaestra>) {
    Object.assign(this, params);
  }
}
