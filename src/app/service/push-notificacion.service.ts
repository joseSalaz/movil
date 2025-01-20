import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { getMessaging, onMessage } from 'firebase/messaging';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private messaging = getMessaging();
  private currentToken: string | null = null;

  constructor() {}

  async requestNotificationPermission(): Promise<boolean> {
    try {
      // Verificar si estamos en Android
      const platform = Capacitor.getPlatform();
      
      if (platform === 'android') {
        // En Android 13+ (SDK 33+), necesitamos solicitar el permiso explícitamente
        try {
          const result = await PushNotifications.requestPermissions();
          if (result.receive === 'granted') {
            await this.initializePushNotifications();
            return true;
          } else {
            console.log('Permiso denegado por el usuario');
            return false;
          }
        } catch (err) {
          console.error('Error al solicitar permisos:', err);
          return false;
        }
      } else {
        // Para versiones anteriores de Android o iOS
        let permStatus = await PushNotifications.checkPermissions();
        
        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive === 'granted') {
          await this.initializePushNotifications();
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.error('Error general al solicitar permisos:', error);
      return false;
    }
  }

  private async initializePushNotifications() {
    try {
      await PushNotifications.register();
      await this.registerPushListeners();
    } catch (error) {
      console.error('Error al inicializar notificaciones:', error);
      throw error;
    }
  }

  private async registerPushListeners() {
    // Remover listeners existentes para evitar duplicados
    PushNotifications.removeAllListeners();
    
    // Listener para el token
    PushNotifications.addListener('registration', async (token) => {
      console.log('Token FCM recibido:', token.value);
      this.currentToken = token.value;
      await this.sendTokenToBackend(token.value, 2);
    });

    // Listener para errores de registro
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error en registro FCM:', error);
    });

    // Listener para notificaciones recibidas (app en primer plano)
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Notificación recibida:', notification);
    });

    // Listener para cuando se toca la notificación
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Notificación tocada:', notification);
    });
  }

  private async sendTokenToBackend(token: string, userId: number) {
    try {
      const response = await fetch(
        'https://api20250116150338.azurewebsites.net/api/notification/register-token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            usuarioId: userId, 
            token: token 
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Token registrado exitosamente:', data);

    } catch (error) {
      console.error('Error al registrar token en backend:', error);
    }
  }
}