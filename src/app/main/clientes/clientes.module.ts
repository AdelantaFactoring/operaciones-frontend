import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import {RouterModule, Routes} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreCommonModule} from "../../../@core/common.module";
import {BlockUIModule} from "ng-block-ui";
import {ContentHeaderModule} from "../../layout/components/content-header/content-header.module";

const routes: Routes = [
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
    ContentHeaderModule
  ]
})
export class ClientesModule { }
