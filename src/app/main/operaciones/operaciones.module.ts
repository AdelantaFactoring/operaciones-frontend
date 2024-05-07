import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CoreCommonModule} from "@core/common.module";
import {BlockUIModule} from "ng-block-ui";
import {ContentHeaderModule} from "../../layout/components/content-header/content-header.module";
import {CoreTouchspinModule} from "@core/components/core-touchspin/core-touchspin.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgxMaskModule} from "ngx-mask";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ConsultaFactrackComponent} from './consulta-factrack/consulta-factrack.component';
import {RespuestaPagadorComponent} from './respuesta-pagador/respuesta-pagador.component';
import {LiquidacionesComponent} from './liquidaciones/liquidaciones.component';
import {FileUploadModule} from "ng2-file-upload";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {GenerarLiquidacionComponent} from './generar-liquidacion/generar-liquidacion.component';
import {CoreCardModule} from "../../../@core/components/core-card/core-card.module";
import {MiscellaneousModule} from "../pages/miscellaneous/miscellaneous.module";
import {PagesModule} from "../pages/pages.module";
import {LiquidacionesDetalleComponent} from './liquidaciones/liquidaciones-detalle/liquidaciones-detalle.component';
import {CavaliComponent} from './cavali/cavali.component';
import {
  ConsultaFactrackDetalleComponent
} from './consulta-factrack/consulta-factrack-detalle/consulta-factrack-detalle.component';
import { RespuestaPagadorDetalleComponent } from './respuesta-pagador/respuesta-pagador-detalle/respuesta-pagador-detalle.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'respuestaPagador',
        component: RespuestaPagadorComponent,
        data: { animation: 'respuestaPagador'}
      }
    ]
  },
  {
    path: 'consultaFactrack',
    children: [
      {
        path: '',
        component: ConsultaFactrackComponent,
        data: { animation: 'factrack'}
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'generarLiquidacion',
        component: GenerarLiquidacionComponent,
        data: { animation: 'generarLiquidacion'}
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'liquidaciones/:mostrar',
        component: LiquidacionesComponent,
        data: { animation: 'liquidaciones'}
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'cavali',
        component: CavaliComponent,
        data: { animation: 'cavali'}
      }
    ]
  }
]

@NgModule({
  declarations: [
    RespuestaPagadorComponent,
    ConsultaFactrackComponent,
    LiquidacionesComponent,
    GenerarLiquidacionComponent,
    LiquidacionesDetalleComponent,
    CavaliComponent,
    ConsultaFactrackDetalleComponent,
    RespuestaPagadorDetalleComponent,
  ],
  exports: [
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
    PerfectScrollbarModule,
    CoreCardModule,
    MiscellaneousModule,
    PagesModule
  ]
})
export class OperacionesModule {
}
