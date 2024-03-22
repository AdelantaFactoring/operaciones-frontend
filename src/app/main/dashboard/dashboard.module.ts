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
import { AcumPagadorComponent } from './acum-pagador/acum-pagador.component';
import { SectorComponent } from './sector/sector.component';
import { VigenteComponent } from './vigente/vigente.component';
import { VencidoComponent } from './vencido/vencido.component';
import { CoreCommonModule } from '@core/common.module';
import { ConfirmingComponent } from './confirming/confirming.component';
import { ObjToArrayPipe } from './prueba.pipe';
import { PowerBiComponent } from './power-bi/power-bi.component';
import { KPIComponent } from './kpi/kpi.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'powerbi',
        component: PowerBiComponent,
        data: { animation: 'powerbi'},
      },
      {
        path: 'kpi',
        component: KPIComponent,
        data: { animation: 'kpi'},
      },
      {
        path: 'pendientepago/:moneda',
        component: PendientePagoComponent,
        data: { animation: 'pendientepago'},
      },
      {
        path: 'ejecutivo/:moneda',
        component: EjecutivoComponent,
        data: { animation: 'ejecutivo'},
      },
      {
        path: 'proyectado/:moneda',
        component: ProyectadoComponent,
        data: { animation: 'proyectado'},
      },
      {
        path: 'acumEjecutivo',
        component: AcumEjecutivoComponent,
        data: { animation: 'acumEjecutivo'},
      },
      {
        path: 'acumPagador',
        component: AcumPagadorComponent,
        data: { animation: 'acumPagador'},
      },
      {
        path: 'sector',
        component: SectorComponent,
        data: { animation: 'sector'},
      },
      {
        path: 'vigente',
        component: VigenteComponent,
        data: { animation: 'vigente'},
      },
      {
        path: 'vencido',
        component: VencidoComponent,
        data: { animation: 'vencido'},
      },
      {
        path: 'confirming',
        component: ConfirmingComponent,
        data: { animation: 'confirming'},
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
    AcumEjecutivoComponent,
    AcumPagadorComponent,
    SectorComponent,
    VigenteComponent,
    VencidoComponent,
    ConfirmingComponent,
    ObjToArrayPipe,
    PowerBiComponent,
    KPIComponent
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
    CoreCommonModule,
    // CoreTouchspinModule,
    // NgxMaskModule.forRoot(),
    // FileUploadModule,
    // CardSnippetModule,
    // CoreDirectivesModule,
    // PerfectScrollbarModule,
  ]
})
export class DashboardModule { }
