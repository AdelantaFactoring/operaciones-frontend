import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendientePagoComponent } from './pendiente-pago/pendiente-pago.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { CoreCardModule } from '@core/components/core-card/core-card.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NavContentComponent } from './pendiente-pago/nav-content/nav-content.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { EjecutivoComponent } from './ejecutivo/ejecutivo.component';
import { ProyectadoComponent } from './proyectado/proyectado.component';
import { AcumEjecutivoComponent } from './acum-ejecutivo/acum-ejecutivo.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pendientepago/:moneda',
        component: PendientePagoComponent
      },
      {
        path: 'ejecutivo/:moneda',
        component: EjecutivoComponent
      },
      {
        path: 'proyectado/:moneda',
        component: ProyectadoComponent
      },
      {
        path: 'acumEjecutivo',
        component: AcumEjecutivoComponent
      }
    ]
  },
]

@NgModule({
  declarations: [
    PendientePagoComponent,
    NavContentComponent,
    EjecutivoComponent,
    ProyectadoComponent,
    AcumEjecutivoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    ContentHeaderModule,
    BlockUIModule.forRoot(),
    CoreCardModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    
  ]
})
export class DashboardModule { }
