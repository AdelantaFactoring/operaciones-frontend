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

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'usuario',
        component: UsuarioComponent
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'perfil',
        component: PerfilComponent
      }
    ]
  },
]

@NgModule({
  declarations: [
    UsuarioComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    CoreCommonModule,
    BlockUIModule,
    ContentHeaderModule,
    CoreTouchspinModule,
    NgxDatatableModule
  ]
})
export class SeguridadModule { }
