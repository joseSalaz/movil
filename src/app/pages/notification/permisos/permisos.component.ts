import { Component } from '@angular/core';
import { PushNotificationService } from '../../../service/push-notificacion.service';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.css'
})
export class PermisosComponent {
  constructor(private pushService: PushNotificationService) {}

  async ngOnInit() {
    const initialized = await this.pushService.initialize();
    
    if (initialized) {
      // Suscribirse a cambios en el token
      this.pushService.token$.subscribe(token => {
        console.log('Token recibido:', token);
      });

      // Suscribirse a mensajes
      this.pushService.message$.subscribe(message => {
        console.log('Mensaje recibido:', message);
      });
    }
  }
}
