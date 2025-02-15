import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaService } from '../../../service/venta.service';
import { LibroService } from '../../../service/libro.service';
import { DetalleVenta } from '../../../models/detalle_venta';
import { Libro } from '../../../models/libro';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.css'],
})
export class DetalleVentaComponent implements OnInit {
  idVenta!: number;
  detallesVentaConLibro: { detalle: DetalleVenta; libro?: Libro }[] = [];
  loading: boolean = true;
  venta: any = null;
  constructor(
    private route: ActivatedRoute,
    private ventaService: VentaService,
    private libroService: LibroService,
    private router: Router
  ) {}

  ngOnInit() {
    const idVentaParam = this.route.snapshot.paramMap.get('id');
    if (idVentaParam && !isNaN(+idVentaParam)) {
      this.idVenta = +idVentaParam;
      this.cargarDetalleVenta();
      this.cargarVentaInfo();
    } else {
      console.error('ID de venta inválido o no encontrado. Redirigiendo...');
      this.router.navigate(['/historial']);
    }
  }
  cargarVentaInfo() {
    this.ventaService.getVentaInfo(this.idVenta).subscribe({
      next: (data) => {
        this.venta = data;
      },
      error: (error) => {
        console.error('Error al cargar la información de la venta:', error);
      },
    });
  }
  cargarDetalleVenta() {
    this.ventaService.getVentaDetalles(this.idVenta).subscribe({
      next: (data) => {
        this.detallesVentaConLibro = data.map((detalle:any) => ({ detalle })); // Inicializamos con los detalles
        this.cargarLibros();
      },
      error: (error) => {
        console.error('Error al cargar detalles:', error);
        this.loading = false;
      },
    });
  }

  cargarLibros() {
    const solicitudes = this.detallesVentaConLibro.map((detalleConLibro) =>
      this.libroService.getLibroid(detalleConLibro.detalle.idLibro).subscribe({
        next: (libro) => {
          detalleConLibro.libro = libro; // Asignamos el libro al detalle
        },
        error: (error) => {
          console.error(`Error al cargar el libro con ID ${detalleConLibro.detalle.idLibro}:`, error);
        },
      })
    );

    Promise.all(solicitudes).finally(() => {
      this.loading = false; // Marcamos la carga como completa
    });
  }

  agregarEvidencia() {
    if (this.detallesVentaConLibro.length > 0) {
      const primerIdDetalleVenta = this.detallesVentaConLibro[0].detalle.idDetalleVentas;
      this.router.navigate(['/registro', primerIdDetalleVenta]);
    } else {
      console.warn('No hay detalles de venta disponibles.');
    }
  }
}
