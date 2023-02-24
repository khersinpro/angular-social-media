import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplexeFormModuleRoutingModule } from './complexe-form-module-routing.module';
import { ComplexeFormComponent } from './components/complexe-form/complexe-form.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ComplexeFormComponent
  ],
  imports: [
    CommonModule,
    ComplexeFormModuleRoutingModule,
    SharedModule
  ]
})
export class ComplexeFormModuleModule { }
