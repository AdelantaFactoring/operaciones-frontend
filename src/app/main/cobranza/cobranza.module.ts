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
import {RegistroPagosComponent} from './registro-pagos/registro-pagos.component';
import {MiscellaneousModule} from "../pages/miscellaneous/miscellaneous.module";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'registroPagos',
        component: RegistroPagosComponent
      }
    ]
  },
]

@NgModule({
  declarations: [
    RegistroPagosComponent
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
        MiscellaneousModule,
        PerfectScrollbarModule
    ]
})
export class CobranzaModule {
}
