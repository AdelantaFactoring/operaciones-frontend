import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesComponent } from './clientes/clientes.component';
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
import { FileUploadModule } from 'ng2-file-upload';
import { GastosComponent } from './clientes/gastos/gastos.component';
import { PagadorComponent } from './pagador/pagador.component';
import { SolicitudesFormComponent } from './solicitudes/solicitudes-form/solicitudes-form.component';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { ClientePagadorComponent } from './clientes/cliente-pagador/cliente-pagador.component';
import { SolicitudesGrillaComponent } from './solicitudes/solicitudes-grilla/solicitudes-grilla.component';

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
  },
  {
    path: '',
    children: [
      {
        path: 'clientepagador',
        component: ClientePagadorComponent
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'solicitudes/solicitudes-form',
        component: SolicitudesFormComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    ClientesComponent,
    CheckListComponent,
    SolicitudesComponent,
    GastosComponent,
    PagadorComponent,
    SolicitudesFormComponent,
    ClientePagadorComponent,
    SolicitudesGrillaComponent
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
    NgxMaskModule.forRoot(),
    FileUploadModule,
    CardSnippetModule,
    CoreDirectivesModule
  ]
})
export class ComercialModule { }
