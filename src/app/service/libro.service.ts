// services/Libro.Service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';


@Injectable({
  providedIn: 'root',
})
export class LibroService {
  private apiUrl = 'Libro';


  constructor(private http: HttpClient) {}

    // Obtener libro por id
    getLibroid(idLibro: number) {
      return this.http.get<any>(`${environment.endPoint}${this.apiUrl}/${idLibro}`);
    }

  
}
