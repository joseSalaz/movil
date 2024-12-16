import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { VentaService } from '../../../service/venta.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  idDetalleVenta!: number;
  estado: string = 'En Proceso';
  descripcion: string = '';
  imagePreview: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private ventaService: VentaService,
    private router: Router
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && !isNaN(+idParam)) {
      this.idDetalleVenta = +idParam;
      this.cargarEstadoActual();
    } else {
      console.error('ID inválido o no encontrado. Redirigiendo a historial...');
      this.router.navigate(['/historial']); // Redirige a historial
    }
  }  
  
  async takePhoto() {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    this.imagePreview = photo.dataUrl;
  }

  cargarEstadoActual() {
    this.ventaService.getDetalleById(this.idDetalleVenta).subscribe((data) => {
      this.estado = data.estado;
    });
  }

 

  obtenerSiguienteEstado(estadoActual: string): string {
    if (estadoActual === 'En Proceso') return 'Empaquetado';
    if (estadoActual === 'Empaquetado') return 'Entregado';
    return 'Entregado';
  }
  guardarEvidencia() {
    const nuevoEstado = this.obtenerSiguienteEstado(this.estado);
  
    // Crear el FormData
    const formData = new FormData();
    formData.append('IdEstadoPedidoImagen', '0'); // Nuevo registro, valor inicial
    formData.append('IdEstadoPedido', this.idDetalleVenta.toString());
    formData.append('UrlImagen', ''); // La URL se llenará en el backend
    formData.append('Estado', nuevoEstado);
    formData.append('Fecha', new Date().toISOString());
  
    // Adjuntar el archivo directo (sin convertir a base64)
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
  
    fileInput.onchange = () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        formData.append('images', file); // Clave "images" como espera el backend
  
        // Enviar la solicitud al backend
        this.ventaService.crearEstadoPedidoImagen(formData).subscribe({
          next: () => {
            console.log('Evidencia guardada correctamente.');
            this.router.navigate(['/historial']);
          },
          error: (err:any) => console.error('Error al guardar evidencia:', err),
        });
      }
    };
  
    fileInput.click(); // Abre el selector de archivos
  }

}
