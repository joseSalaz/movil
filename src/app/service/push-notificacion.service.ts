import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private messaging = getMessaging();

  constructor() {}

  async initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      await this.registerPush();
    }
  }

  private async registerPush() {
    let permStatus = await PushNotifications.checkPermissions();
    
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.log('Permiso no otorgado para notificaciones push');
      return;
    }

    await PushNotifications.register();

    await PushNotifications.addListener('registration', (token:any) => {
      console.log('Token de notificación push: ' + token.value);
      this.sendTokenToBackend(token.value, 1);
    });

    await PushNotifications.addListener('registrationError', (error) => {
      console.error('Error de registro de notificaciones push:', error);
    });

    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Notificación push recibida:', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Acción realizada sobre la notificación push:', notification);
    });

    onMessage(this.messaging, (payload) => {
      console.log('Mensaje recibido en primer plano:', payload);
    });
  }

  private sendTokenToBackend(token: string, userId: number) {
    fetch('https://api20250116150338.azurewebsites.net/api/notification/register-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuarioId: userId, token: token }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Token registrado en el backend:', data);
    })
    .catch(error => {
      console.error('Error al registrar el token en el backend:', error);
    });
  }

}