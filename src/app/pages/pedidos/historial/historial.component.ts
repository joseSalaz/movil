import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../../service/venta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
})
export class HistorialComponent implements OnInit {
  ventas: any[] = [];
  page = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  constructor(private ventaService: VentaService, private router: Router) {}

  ngOnInit() {
    this.cargarVentas();
  }
  verDetalle(idVentas: number) {
    this.router.navigate(['/detalle-venta', idVentas]);
  }

  cargarVentas() {
    this.ventaService.getVentas(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.totalItems = res.totalItems;
        this.totalPages = Math.ceil(res.totalItems / this.pageSize);
        this.ventas = res.ventas.map((venta) => ({
          ...venta,
          detalles: [], // Inicializamos los detalles
          estadoPedido: 'Cargando...' 
        }));
        // Ahora obtenemos los detalles y el estado en una sola llamada
        this.ventas.forEach((venta) => {
          this.ventaService.getVentaConDetallesYEstado(venta.idVentas).subscribe({
            next: (detalleData) => {
              // Asignamos los detalles y el estado correcto
              venta.detalle_venta = detalleData.detalles;
              venta.estadoPedido = detalleData.estadoPedido?.estado || 'Sin Estado';
            },
            error: (error) => {
              console.error(`Error obteniendo detalles para venta ${venta.idVentas}:`, error);
              venta.estadoPedido = 'Sin Estado';
            },
          });
        });
      },
      error: (error) => {
        console.error('Error al cargar ventas:', error);
      },
    });
  }
}
