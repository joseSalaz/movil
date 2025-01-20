import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { LoginData } from '../../models/LoginData';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData: LoginData = { username: '', password: '' };
  notificationMessage: string | null = null; // Mensaje de notificación
  notificationSuccess: boolean = true; // Estado de la notificación
  constructor(private authService: AuthService, private router: Router, private spinner: NgxSpinnerService) {
    if (this.authService.getToken()) {
      this.router.navigate(['/inicio']);
    }
  }

  ngOnInit() {
    if (this.authService.getToken()) {
      this.router.navigate(['/inicio']);
    }
  }

  login() {
    this.spinner.show(); // Muestra el spinner
    this.authService.login(this.loginData.username, this.loginData.password).subscribe(
      (response) => {
        this.spinner.hide(); // Oculta el spinner

        if (response.success) {
          // Login exitoso
          this.notificationMessage = 'Inicio de sesión exitoso';
          this.notificationSuccess = true;
          this.router.navigate(['/inicio']); // Redirige al inicio después de 2 segundos
          setTimeout(() => (this.notificationMessage = null), 2000);
        }
      },
      (error) => {
        this.spinner.hide(); // Oculta el spinner

        // Login fallido
        this.notificationMessage = 'Credenciales incorrectas';
        this.notificationSuccess = false;
        setTimeout(() => (this.notificationMessage = null), 3000);
      }
    );
  }
}
