import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaService } from '../../../service/venta.service';
import { DetalleVenta } from '../../../models/detalle_venta';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.css'],
})
export class DetalleVentaComponent implements OnInit {
  idVenta!: number;
  detallesVenta: DetalleVenta[] = [];

  constructor(
    private route: ActivatedRoute,
    private ventaService: VentaService,
    private router: Router
  ) {}

  ngOnInit() {
    const idVentaParam = this.route.snapshot.paramMap.get('id');
    if (idVentaParam && !isNaN(+idVentaParam)) {
      this.idVenta = +idVentaParam;
      this.cargarDetalleVenta();
    } else {
      console.error('ID de venta inválido o no encontrado. Redirigiendo...');
      this.router.navigate(['/historial']);
    }
  }
  
  cargarDetalleVenta() {
    this.ventaService.getVentaDetalles(this.idVenta).subscribe({
      next: (data) => {
        this.detallesVenta = data;
      },
      error: (error) => console.error('Error al cargar detalles:', error),
    });
  }

  agregarEvidencia() {
    if (this.detallesVenta.length > 0) {
      const primerIdDetalleVenta = this.detallesVenta[0].idDetalleVentas; 
      this.router.navigate(['/registro', primerIdDetalleVenta]);
    } else {
      console.warn('No hay detalles de venta disponibles.');
    }
  }
}
