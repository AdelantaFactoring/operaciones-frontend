import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Menu } from 'app/shared/models/seguridad/menu';
import { Perfil } from 'app/shared/models/seguridad/perfil';
import { UtilsService } from 'app/shared/services/utils.service';
import Swal from 'sweetalert2';
import { ListaPermisoService } from '../lista-permiso/lista-permiso.service';
import { PerfilService } from './perfil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  contentHeader: object;
  public search: string = '';
  public collectionSize: number = 0;
  public pageSize: number = 10;
  public page: number = 1;
  public perfilForm: FormGroup;
  public oldPerfilForm: FormGroup;

  public perfil: Perfil[] = [];

  public submitted: boolean;
  public menuList: Menu[] = [];
  get ReactiveIUForm(): any {
    return this.perfilForm.controls;
  }
  constructor(
    private utilsService: UtilsService,
    private perfilService: PerfilService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private listaPermiso: ListaPermisoService
  ) 
  {
    this.contentHeader = {
      headerTitle: 'Perfil',
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
            name: 'Perfil',
            isLink: false
          }
        ]
      }
    };

    this.perfilForm = this.formBuilder.group({
      idPerfil: [0],
      perfil: ['', Validators.required]
    });

    this.oldPerfilForm = this.perfilForm;
  }

  ngOnInit(): void {
    this.onListarPerfil();
  }

  onListarPerfil(): void {
    this.utilsService.blockUIStart('Obteniendo información...');
    this.perfilService.listar({
      idEmpresa: 1,
      search: this.search,
      pageIndex: this.page,
      pageSize: this.pageSize
    }).subscribe((response: Perfil[]) => {
      
      this.perfil = response;
      this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
  }

  onRefrescar(): void{
    this.onListarPerfil();
  }

  onNuevo(modal: any): void {

    this.menuList = [];
    setTimeout(() => {
      this.modalService.open(modal, {
        scrollable: true,
        //size: 'lg',
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

  onEditar(modal: any, row): void{
    this.utilsService.blockUIStart('Obteniendo información...');
    this.menuList = [];
    this.listaPermiso.listarPorPerfil({
      idEmpresa: 1,
      idPerfil: row.idPerfil
    }).subscribe((response: Menu[]) => {
      
      this.perfilForm.controls.idPerfil.setValue(row.idPerfil);
      this.perfilForm.controls.perfil.setValue(row.perfil);
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
          //size: 'lg',
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

  onGuardar(listaPermiso): void{
    
    //return
    this.submitted = true;
    if (this.perfilForm.invalid)
      return;
    this.utilsService.blockUIStart('Guardando...');
    this.perfilService.guardar({
      idEmpresa: 1,
      idPerfil: this.perfilForm.controls.idPerfil.value,
      perfil: this.perfilForm.controls.perfil.value,
      idUsuarioAud: 1,
      menu: listaPermiso.menuList
    }).subscribe(response => {

      if (response.tipo == 1) {
        this.utilsService.showNotification('Información guardada correctamente', 'Confirmación', 1);
        this.utilsService.blockUIStop();
        this.onListarPerfil();
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

  onEliminar(item): void {
    Swal.fire({
      title: 'Confirmación',
      text: `¿Desea eliminar el registro "${item.perfil}"?, esta acción no podrá revertirse`,
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
        this.perfilService.eliminar({
          idEmpresa: 1,
          idPerfil: item.idPerfil,
          idUsuarioAud: 1
        }).subscribe(response => {
          if (response.tipo === 1) {
            this.utilsService.showNotification('Registro eliminado correctamente', 'Confirmación', 1);
            this.utilsService.blockUIStop();
            this.onListarPerfil();
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

  onCancelar(): void {
    this.submitted = false;
    this.perfilForm.reset(this.oldPerfilForm);
    this.modalService.dismissAll();
  }
}
