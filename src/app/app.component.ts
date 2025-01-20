import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PushNotificationService } from './service/push-notificacion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'LibMovil';
  constructor(private pushService: PushNotificationService) {}

  // Opción 1: En ngOnInit
  async ngOnInit() {
    const initialized = await this.pushService.initialize();
    if (initialized) {
      console.log('Notificaciones inicializadas correctamente');
      alert("token"+this.pushService.token$)
    }
  }
}
