import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UsuarioGuard } from './guards/usuario.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/jornada',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  // {
  //   path: 'registro',
  //   loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  //   // canLoad: [UsuarioGuard]
  // },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule),
    canLoad: [UsuarioGuard]
   },
  {
    path: 'reset',
    loadChildren: () => import('./pages/reset/reset.module').then( m => m.ResetPageModule)
  }
  //,
  // {
  //   path: 'informacion',
  //   loadChildren: () => import('./pages/informacion/informacion.module').then( m => m.InformacionPageModule)
  // },
  // {
  //   path: 'perfil',
  //   loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
