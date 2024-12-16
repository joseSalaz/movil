// historial.component.ts
import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../../service/venta.service';
import { Venta } from '../../../models/venta';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
})
export class HistorialComponent implements OnInit {
  ventas: Venta[] = [];
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
        this.ventas = res.ventas;         
        this.totalItems = res.totalItems; 
        this.totalPages = res.totalPages; 
      },
      error: (error) => {
        console.error('Error al cargar ventas:', error);
      },
    });
  }
}
