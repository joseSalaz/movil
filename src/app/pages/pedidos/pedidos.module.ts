import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro/registro.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    RegistroComponent
  ],
  imports: [
    CommonModule,
    SharedModule 
  ]
})
export class PedidosModule {}
