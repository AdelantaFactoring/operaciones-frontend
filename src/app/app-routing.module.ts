import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guards';

const routes: Routes = [
  {
    path: 'clientes',
    loadChildren: () => import('app/main/clientes/clientes.module').then(m => m.ClientesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'comercial',
    loadChildren: () => import('app/main/comercial/comercial.module').then(m => m.ComercialModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'riesgos',
    loadChildren: () => import('app/main/riesgos/riesgos.module').then(m => m.RiesgosModule),
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
