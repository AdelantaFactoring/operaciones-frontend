import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { RespuestaPagadorComponent } from './respuesta-pagador/respuesta-pagador.component';
import { RegistroFactrackComponent } from './registro-factrack/registro-factrack.component';
import { LiquidacionesComponent } from './liquidaciones/liquidaciones.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
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
        path: 'respuestaPagador',
        component: RespuestaPagadorComponent
      }
    ]
  },
]

@NgModule({
  declarations: [
    RespuestaPagadorComponent,
    RegistroFactrackComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    CoreCommonModule,
    BlockUIModule.forRoot(),
    ContentHeaderModule,
    CoreTouchspinModule,
    NgSelectModule,
    NgxMaskModule.forRoot(),
  ]
})
export class OperacionesModule { }
