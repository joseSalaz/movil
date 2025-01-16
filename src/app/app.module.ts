import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/header/header.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { HistorialComponent } from './pages/pedidos/historial/historial.component';
import { RegistroComponent } from './pages/pedidos/registro/registro.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { DetalleVentaComponent } from './pages/pedidos/detalle-venta/detalle-venta.component';

import { LoadingComponent } from './pages/loading/loading.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    InicioComponent,
    HistorialComponent,
    RegistroComponent,
    LoginComponent,
    DetalleVentaComponent,
    InicioComponent,
    LoadingComponent,
    HeaderComponent,
    CommonModule,
    FormsModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
