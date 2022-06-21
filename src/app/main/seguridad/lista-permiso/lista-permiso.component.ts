import { AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Menu } from 'app/shared/models/seguridad/menu';
import { ListaPermisoService } from './lista-permiso.service';

@Component({
  selector: 'app-lista-permiso',
  templateUrl: './lista-permiso.component.html',
  styleUrls: ['./lista-permiso.component.scss']
})
export class ListaPermisoComponent implements OnInit {

  @Input() urlMenuList: any;
  public menuList: Menu[] = [];
  constructor(
    private listaPermiso: ListaPermisoService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    //this._initNode();
    this.updateSelectedNodes();
  }

  // ngAfterViewInit(): void {
  //   this.updateSelectedNodes();
  // }
  private updateSelectedNodes() {
    if (this.urlMenuList) {
      if (this.urlMenuList.length > 0) {
        this.menuList.forEach(node => {
          this.urlMenuList.forEach(_node => {
            if (node.idMenu == _node.idMenu) {
              // console.log(_node, __node);
              node.idPerfilMenu = _node.idPerfilMenu;
              node.idUsuarioMenu = _node.idUsuarioMenu;
              node.acceso = _node.acceso;
              return;
            }
          });
        });
        //console.log('updateSelectedNodes:after', this.nodeMenus);
      }
    }
  }

  ngOnInit(): void {
    this.listaPermiso.listar().subscribe((response: Menu[]) =>{
      this.menuList = [];
      response.forEach(item => {
        this.menuList.push({
          idMenu: item.idMenu,
          menu: item.menu,
          grupo: item.grupo,
          acceso: false,
          idPerfilMenu: 0,
          idUsuarioMenu: 0
        })
      });
      //this.menuList = response;
      this.updateSelectedNodes();
    });
  }

  
}
