import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  listPeliculas(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/peliculas`);
  }

  listFunciones(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/funciones`);
  }

  listReportes(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/reportes/dashboard`);
  }
}
