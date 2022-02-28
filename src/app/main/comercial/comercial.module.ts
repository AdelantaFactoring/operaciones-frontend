import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesComponent } from './clientes/clientes.component';
import { PagadorComponent } from './pagador/pagador.component';
import { CheckListComponent } from './check-list/check-list.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import {RouterModule, Routes} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreCommonModule} from "@core/common.module";
import {BlockUIModule} from "ng-block-ui";
import {ContentHeaderModule} from "../../layout/components/content-header/content-header.module";
import {CoreTouchspinModule} from "@core/components/core-touchspin/core-touchspin.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgxMaskModule} from "ngx-mask";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'clientes',
        component: ClientesComponent
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'pagador',
        component: PagadorComponent
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'checklist',
        component: CheckListComponent
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'solicitudes',
        component: SolicitudesComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    ClientesComponent,
    PagadorComponent,
    CheckListComponent,
    SolicitudesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CoreCommonModule,
    BlockUIModule.forRoot(),
    ContentHeaderModule,
    CoreTouchspinModule,
    NgSelectModule,
    NgxMaskModule.forRoot()
  ]
})
export class ComercialModule { }
