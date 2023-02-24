import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'social-media', loadChildren: () => import('./social-media/social-media.module').then(module => module.SocialMediaModule) },
  { path: 'complexe-form', loadChildren: () => import('./complexe-form-module/complexe-form-module.module').then( module => module.ComplexeFormModuleModule)},
  { path: '**', redirectTo: 'social-media' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
