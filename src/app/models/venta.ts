import { DetalleVenta } from "./detalle_venta";

export interface Venta {
    idVentas: number;
    TotalPrecio:number;
    fechaVenta:Date;
    detalle_venta?:DetalleVenta[];
    nroComprobante: string;
    estadoPedido?: string;
  }