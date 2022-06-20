import { Component, OnInit } from '@angular/core';
import { Usuario } from 'app/shared/models/seguridad/Usuario';
import { UtilsService } from 'app/shared/services/utils.service';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  public contentHeader: object;
  public usuario: Usuario[] = [];
  
  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  constructor(
    private utilsService: UtilsService,
    private usuarioService: UsuarioService
  ) 
  {
    this.contentHeader = {
      headerTitle: 'Usuario',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Inicio',
            isLink: true,
            link: '/'
          },
          {
            name: 'Seguridad',
            isLink: false
          },
          {
            name: 'Usuario',
            isLink: false
          }
        ]
      }
    };
  }

  ngOnInit(): void {
    this.onListarUsuario();
  }

  onListarUsuario(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.usuarioService.listar({
      idEmpresa: 1,
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: Usuario[]) => {
      
      this.usuario = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

  }


  onEditar(a, b): void{

  }
}
