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
  isImageValid: boolean = false; // Control para bloquear el botón Guardar
  isLoading: boolean = false; 
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
      this.router.navigate(['/historial']);
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

    // Validar la imagen al tomarla
    this.validarImagen(this.dataURLtoFile(photo.dataUrl!, 'imagen.jpg'));
  }

  cargarEstadoActual() {
    this.ventaService.getDetalleById(this.idDetalleVenta).subscribe({
      next: (data) => {
        if (data && data.estado) {
          this.estado = data.estado;
        } else {
          console.error('La respuesta no contiene el estado esperado.');
          this.estado = 'Desconocido'; // Valor por defecto en caso de error
        }
      },
      error: (err) => {
        console.error('Error al cargar estado actual:', err);
        this.estado = 'Error'; // Muestra un valor alternativo
      },
    });
  }
  

validarImagen(file: File) {
  this.isLoading = true; // Activa el spinner

  const formData = new FormData();
  formData.append('File', file); // Clave correcta: "File"

  this.ventaService.validarImagenLibro(formData).subscribe({
    next: (data) => {
      this.isLoading = false; // Desactiva el spinner
      const tags = data.tags || [];
      const bookTag = tags.find(
        (tag: any) => tag.name === 'book' && tag.confidence >= 0.75
      );

      if (bookTag) {
        this.isImageValid = true;
        console.log('Imagen válida:', bookTag);
      } else {
        this.isImageValid = false;
        alert('La imagen no parece ser un libro o no tiene suficiente claridad.');
      }
    },
    error: (err) => {
      this.isLoading = false; 
      console.error('Error al validar imagen:', err);
      alert('Ocurrió un error al validar la imagen. Verifica el archivo.');
    },
  });
}


  guardarEvidencia() {
    if (!this.isImageValid) {
      alert('No puedes guardar porque la imagen no es válida.');
      return;
    }

    const nuevoEstado = this.obtenerSiguienteEstado(this.estado);
    const formData = new FormData();
    formData.append('IdEstadoPedidoImagen', '0');
    formData.append('IdEstadoPedido', this.idDetalleVenta.toString());
    formData.append('UrlImagen', '');
    formData.append('Estado', nuevoEstado);
    formData.append('Fecha', new Date().toISOString());
    formData.append('images', this.dataURLtoFile(this.imagePreview!, 'imagen.jpg'));

    this.ventaService.crearEstadoPedidoImagen(formData).subscribe({
      next: () => {
        console.log('Evidencia guardada correctamente.');
        this.router.navigate(['/historial']);
      },
      error: (err) => console.error('Error al guardar evidencia:', err),
    });
  }

  obtenerSiguienteEstado(estadoActual: string): string {
    if (estadoActual === 'En Proceso') return 'Empaquetado';
    if (estadoActual === 'Empaquetado') return 'Entregado';
    return 'Entregado';
  }

  // Convierte base64 a File
  dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
