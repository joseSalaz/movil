// services/venta.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { VentaResponse } from '../models/ventaResponse';
import { DetalleVenta } from '../models/detalle_venta';
import { environment } from '../environment/environment';
import { EstadoPedido } from '../models/estado_pedido';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private apiUrl = 'https://api20250116150338.azurewebsites.net/';


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
    getVentaDetallesid(idDetalleVenta: number) {
      return this.http.get<any>(`${environment.endPoint}DetalleVenta/${idDetalleVenta}`);
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

  crearEstadoPedidoImagen(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}api/EstadoPedidoImagene/create-with-images`, formData);
  }

  // Nuevo método para enviar un array de imágenes
  async crearEstadoPedidoImagenMultiples(idEstadoPedido: number, imagenes: File[]): Promise<any> {
    const formData = new FormData();
    formData.append('IdEstadoPedido', idEstadoPedido.toString());
    formData.append('Estado', ''); // O agrega el estado deseado
    formData.append('Fecha', new Date().toISOString());

    for (const imagen of imagenes) {
      formData.append('images', imagen);
    }

    return await this.http.post(`${this.apiUrl}api/EstadoPedidoImagene/create-with-images`, formData).toPromise();
  }

  // Actualizar estado del pedido
  actualizarEstadoPedidoConImagenes(id: number, formData: FormData): Observable<string> {
    debugger
    return this.http.put<string>(`${this.apiUrl}DetalleVenta/UpdateEstadoPedidos/${id}`, formData, { responseType: 'text' as 'json' });
  }
  
  validarImagenLibro(formData: FormData) {
    return this.http.post<any>(
      `${this.apiUrl}Libro/detalles-imagen`, 
      formData
    );
  }
  
  getEstadoPedido(idDetalleVenta: number): Observable<EstadoPedido> {
    return this.http.get<EstadoPedido>(`${this.apiUrl}DetalleVenta/GetEstadoPedido/${idDetalleVenta}`);
  }
  getEstadoPedidoByVenta(idVenta: number): Observable<EstadoPedido[]> {
    return this.http.get<EstadoPedido[]>(`${this.apiUrl}DetalleVenta/GetEstadoPedido/${idVenta}`);
  }  
  getVentaConDetallesYEstado(idVenta: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Venta/GetVentaConDetallesYEstado/${idVenta}`);
  }
}
