import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConceptoComprobanteComponent } from './concepto-comprobante/concepto-comprobante.component';
import {RouterModule, Routes} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CoreCommonModule} from "../../../../@core/common.module";
import {BlockUIModule} from "ng-block-ui";
import {ContentHeaderModule} from "../../../layout/components/content-header/content-header.module";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {MiscellaneousModule} from "../../pages/miscellaneous/miscellaneous.module";
import {CoreCardModule} from "../../../../@core/components/core-card/core-card.module";
import {NgSelectModule} from "@ng-select/ng-select";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'conceptoComprobante',
        component: ConceptoComprobanteComponent
      }
    ]
  },
]

@NgModule({
  declarations: [
    ConceptoComprobanteComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    CoreCommonModule,
    BlockUIModule.forRoot(),
    ContentHeaderModule,
    NgxDatatableModule,
    MiscellaneousModule,
    CoreCardModule,
    NgSelectModule
  ]
})
export class MaestrosModule { }
