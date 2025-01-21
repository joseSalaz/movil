import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private messageSubject = new BehaviorSubject<any>(null);
  
  public readonly token$: Observable<string | null> = this.tokenSubject.asObservable();
  public readonly message$ = this.messageSubject.asObservable();

  constructor(
    private http: HttpClient
  ) {}

  async initialize(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      console.log('No estamos en un entorno nativo');
      return false;
    }

    try {
      // Verificar y solicitar permisos
      const permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt' || permStatus.receive === 'denied') {
        const request = await PushNotifications.requestPermissions();
        if (request.receive !== 'granted') {
          console.log('Permisos denegados');
          return false;
        }
      }

      // Registrar para notificaciones
      await PushNotifications.register();
      
      // Configurar listeners
      this.setupListeners();
      
      return true;
    } catch (error) {
      console.error('Error al inicializar notificaciones:', error);
      return false;
    }
  }

  private setupListeners(): void {
    // Limpiar listeners anteriores
    PushNotifications.removeAllListeners();

    // Token registration
    PushNotifications.addListener('registration', (token) => {
      console.log('Token FCM:', token.value);
      this.tokenSubject.next(token.value);
      this.sendTokenToBackend(token.value,2).subscribe( {
      });
    });

    // Registration error
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error al registrar FCM:', error);
      this.tokenSubject.next(null);
    });

    // Recepción de notificación
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Notificación recibida:', notification);
      this.messageSubject.next(notification);
    });

    // Acción sobre notificación
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Acción realizada:', action);
      this.messageSubject.next(action);
    });
  }

  sendTokenToBackend(token: string, userId: number): Observable<any> {
    const payload = { usuarioId: userId, token: token };
    return this.http.post<any>(`https://api20250116150338.azurewebsites.net/api/Notificacion/register-token`, payload).pipe(
      catchError((error) => {
        alert(JSON.stringify(error));
        throw error;
      })
    );
  }

  // Método público para obtener el token actual
  getCurrentToken(): string | null {
    return this.tokenSubject.getValue();
  }
}