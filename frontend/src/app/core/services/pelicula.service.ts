import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pelicula } from '../../shared/models/pelicula.model';

@Injectable({
  providedIn: 'root'
})
export class PeliculaService {
  constructor(private http: HttpClient) {}

  listPublicas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(`${environment.apiUrl}/public/peliculas`);
  }

  getDetalle(id: number): Observable<Pelicula> {
    return this.http.get<Pelicula>(`${environment.apiUrl}/public/peliculas/${id}`);
  }
}
