import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';

import { Router } from '@angular/router';
import { LoginData } from '../../models/LoginData';
import { AuthResponse } from '../../models/Auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  // Asegúrate de usar 'styleUrls'
})
export class LoginComponent implements OnInit{
  loginData: LoginData = { username: '', password: '' };  // Usamos LoginData para las credenciales
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.getToken()) {
      this.router.navigate(['/inicio']); // Redirige automáticamente si el usuario ya está autenticado
    }
  }
  
  ngOnInit() {
    if (this.authService.getToken()) {
      this.router.navigate(['/inicio']);
    }
  }
  login() {
    debugger;
    this.authService.login(this.loginData.username, this.loginData.password).subscribe(
      (response: AuthResponse) => {  // Especifica que la respuesta es de tipo AuthResponse
        if (response.success) {
          // Guardar el token en localStorage
          this.authService.saveToken(response.token);
          alert('Login exitoso');
          this.router.navigate(['/inicio']);  // Redirigir al inicio
        } else {
          this.errorMessage = 'Credenciales inválidas.';
        }
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Ocurrió un error al iniciar sesión.';
      }
    );
  }
}
