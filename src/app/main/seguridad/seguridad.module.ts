import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './usuario/usuario.component';
import { PerfilComponent } from './perfil/perfil.component';
import { RouterModule, Routes } from '@angular/router';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CoreCommonModule} from "@core/common.module";
import {BlockUIModule} from "ng-block-ui";
import {CoreTouchspinModule} from "@core/components/core-touchspin/core-touchspin.module";
import {ContentHeaderModule} from "../../layout/components/content-header/content-header.module";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import { ListaPermisoComponent } from './lista-permiso/lista-permiso.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import { AuditoriaComponent } from './auditoria/auditoria.component';
import {CoreCardModule} from "../../../@core/components/core-card/core-card.module";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'usuario',
        component: UsuarioComponent,
        data: { animation: 'usuario'}
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'perfil',
        component: PerfilComponent,
        data: { animation: 'perfil'}
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'auditoria',
        component: AuditoriaComponent,
        data: { animation: 'auditoria'}
      }
    ]
  }

]

@NgModule({
  declarations: [
    UsuarioComponent,
    PerfilComponent,
    ListaPermisoComponent,
    AuditoriaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    CoreCommonModule,
    BlockUIModule.forRoot(),
    ContentHeaderModule,
    CoreTouchspinModule,
    NgxDatatableModule,
    NgSelectModule,
    PerfectScrollbarModule,
    CoreCardModule
  ]
})
export class SeguridadModule { }
