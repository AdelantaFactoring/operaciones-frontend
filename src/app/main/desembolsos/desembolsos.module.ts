import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AprobacionComponent } from './aprobacion/aprobacion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { BlockUIModule } from 'ng-block-ui';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { FileUploadModule } from 'ng2-file-upload';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'aprobacion',
        component: AprobacionComponent
      }
    ]
  },
]

@NgModule({
  declarations: [
    AprobacionComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        CoreCommonModule,
        BlockUIModule.forRoot(),
        ContentHeaderModule,
        CoreTouchspinModule,
        NgSelectModule,
        NgxMaskModule.forRoot(),
        FileUploadModule,
        CardSnippetModule,
        CoreDirectivesModule,
        PerfectScrollbarModule
    ]
})
export class DesembolsosModule { }
