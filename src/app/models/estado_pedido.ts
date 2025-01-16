import { EstadoPedidoImagene } from "./estado_pedido_imagene";

export interface EstadoPedido {
    idEstadoPedido: number;
    estado:string;
    fechaEstado: Date;
    estadoPedidoImagene?: EstadoPedidoImagene[]
  }

  