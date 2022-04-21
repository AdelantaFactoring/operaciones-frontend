import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guards';

const routes: Routes = [
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
    path: 'auth',
    loadChildren: () => import('app/auth/auth.module').then(m => m.AuthModule)
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
