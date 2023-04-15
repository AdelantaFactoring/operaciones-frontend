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
import { ParametrosComponent } from './parametros/parametros.component';
import {NgxMaskModule} from "ngx-mask";
import { CorrelativoFacturaComponent } from './correlativo-factura/correlativo-factura.component';
import { CorrelativoNCComponent } from './correlativo-nc/correlativo-nc.component';
import { CorrelativoNDComponent } from './correlativo-nd/correlativo-nd.component';
import { MonedaComponent } from './moneda/moneda.component';
import { TipoOperacionComponent } from './tipo-operacion/tipo-operacion.component';
import { AsignacionComponent } from './tipo-operacion/asignacion/asignacion.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'moneda',
        component: MonedaComponent
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'conceptoComprobante',
        component: ConceptoComprobanteComponent
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'tipoOperacion',
        component: TipoOperacionComponent
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'parametros',
        component: ParametrosComponent
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'correlativoFactura',
        component: CorrelativoFacturaComponent
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'correlativoNC',
        component: CorrelativoNCComponent
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'correlativoND',
        component: CorrelativoNDComponent
      }
    ]
  },
]

@NgModule({
  declarations: [
    ConceptoComprobanteComponent,
    ParametrosComponent,
    CorrelativoFacturaComponent,
    CorrelativoNCComponent,
    CorrelativoNDComponent,
    MonedaComponent,
    TipoOperacionComponent,
    AsignacionComponent
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
        NgSelectModule,
        NgxMaskModule.forRoot()
    ]
})
export class MaestrosModule { }
