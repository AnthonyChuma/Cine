import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ticket } from '../../shared/models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(private http: HttpClient) {}

  getMyTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${environment.apiUrl}/cliente/mis-tickets`);
  }

  purchase(body: { funcionId: number; asientoId: number; metodoPago: string }): Observable<Ticket> {
    return this.http.post<Ticket>(`${environment.apiUrl}/cliente/comprar-ticket`, body);
  }
}
