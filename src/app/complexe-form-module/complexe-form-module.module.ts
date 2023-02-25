import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplexeFormModuleRoutingModule } from './complexe-form-module-routing.module';
import { ComplexeFormComponent } from './components/complexe-form/complexe-form.component';
import { SharedModule } from '../shared/shared.module';
import { ComplexeFormService } from './services/complexe-form.service';


@NgModule({
  declarations: [
    ComplexeFormComponent
  ],
  providers: [
    ComplexeFormService
  ],
  imports: [
    CommonModule,
    ComplexeFormModuleRoutingModule,
    SharedModule
  ]
})
export class ComplexeFormModuleModule { }
