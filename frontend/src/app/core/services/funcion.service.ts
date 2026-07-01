import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Funcion } from '../../shared/models/funcion.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionService {
  constructor(private http: HttpClient) {}

  listPublicas(): Observable<Funcion[]> {
    return this.http.get<Funcion[]>(`${environment.apiUrl}/public/funciones`);
  }

  listByPelicula(peliculaId: number): Observable<Funcion[]> {
    return this.http.get<Funcion[]>(`${environment.apiUrl}/public/peliculas/${peliculaId}/funciones`);
  }
}
