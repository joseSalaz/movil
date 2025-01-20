import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionComponent } from './notification/notification.component';

@NgModule({
  declarations: [
    NotificacionComponent, // Declara el componente
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NotificacionComponent, // Exporta el componente para usarlo en otros módulos
  ]
})
export class SharedModule {}
