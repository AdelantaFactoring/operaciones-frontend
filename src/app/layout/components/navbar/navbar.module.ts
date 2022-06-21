import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentHeaderModule } from '../../../layout/components/content-header/content-header.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';

import { CoreCommonModule } from '@core/common.module';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';

import { NavbarComponent } from 'app/layout/components/navbar/navbar.component';
import { NavbarSearchComponent } from 'app/layout/components/navbar/navbar-search/navbar-search.component';
import { AccountSettingsComponent } from './cuenta/account-settings/account-settings.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'cuenta/account-settings',
        component: AccountSettingsComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    NavbarComponent,
    NavbarSearchComponent,
    AccountSettingsComponent
  ],
  imports: [
    RouterModule, 
    NgbModule, 
    CoreCommonModule, 
    PerfectScrollbarModule, 
    CoreTouchspinModule,
    ContentHeaderModule],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports: [NavbarComponent]
})
export class NavbarModule {}
