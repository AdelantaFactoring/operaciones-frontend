export class ClientePagadorContacto {
  idClientePagadorContacto: number;
  idClientePagador: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  correo: string;
  predeterminado: boolean = false;

  idFila: number;
  edicion: boolean = false;
  editado: boolean = false;
}
