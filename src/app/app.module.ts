import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/header/header.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { HistorialComponent } from './pages/pedidos/historial/historial.component';
import { RegistroComponent } from './pages/pedidos/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { DetalleVentaComponent } from './pages/pedidos/detalle-venta/detalle-venta.component';

import { LoadingComponent } from './pages/loading/loading.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from './environment/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
<<<<<<< HEAD
import { PermisosComponent } from './pages/notification/permisos/permisos.component';

=======
import { SharedModule } from './pages/shared/shared.module';
>>>>>>> 3984bb7487e429325a200fe28bbee7aca69b6ca0


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    InicioComponent,
    HistorialComponent,
    RegistroComponent,
    LoginComponent,
    DetalleVentaComponent,
    LoadingComponent,
    PermisosComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
