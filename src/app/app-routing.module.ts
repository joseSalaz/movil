import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { HistorialComponent } from './pages/pedidos/historial/historial.component';
import { RegistroComponent } from './pages/pedidos/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { DetalleVentaComponent } from './pages/pedidos/detalle-venta/detalle-venta.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirección al LoginComponent
  { path: 'login', component: LoginComponent }, // Ruta abierta para login
  { path: 'registro/:id', 
  component: RegistroComponent, 
},
  // Ruta abierta para registro
  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [authGuard], // Ruta protegida por AuthGuard
  },
  {
    path: 'historial',
    component: HistorialComponent,
    canActivate: [authGuard], // Ruta protegida por AuthGuard
  },
  {
    path: 'detalle-venta/:id',
    component: DetalleVentaComponent,
    canActivate: [authGuard], // Ruta protegida por AuthGuard
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }, // Ruta comodín para manejar no encontradas
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
