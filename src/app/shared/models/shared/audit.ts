export class Audit {
  constructor(usuarioCreacion: string = "", fechaCreacion: string = "", usuarioModificacion: string = "", fechaModificacion: string = "") {
    this.usuarioCreacion = usuarioCreacion;
    this.fechaCreacion = fechaCreacion;
    this.usuarioModificacion = usuarioModificacion;
    this.fechaModificacion = fechaModificacion;
  }

  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string;
  fechaModificacion: string;
}
