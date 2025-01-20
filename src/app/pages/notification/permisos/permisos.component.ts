import { Component } from '@angular/core';
import { PushNotificationService } from '../../../service/push-notificacion.service';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.css'
})
export class PermisosComponent {
  constructor(private pushNotificationService: PushNotificationService) {}

  async solicitarPermisos() {
    const permisoConcedido = await this.pushNotificationService.requestNotificationPermission();
    if (permisoConcedido) {
      console.log('El usuario aceptó las notificaciones');
    } else {
      console.log('El usuario rechazó las notificaciones');
    }
  }
}
