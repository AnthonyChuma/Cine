import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Pelicula { id: number; titulo: string; sinopsis: string; duracionMinutos: number; clasificacion: string; imagenUrl: string; estado: string; fechaEstreno: string; generoId: number; }
interface Funcion { id: number; peliculaId: number; salaId: number; fecha: string; horaInicio: string; horaFin: string; precio: number; estado: string; peliculaTitulo?: string; salaNombre?: string; }
interface Genero { id: number; nombre: string; }
interface Sala { id: number; nombre: string; capacidad: number; estado: string; }
interface Stats { peliculas: number; funciones: number; ticketsVendidos: number; recaudacionTotal: number; }
interface Ticket { codigoUnico: string; peliculaTitulo: string; salaNombre: string; asiento: string; total: number; estado: string; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly api = 'http://localhost:8080/api';

  loginData = { correo: 'admin@cinepotosi.com', password: '' };
  mensaje = '';
  vista: 'dashboard' | 'peliculas' | 'funciones' | 'cajero' = 'dashboard';
  peliculas: Pelicula[] = [];
  funciones: Funcion[] = [];
  generos: Genero[] = [];
  salas: Sala[] = [];
  stats: Stats = { peliculas: 0, funciones: 0, ticketsVendidos: 0, recaudacionTotal: 0 };
  ticketValidado?: Ticket;
  codigoValidar = '';

  nuevaPelicula: Pelicula = {
    id: 0, titulo: '', sinopsis: '', duracionMinutos: 90, clasificacion: 'ATP', imagenUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop', estado: 'ACTIVA', fechaEstreno: new Date().toISOString().substring(0, 10), generoId: 1
  };

  nuevaFuncion: Funcion = {
    id: 0, peliculaId: 1, salaId: 1, fecha: new Date().toISOString().substring(0, 10), horaInicio: '18:00', horaFin: '20:00', precio: 30, estado: 'PROGRAMADA'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.autenticado) this.cargarTodo();
  }

  get autenticado(): boolean { return !!localStorage.getItem('cine_admin_token'); }
  get rol(): string { return localStorage.getItem('cine_admin_rol') || ''; }

  login(): void {
    this.http.post<any>(`${this.api}/auth/login`, this.loginData).subscribe({
      next: res => {
        if (res.rol !== 'ADMIN' && res.rol !== 'CAJERO') {
          this.mensaje = 'Este panel solo permite ADMIN o CAJERO.';
          return;
        }
        localStorage.setItem('cine_admin_token', res.token);
        localStorage.setItem('cine_admin_rol', res.rol);
        this.mensaje = 'Sesión iniciada.';
        this.cargarTodo();
      },
      error: () => this.mensaje = 'No se pudo iniciar sesión. Verifica credenciales.'
    });
  }

  cargarTodo(): void {
    this.cargarPeliculas();
    this.cargarFunciones();
    this.cargarGeneros();
    this.cargarSalas();
    this.http.get<Stats>(`${this.api}/admin/reportes/dashboard`, { headers: this.authHeaders() }).subscribe({ next: data => this.stats = data, error: () => {} });
  }

  cargarPeliculas(): void { this.http.get<Pelicula[]>(`${this.api}/admin/peliculas`, { headers: this.authHeaders() }).subscribe({ next: d => this.peliculas = d, error: () => this.mensaje = 'No se pudieron cargar películas.' }); }
  cargarFunciones(): void { this.http.get<Funcion[]>(`${this.api}/admin/funciones`, { headers: this.authHeaders() }).subscribe({ next: d => this.funciones = d, error: () => this.mensaje = 'No se pudieron cargar funciones.' }); }
  cargarGeneros(): void { this.http.get<Genero[]>(`${this.api}/admin/generos`, { headers: this.authHeaders() }).subscribe({ next: d => { this.generos = d; if (d[0]) this.nuevaPelicula.generoId = d[0].id; }, error: () => {} }); }
  cargarSalas(): void { this.http.get<Sala[]>(`${this.api}/admin/salas`, { headers: this.authHeaders() }).subscribe({ next: d => { this.salas = d; if (d[0]) this.nuevaFuncion.salaId = d[0].id; }, error: () => {} }); }

  crearPelicula(): void {
    this.http.post<Pelicula>(`${this.api}/admin/peliculas`, this.nuevaPelicula, { headers: this.authHeaders() }).subscribe({
      next: () => { this.mensaje = 'Película creada.'; this.cargarPeliculas(); this.cargarTodo(); },
      error: err => this.mensaje = err?.error?.message || 'No se pudo crear la película.'
    });
  }

  crearFuncion(): void {
    this.http.post<Funcion>(`${this.api}/admin/funciones`, this.nuevaFuncion, { headers: this.authHeaders() }).subscribe({
      next: () => { this.mensaje = 'Función creada.'; this.cargarFunciones(); this.cargarTodo(); },
      error: err => this.mensaje = err?.error?.message || 'No se pudo crear la función.'
    });
  }

  validarTicket(): void {
    if (!this.codigoValidar.trim()) return;
    this.http.get<Ticket>(`${this.api}/cajero/validar-ticket/${this.codigoValidar.trim()}`, { headers: this.authHeaders() }).subscribe({
      next: data => { this.ticketValidado = data; this.mensaje = 'Ticket encontrado.'; },
      error: () => { this.ticketValidado = undefined; this.mensaje = 'Ticket no encontrado.'; }
    });
  }

  cerrarSesion(): void {
    localStorage.removeItem('cine_admin_token');
    localStorage.removeItem('cine_admin_rol');
    this.mensaje = 'Sesión cerrada.';
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('cine_admin_token') || ''}` });
  }
}
