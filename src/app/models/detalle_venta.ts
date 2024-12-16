import { EstadoPedido } from "./estado_pedido";

export interface DetalleVenta {
    idDetalleVentas:number;
    nombreProducto: string;
    precioUnit:number;
    cantidad:number;
    estado?: string;
    detallePedido?:EstadoPedido[];
  }