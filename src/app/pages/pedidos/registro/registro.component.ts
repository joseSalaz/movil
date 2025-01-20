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
  idEstadoPedido!: number;
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
      this.obtenerIdEstadoPedido();
      this.inicializarDatos();
    } else {
      console.error('ID inválido o no encontrado. Redirigiendo a historial...');
      this.router.navigate(['/historial']);
    }
  }
  private async inicializarDatos() {
    try {
      this.isLoading = true;
      this.fecha = new Date(); 
      await this.obtenerIdVentas();
      await this.obtenerIdEstadoPedido();
      await this.cargarEstadoActual();
    } catch (error) {
      console.error('Error al inicializar datos:', error);
      alert('Error al cargar los datos iniciales. Por favor, recargue la página.');
    } finally {
      this.isLoading = false;
      this.changeDetector.detectChanges();
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
            const file = this.dataURLtoFile(photo.dataUrl, `imagen${this.images.length + 1}.jpg`);

            // Mostrar loading mientras se valida
            this.isLoading = true;

            try {
                // Validar la imagen antes de agregarla
                await this.validarImagen(file);

                // Si la validación es exitosa, agregar la imagen
                this.imagePreviews.push(photo.dataUrl);
                this.images.push(file);
                this.areImagesValid.push(true);
            } catch (validationError) {
                console.error('Error en la validación:', validationError);
                
                // Si la imagen no es válida, mostrar en rojo sin alert
                this.imagePreviews.push(photo.dataUrl);
                this.images.push(file);
                this.areImagesValid.push(false); // Marcar imagen como no válida
            } finally {
                // Verificar si todas las imágenes son válidas
                this.allImagesValid = this.areImagesValid.every(isValid => isValid);
                this.changeDetector.detectChanges();
            }
        }
    } catch (error) {
        console.error("Error al tomar la foto:", error);
        alert("No se pudo acceder a la cámara o tomar la foto.");
    } finally {
        this.isLoading = false;
        this.changeDetector.detectChanges();
    }
}

private async validarImagen(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('File', file);

  try {
      const data = await firstValueFrom(this.ventaService.validarImagenLibro(formData));
      const tags = data.tags || [];
      const bookTag = tags.find(
          (tag: any) => tag.name === 'book' && tag.confidence >= 0.75
      );

      if (!bookTag) {
          throw new Error('La imagen no parece ser un libro o no tiene suficiente claridad.');
      }
  } catch (error) {
      console.error('Error en la validación de la imagen:', error);
      throw new Error('Error al validar la imagen. Por favor, intenta nuevamente.');
  }
}

  async obtenerIdEstadoPedido() {
    try {
      this.isLoading = true;
      const response = await firstValueFrom(this.ventaService.getEstadoPedido(this.idDetalleVenta));
      this.idEstadoPedido = response.idEstadoPedido; // Ahora esto debería funcionar
      console.log('idEstadoPedido obtenido:', this.idEstadoPedido);
    } catch (error) {
      console.error('Error al obtener idEstadoPedido:', error);
      alert('Error al obtener el estado del pedido.');
    } finally {
      this.isLoading = false;
      this.changeDetector.detectChanges();
    }
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

  async cargarEstadoActual() {
    try {
      if (!this.idVentas) {
        console.error('No se tiene un idVentas válido.');
        return;
      }
  
      this.isLoading = true;
  
      // Obtener la venta con sus detalles y estado
      const data = await firstValueFrom(this.ventaService.getVentaConDetallesYEstado(this.idVentas));
  
      if (data && data.estadoPedido) {
        this.estado = data.estadoPedido.estado || 'Desconocido';
        this.nuevoEstado = this.obtenerSiguienteEstado(this.estado);
      } else {
        console.error('No se encontró el estado del pedido.');
        this.estado = 'Desconocido';
      }
    } catch (error) {
      console.error('Error al cargar estado actual:', error);
      this.estado = 'Error';
    } finally {
      this.isLoading = false;
      this.changeDetector.detectChanges();
    }
  }
  
  
  private formatDateToYYYYMMDD(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;  // Usar formato año-mes-día
  }
  async guardarEvidencia() {
    if (this.images.length === 0) {
        alert('Debes tomar al menos una foto antes de guardar.');
        return;
    }

    if (!this.areImagesValid.every(isValid => isValid)) {
        alert('Algunas imágenes no han sido validadas correctamente. Por favor, verifica las imágenes.');
        return;
    }

    if (!(this.fecha instanceof Date) || isNaN(this.fecha.getTime())) {
        console.error('Fecha no válida:', this.fecha);
        alert('La fecha seleccionada no es válida. Por favor, verifica la entrada.');
        return;
    }

    if (this.idVentas === null) {
        console.error('ID de venta no disponible.');
        alert('El ID de venta no está disponible. Recargue la página.');
        return;
    }

    try {
        this.isLoading = true;
        const formData = new FormData();
        
        // Datos básicos
        formData.append('IdVenta', this.idVentas.toString());
        formData.append('Estado', this.nuevoEstado);
        formData.append('IdDetalleVentas', this.idDetalleVenta.toString());
        formData.append('IdEstadoPedido', this.idEstadoPedido.toString());
        formData.append('FechaEstado', this.fecha.toISOString()); // Enviar fecha en formato ISO
        formData.append('Comentario', this.descripcion);

        // Agregar imágenes validadas
        for (let i = 0; i < this.images.length; i++) {
            formData.append('images', this.images[i]);
        }

        console.log("Contenido del FormData:");
        formData.forEach((value, key) => {
            if (value instanceof File) {
                console.log(key, value.name, value.size);
            } else {
                console.log(key, value);
            }
        });

        const response = await firstValueFrom(
            this.ventaService.actualizarEstadoPedidoConImagenes(this.idVentas, formData)
        );

        console.log('Respuesta del servidor:', response);
        this.router.navigate(['/historial']);
        alert('Se agregó correctamente');
    } catch (error: any) {
        console.error('Error al actualizar:', error);
        let errorMessage = 'Ocurrió un error al actualizar: \n';
        if (error?.error?.errors) {
            Object.entries(error.error.errors).forEach(([key, value]) => {
                errorMessage += `${key}: ${value}\n`;
            });
        } else if (error?.error?.message) {
            errorMessage = error.error.message;
        } else if (error?.message) {
            errorMessage = error.message;
        } else {
            errorMessage = 'Error desconocido. Contacte al administrador.';
        }
        alert(errorMessage);
    } finally {
        this.isLoading = false;
        this.changeDetector.detectChanges();
    }
  }
  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fecha = new Date(input.value);
    if (isNaN(this.fecha.getTime())) {
      alert('La fecha seleccionada no es válida. Por favor, verifica la entrada.');
    }
  }

  // Actualizar el método eliminarImagen para mantener la consistencia
eliminarImagen(index: number) {
  this.imagePreviews.splice(index, 1);
  this.images.splice(index, 1);
  this.areImagesValid.splice(index, 1);
  this.allImagesValid = this.areImagesValid.every(isValid => isValid);
  this.changeDetector.detectChanges();
}

obtenerSiguienteEstado(estadoActual: string): string {
  const estadosOrden = ["En Proceso", "Pedido Aceptado", "Empaquetado", "Dejado en Curier"];
  const indice = estadosOrden.indexOf(estadoActual);
  return indice !== -1 && indice < estadosOrden.length - 1
    ? estadosOrden[indice + 1]
    : estadoActual;
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
