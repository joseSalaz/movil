import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { VentaService } from '../../../service/venta.service';
import { EstadoPedidoImagene } from '../../../models/estado_pedido_imagene';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  idDetalleVenta!: number;
  idVentas: number | null = null;
  estado: string = 'En Proceso';
  descripcion: string = '';
  imagePreviews: string[] = [];
  images: File[] = [];
  areImagesValid: boolean[] = [];
  allImagesValid: boolean = false;
  isLoading: boolean = false;
  nuevoEstado: string = '';
  imagenesActuales: EstadoPedidoImagene[] = [];
  selectedEstado: string = '';
  estados: string[] = ['En Proceso', 'Empaquetado', 'Entregado'];
  fecha: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private ventaService: VentaService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && !isNaN(+idParam)) {
      this.idDetalleVenta = +idParam;
      console.log('ID de detalle de venta:', this.idDetalleVenta);
      this.cargarEstadoActual();
      this.obtenerIdVentas();  // Llamar a obtenerIdVentas aquí
    } else {
      console.error('ID inválido o no encontrado. Redirigiendo a historial...');
      this.router.navigate(['/historial']);
    }
  }
  async takePhoto() {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (photo.dataUrl) {
        this.imagePreviews.push(photo.dataUrl);
        const file = this.dataURLtoFile(photo.dataUrl, `imagen${this.images.length + 1}.jpg`);
        this.images.push(file);
        this.areImagesValid.push(false); // Inicializar la validez como falsa
        this.validarImagen(file, this.images.length - 1);
      }
    } catch (error) {
      console.error("Error al tomar la foto:", error);
      // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      alert("No se pudo acceder a la cámara o tomar la foto.");
    }
  }

  validarImagen(file: File, index: number) {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('File', file);

    this.ventaService.validarImagenLibro(formData).subscribe({
      next: (data) => {
        this.isLoading = false;
        const tags = data.tags || [];
        const bookTag = tags.find(
          (tag: any) => tag.name === 'book' && tag.confidence >= 0.75
        );

        this.areImagesValid[index] = !!bookTag; // Asigna true o false directamente
        if (!bookTag) {
          alert('La imagen ' + (index + 1) + ' no parece ser un libro o no tiene suficiente claridad.');
        }
        this.allImagesValid = this.areImagesValid.every(isValid => isValid);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al validar imagen:', err);
        alert('Ocurrió un error al validar la imagen ' + (index + 1) + '. Verifica el archivo.');
        this.areImagesValid[index] = false;
        this.allImagesValid = this.areImagesValid.every(isValid => isValid);
      },
    });
  }

  async obtenerIdVentas() {
    this.isLoading = true;
    try {
      const detalle = await firstValueFrom(this.ventaService.getVentaDetallesid(this.idDetalleVenta));
      if (detalle && detalle.idVentas) {
        this.idVentas = detalle.idVentas;
        console.log('IdVentas obtenido:', this.idVentas);
      } else {
        console.error('No se pudo obtener idVentas del detalle.');
        alert('No se pudo obtener la información de la venta. Recargue la página.');
        this.idVentas = null;
      }
    } catch (error) {
      console.error('Error al obtener el detalle:', error);
      alert('Error al obtener la información de la venta.');
      this.idVentas = null;
    } finally {
      this.isLoading = false;
      this.changeDetector.detectChanges();
    }
  }

  cargarEstadoActual() {
    this.ventaService.getDetalleById(this.idDetalleVenta).subscribe({
      next: (data) => {
        if (data && data.estado) {
          this.estado = data.estado;
          this.idVentas = data.idVentas;  // Asignamos idVentas aquí
          console.log('ID de venta:', this.idVentas);
        } else {
          console.error('La respuesta no contiene el estado esperado.');
          this.estado = 'Desconocido';
        }
        this.changeDetector.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar estado actual:', err);
        this.estado = 'Error';
        this.changeDetector.detectChanges();
      },
    });
  }
  private formatDateToMMDDYYYY(date: Date): string {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
}
  guardarEvidencia() {
    if (!this.allImagesValid || this.images.length === 0) {
      alert('Debes tomar al menos una foto válida antes de guardar.');
      return;
    }

    if (!(this.fecha instanceof Date) || isNaN(this.fecha.getTime())) {
      console.error('Fecha no válida:', this.fecha);
      alert('La fecha seleccionada no es válida. Por favor, verifica la entrada.');
      return;
    }

    if (!this.idVentas) {
      console.error('ID de venta no disponible.');
      alert('El ID de venta no está disponible. Recargue la página.');
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('idVenta', this.idVentas.toString());
    formData.append('Estado', this.selectedEstado);
    formData.append('FechaEstado', this.formatDateToMMDDYYYY(this.fecha));
    formData.append('Comentario', this.descripcion);

    this.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    console.log('FormData:', formData);
    console.log('IdVentas:', this.idVentas);

    this.ventaService.actualizarEstadoPedidoConImagenes(this.idDetalleVenta, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Respuesta del servidor:', response);
        this.router.navigate(['/historial']);
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al actualizar:', error);
        let errorMessage = 'Ocurrió un error al actualizar: \n';
        if (error?.error?.errors) {
          for (const key in error.error.errors) {
            errorMessage += `- ${key}: ${error.error.errors[key].join('\n - ')} \n`;
          }
        } else if (error?.error?.title) {
          errorMessage = error.error.title;
        } else if (error.message) {
          errorMessage = error.message;
        } else {
          errorMessage = 'Error desconocido. Contacte al administrador.';
        }
        alert(errorMessage);
      },
    });
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fecha = new Date(input.value);
    if (isNaN(this.fecha.getTime())) {
      alert('La fecha seleccionada no es válida. Por favor, verifica la entrada.');
    }
  }

  eliminarImagen(index: number) {
    this.imagePreviews.splice(index, 1);
    this.images.splice(index, 1);
    this.areImagesValid.splice(index, 1);
    this.allImagesValid = this.areImagesValid.every(isValid => isValid);
  }

  obtenerSiguienteEstado(estadoActual: string): string {
    if (estadoActual === 'En Proceso') return 'Empaquetado';
    if (estadoActual === 'Empaquetado') return 'Entregado';
    return 'Entregado';
  }

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
