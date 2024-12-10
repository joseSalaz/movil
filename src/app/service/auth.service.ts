import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/Auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endPoint = environment.endPoint;
  private apiUrl = this.endPoint + 'api/Auth';
  
  constructor(private http: HttpClient) { }
  
  // Solicitud de login
  login(username: string, password: string): Observable<AuthResponse> {  // Usa la interfaz aquí
    const payload = { username, password };
    return this.http.post<AuthResponse>(this.apiUrl, payload).pipe(
      tap(response => {
        if (response && response.token) {
          console.log('Token recibido:', response.token);
          this.saveToken(response.token); // Guarda el token en localStorage
        }
      })
    );
  }
  
  // Guardar el token
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }
  
  // Obtener el token guardado
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Agregar el token al header para solicitudes autenticadas
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': 'Bearer ' + token
      });
    }
    return new HttpHeaders();
  }

  // Realizar solicitud protegida usando el token en los headers
  getProtectedData(): Observable<any> {
    return this.http.get(this.endPoint + 'api/protected-data', {
      headers: this.getAuthHeaders()
    });
  }

  // Logout (Eliminar token)
  logout(): void {
    localStorage.removeItem('authToken');
  }
}
