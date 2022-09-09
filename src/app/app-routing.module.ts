import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guards';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('app/main/dashboard/dashboard.module').then(m => m.DashboardModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'comercial',
    loadChildren: () => import('app/main/comercial/comercial.module').then(m => m.ComercialModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'operaciones',
    loadChildren: () => import('app/main/operaciones/operaciones.module').then(m => m.OperacionesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'desembolso',
    loadChildren: () => import('app/main/desembolsos/desembolsos.module').then(m => m.DesembolsosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cobranza',
    loadChildren: () => import('app/main/cobranza/cobranza.module').then(m => m.CobranzaModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'facturacion',
    loadChildren: () => import('app/main/facturacion/facturacion.module').then(m => m.FacturacionModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'seguridad',
    loadChildren: () => import('app/main/seguridad/seguridad.module').then(m => m.SeguridadModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pages',
    loadChildren: () => import('app/main/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('app/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'navbar',
    loadChildren: () => import('app/layout/components/navbar/navbar.module').then(m => m.NavbarModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
