import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyecta servicios
  const router = inject(Router);

  if (authService.getToken()) {
    return true; // Usuario autenticado
  } else {
    router.navigate(['/login']); // Redirige al login si no está autenticado
    return false;
  }
};
