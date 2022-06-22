export class User {
  idEmpresa: number;
  idUsuario: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  usuarioLogin: string;
  clave: string;
  idPerfil: number;
  perfil: string;
  archivoFoto: string;
  base64: string;
  google: boolean;
  totalRows: number;
  menu: Menu[];
}

export class Menu {
  acceso: boolean;
  grupo: string;
  idMenu: number;
  idPerfil: number;
  idPerfilMenu: number;
  idUsuario: number;
  idUsuarioMenu: number;
  menu: string;
}
