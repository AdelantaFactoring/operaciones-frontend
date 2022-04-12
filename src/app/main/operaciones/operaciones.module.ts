import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CoreCommonModule} from "@core/common.module";
import {BlockUIModule} from "ng-block-ui";
import {ContentHeaderModule} from "../../layout/components/content-header/content-header.module";
import {CoreTouchspinModule} from "@core/components/core-touchspin/core-touchspin.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgxMaskModule} from "ngx-mask";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import { ConsultaFactrackComponent } from './consulta-factrack/consulta-factrack.component';
import { RespuestaPagadorComponent } from './respuesta-pagador/respuesta-pagador.component';
import { LiquidacionesComponent } from './liquidaciones/liquidaciones.component';
import {FileUploadModule} from "ng2-file-upload";

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
  {
    path: '',
    children: [
      {
        path: 'consultaFactrack',
        component: ConsultaFactrackComponent
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'liquidaciones',
        component: LiquidacionesComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    RespuestaPagadorComponent,
    ConsultaFactrackComponent,
    LiquidacionesComponent
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
        NgxDatatableModule,
        FileUploadModule,
    ]
})
export class OperacionesModule { }
