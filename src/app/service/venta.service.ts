// services/venta.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VentaResponse } from '../models/ventaResponse';
import { DetalleVenta } from '../models/detalle_venta';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private apiUrl = 'https://api20241209222530.azurewebsites.net/';

  constructor(private http: HttpClient) {}

  // Obtener ventas paginadas
  getVentas(page: number, pageSize: number, ordenarPorFechaDesc = true): Observable<VentaResponse> {
    return this.http.get<VentaResponse>(`${this.apiUrl}Venta/Paginator`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString(),
        ordenarPorFechaDesc: ordenarPorFechaDesc.toString(),
      },
    });
  }

  // Obtener detalles de una venta
  getVentaDetalles(idVenta: number) {
    return this.http.get<any>(`${environment.endPoint}DetalleVenta/GetByVenta/${idVenta}`);
  }

  // Actualizar detalles de una venta
  actualizarDetalleVenta(data: any) {
    return this.http.put(`${this.apiUrl}venta/detalle-venta/${data.idDetalleVenta}`, data);
  }

  // Obtener detalle de pedido por ID
  getDetalleById(idDetalleVenta: number) {
    return this.http.get<any>(`${this.apiUrl}api/EstadoPedido/${idDetalleVenta}`);
  }

  // Crear estado del pedido con imágenes (nueva URL)
  crearEstadoPedidoImagen(formData: FormData) {
    return this.http.post(`${this.apiUrl}api/EstadoPedidoImagene/create-with-images`, formData);
  }

  // Actualizar estado del pedido
  actualizarEstadoPedido(idVenta: number, formData: FormData) {
    return this.http.put(`${this.apiUrl}DetalleVenta/UpdateEstadoPedidos/${idVenta}`, formData);
  }
}
