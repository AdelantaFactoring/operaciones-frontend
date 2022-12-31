import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoreCommonModule } from '@core/common.module';
import { CoreCardModule } from '@core/components/core-card/core-card.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';
import { CoreSidebarModule } from '@core/components';
import { NgxMaskModule } from 'ngx-mask';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BlockUIModule } from 'ng-block-ui';

import { TipoCambioComponent } from './tipo-cambio/tipo-cambio.component';
import { GastosMoraComponent } from './gastos-mora/gastos-mora.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'tipo-cambio',
                component: TipoCambioComponent
            }
        ]
    },
  {
    path: '',
    children: [
      {
        path: 'gastosMora',
        component: GastosMoraComponent
      }
    ]
  },
]

@NgModule({
    declarations: [
        TipoCambioComponent,
        GastosMoraComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgbModule,
        TranslateModule,
        CoreCommonModule,
        CoreCardModule,
        ContentHeaderModule,
        CoreTouchspinModule,
        CoreSidebarModule,
        NgxDatatableModule,
        Ng2FlatpickrModule,
        NgSelectModule,
        PerfectScrollbarModule,
        NgxMaskModule.forRoot(),
        SweetAlert2Module.forRoot(),
        BlockUIModule.forRoot()
    ]
})
export class CatalogoModule { }
