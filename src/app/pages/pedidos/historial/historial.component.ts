import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../../service/venta.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
})
export class HistorialComponent implements OnInit {
  ventas: any[] = [];
  estado: string | null = null;
  fechaInicio: string = '';
  fechaFin: string = '';
  page = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  estadosOrden = ["En Proceso", "Pedido Aceptado", "Empaquetado", "Dejado en Curier"];

  constructor(private ventaService: VentaService, private router: Router) {}

  ngOnInit() {
    this.cargarVentas();
  }

  verDetalle(idVentas: number) {
    this.router.navigate(['/detalle-venta', idVentas]);
  }

  cargarVentas() {
    this.ventaService.getVentas(this.page, this.pageSize, this.estado, true, this.fechaInicio, this.fechaFin).subscribe({
      next: (res) => {
        this.totalItems = res.totalItems;
        this.totalPages = Math.ceil(res.totalItems / this.pageSize);
        this.ventas = res.ventas.map((venta) => ({
          ...venta,
          detalles: [], // Inicializamos los detalles
          estadoPedido: 'Cargando...'
        }));

        const requests = this.ventas.map(venta =>
          this.ventaService.getVentaConDetallesYEstado(venta.idVentas)
        );

        forkJoin(requests).subscribe({
          next: (detalles) => {
            detalles.forEach((detalleData, index) => {
              this.ventas[index].detalle_venta = detalleData.detalles;
              this.ventas[index].estadoPedido = detalleData.estadoPedido?.estado || 'Sin Estado';
            });
          },
          error: (error) => {
            console.error('Error al obtener detalles:', error);
            this.ventas.forEach(venta => {
              venta.estadoPedido = 'Sin Estado';
            });
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar ventas:', error);
      },
    });
  }

  aplicarFiltros() {
    this.page = 1; 
    this.cargarVentas();
  }

  cambiarPagina(direccion: 'anterior' | 'siguiente') {
    if (direccion === 'anterior' && this.page > 1) {
      this.page--;
    } else if (direccion === 'siguiente' && this.page < this.totalPages) {
      this.page++;
    }
    this.cargarVentas(); // Volvemos a cargar las ventas con la nueva página
  }
}
