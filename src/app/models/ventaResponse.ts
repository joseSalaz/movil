import { Venta } from "./venta";

export interface VentaResponse {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    ventas: Venta[];
  }