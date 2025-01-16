import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';

import { Router } from '@angular/router';
import { LoginData } from '../../models/LoginData';
import { AuthResponse } from '../../models/Auth';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  // Asegúrate de usar 'styleUrls'
})
export class LoginComponent implements OnInit{
  loginData: LoginData = { username: '', password: '' };
  errorMessage: string | null = null;
  notificationMessage: string | null = null;
  notificationSuccess: boolean = true;
  isLoading: boolean = false; // Estado de carga
  constructor(private authService: AuthService, private router: Router, private spinner: NgxSpinnerService) {
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
    this.spinner.show();
    
    this.authService.login(this.loginData.username, this.loginData.password).subscribe(
      (response) => {
        this.spinner.hide();
        if (response.success) {
          this.router.navigate(['/inicio']);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error('Error:', error);
      }
    );
  } 
}
