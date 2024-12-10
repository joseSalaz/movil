import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { App } from '@capacitor/app';



@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit, OnDestroy {

  private backButtonListener: any;

  constructor(private router: Router) {}

  ngOnInit() {
    // Escucha el evento de retroceso
    this.backButtonListener = App.addListener('backButton', () => {
      this.handleBackButton();
    });
  }

  ngOnDestroy() {
    // Limpia el listener para evitar fugas de memoria
    if (this.backButtonListener) {
      this.backButtonListener.remove();
    }
  }

  handleBackButton() {
    // Navega a la página anterior o cierra la app
    if (this.router.url === '/registro') {
      this.router.navigate(['/inicio']); // Cambia a la ruta anterior
    } else {
      App.exitApp(); // Si no hay más páginas, cierra la aplicación
    }
  }

  estado: string = 'En Proceso';
    // Variable para almacenar la imagen capturada
    imagePreview: string | undefined;

    // Función para abrir la cámara y capturar la imagen
    async takePhoto() {
      try {
        const photo = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl, // Devuelve la imagen como base64 (DataUrl)
          source: CameraSource.Camera // Usamos la cámara para capturar la foto
        });
        
        // Asignamos la imagen capturada a la variable de previsualización
        this.imagePreview = photo.dataUrl;
      } catch (error) {
        console.error("Error tomando la foto: ", error);
      }
    }
}
