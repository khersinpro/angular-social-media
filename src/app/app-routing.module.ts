import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveStateModule } from './reactive-state/reactive-state.module';

const routes: Routes = [
  { path: 'social-media', loadChildren: () => import('./social-media/social-media.module').then(module => module.SocialMediaModule) },
  { path: 'reactive-state', loadChildren: () => import('./reactive-state/reactive-state.module').then(module => module.ReactiveStateModule) },
  { path: 'complexe-form', loadChildren: () => import('./complexe-form-module/complexe-form-module.module').then( module => module.ComplexeFormModuleModule)},
  { path: '**', redirectTo: 'social-media' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
