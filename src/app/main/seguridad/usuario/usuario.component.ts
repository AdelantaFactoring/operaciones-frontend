import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Menu } from 'app/shared/models/seguridad/menu';
import { Perfil } from 'app/shared/models/seguridad/perfil';
import { Usuario } from 'app/shared/models/seguridad/Usuario';
import { UtilsService } from 'app/shared/services/utils.service';
import Swal from 'sweetalert2';
import { ListaPermisoService } from '../lista-permiso/lista-permiso.service';
import { PerfilService } from '../perfil/perfil.service';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  public contentHeader: object;
  public usuario: Usuario[] = [];
  public menuList: Menu[] = [];
  
  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;
  public usuarioForm: FormGroup;
  public oldUsuarioForm: FormGroup;
  public optPerfil: Perfil[] = [];

  public submitted: boolean;
  get ReactiveIUForm(): any {
    return this.usuarioForm.controls;
  }
  constructor(
    private utilsService: UtilsService,
    private usuarioService: UsuarioService,
    private perfilService: PerfilService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private listaPermiso: ListaPermisoService
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

    this.usuarioForm = this.formBuilder.group({
      idUsuario: [0],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
      idPerfil: [0],
      google: [false]
    });

    this.oldUsuarioForm = this.usuarioForm;
  }

  ngOnInit(): void {
    this.onListarUsuario();
    this.onComboPerfil();
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

  onRefrescar(): void{
    this.onListarUsuario();
  }

  onNuevo(modal: any): void {

    //this.onMenuListarPorPerfil();
    this.menuList = [];
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        size: 'lg',
        windowClass: 'my-class',
        animation: true,
        centered: false,
        backdrop: "static",
        beforeDismiss: () => {
          return true;
        }
      });
    }, 0);
  }

  onGuardar(listaPermiso): void{
    this.submitted = true;
    if (this.usuarioForm.invalid)
      return;
    
    this.utilsService.blockUIStart('Guardando...');
    this.usuarioService.guardar({
      idEmpresa: 1,
      idUsuario: this.usuarioForm.controls.idUsuario.value,
      nombre: this.usuarioForm.controls.nombre.value,
      apellidoPaterno: this.usuarioForm.controls.apellidoPaterno.value,
      apellidoMaterno: this.usuarioForm.controls.apellidoMaterno.value,
      usuarioLogin: this.usuarioForm.controls.usuario.value,
      clave: this.usuarioForm.controls.clave.value,
      idPerfil: this.usuarioForm.controls.idPerfil.value,
      archivoFoto: '',
      google: this.usuarioForm.controls.google.value,
      idUsuarioAud: 1,
      menu: listaPermiso.menuList
    }).subscribe(response => {

      if (response.tipo == 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarUsuario();
        this.onCancelar();
      } else if (response.tipo == 2) {
        this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
        this.utilsService.blockUIStop();
      } else {
        this.utilsService.showNotification(response.mensaje, 'Error', 3);
        this.utilsService.blockUIStop();
      }
    }, error => {
      this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
      this.utilsService.blockUIStop();
    });    
  }

  onEditar(modal: any, row): void{
    this.utilsService.blockUIStart('Obteniendo información...');
    this.listaPermiso.listarPorUsuario({
      idEmpresa: 1,
      idUsuario: row.idUsuario
    }).subscribe((response: Menu[]) => {

      this.usuarioForm.controls.idUsuario.setValue(row.idUsuario);
      this.usuarioForm.controls.nombre.setValue(row.nombre);
      this.usuarioForm.controls.apellidoPaterno.setValue(row.apellidoPaterno);
      this.usuarioForm.controls.apellidoMaterno.setValue(row.apellidoMaterno);
      this.usuarioForm.controls.usuario.setValue(row.usuarioLogin);
      this.usuarioForm.controls.clave.setValue(row.clave);
      this.usuarioForm.controls.idPerfil.setValue(row.idPerfil);
      this.usuarioForm.controls.google.setValue(row.google);
      response.forEach(item => {
        this.menuList.push({
          idMenu: item.idMenu,
          menu: item.menu,
          grupo: item.grupo,
          acceso: item.acceso,
          idPerfilMenu: item.idPerfilMenu,
          idUsuarioMenu: item.idUsuarioMenu
        });
      });
      this.utilsService.blockUIStop();
      setTimeout(() => {
        this.modalService.open(modal, {
          scrollable: true,
          size: 'lg',
          windowClass: 'my-class',
          animation: true,
          centered: false,
          backdrop: "static",
          beforeDismiss: () => {
            return true;
          }
        });
      }, 0);
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onEliminar(item): void {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Desea eliminar el registro "${item.usuarioLogin}"?, esta acción no podrá revertirse`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary'
      }
    }).then(result => {
      if (result.value) {
        this.utilsService.blockUIStart('Eliminando...');
        this.usuarioService.eliminar({
          idEmpresa: 1,
          idUsuario: item.idUsuario,
          idUsuarioAud: 1
        }).subscribe(response => {
          if (response.tipo === 1) {
            this.utilsService.showNotification('Registro eliminado correctamente', 'Confirmación', 1);
            this.utilsService.blockUIStop();
            this.onListarUsuario();
          } else if (response.tipo === 2) {
            this.utilsService.showNotification(response.mensaje, 'Alerta', 2);
          } else {
            this.utilsService.showNotification(response.mensaje, 'Error', 3);
          }

          this.utilsService.blockUIStop();
        }, error => {
          this.utilsService.showNotification('[F]: An internal error has occurred', 'Error', 3);
          this.utilsService.blockUIStop();
        });
      }
    });
  }

  onComboPerfil(): void{
    this.utilsService.blockUIStart('Obteniendo información...');
    this.perfilService.combo({
      idEmpresa: 1
    }).subscribe((response: Usuario[]) => {
      this.optPerfil = response;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onCancelar(): void {
    this.submitted = false;
    this.usuarioForm.reset(this.oldUsuarioForm);
    this.modalService.dismissAll();
  }

  onMenuListarPorPerfil(): void{
    if (this.usuarioForm.controls.idPerfil.value != 0 && this.usuarioForm.controls.idPerfil.value != null) {
      this.listaPermiso.listarPorPerfil({
        idEmpresa: 1,
        idPerfil: this.usuarioForm.controls.idPerfil.value
      }).subscribe((response: Menu[]) => {
        
        response.forEach(item => {
          this.menuList.push({
            idMenu: item.idMenu,
            menu: item.menu,
            grupo: item.grupo,
            acceso: item.acceso,
            idPerfilMenu: item.idPerfilMenu,
            idUsuarioMenu: item.idUsuarioMenu
          });
        });
        this.utilsService.blockUIStop();
      }, error => {
        this.utilsService.blockUIStop();
        this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
      });
    }
  }

  onCambioPerfil(): void{
    this.menuList = [];
    this.onMenuListarPorPerfil();
  }
}
