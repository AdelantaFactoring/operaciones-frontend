import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import {AuditComponent} from "./audit/audit.component";

@NgModule({
  declarations: [AuditComponent],
  imports: [
    CommonModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    MiscellaneousModule,
    Ng2FlatpickrModule,
  ],
  exports: [
    AuditComponent
  ],
  providers: []
})
export class PagesModule {}
