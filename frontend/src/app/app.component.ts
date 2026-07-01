import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Pelicula {
  id: number;
  titulo: string;
  sinopsis: string;
  duracionMinutos: number;
  clasificacion: string;
  imagenUrl: string;
  trailerUrl?: string;
  estado: string;
  fechaEstreno: string;
  generoId: number;
  generoNombre: string;
}

interface Funcion {
  id: number;
  peliculaId: number;
  peliculaTitulo: string;
  salaId: number;
  salaNombre: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  precio: number;
  estado: string;
}

interface Asiento {
  id: number;
  fila: string;
  numero: number;
  estado: string;
  ocupado: boolean;
  disponible: boolean;
}

interface Ticket {
  id: number;
  codigoUnico: string;
  peliculaTitulo: string;
  salaNombre: string;
  asiento: string;
  estado: string;
  fechaFuncion: string;
  horaInicio: string;
  total: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly api = 'http://localhost:8080/api';

  peliculas: Pelicula[] = [];
  funciones: Funcion[] = [];
  asientos: Asiento[] = [];
  misTickets: Ticket[] = [];
  peliculaSeleccionada?: Pelicula;
  funcionSeleccionada?: Funcion;
  asientoSeleccionado?: Asiento;
  ticketGenerado?: Ticket;
  filtro = '';
  mensaje = '';
  cargando = false;
  vista: 'home' | 'detalle' | 'asientos' | 'login' | 'registro' | 'tickets' = 'home';

  loginData = { correo: '', password: '' };
  registroData = { nombre: '', apellido: '', correo: '', password: '' };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarPeliculas();
  }

  get autenticado(): boolean {
    return !!localStorage.getItem('cine_token');
  }

  get peliculasFiltradas(): Pelicula[] {
    const q = this.filtro.trim().toLowerCase();
    if (!q) return this.peliculas;
    return this.peliculas.filter(p =>
      p.titulo.toLowerCase().includes(q) ||
      (p.generoNombre || '').toLowerCase().includes(q) ||
      (p.clasificacion || '').toLowerCase().includes(q)
    );
  }

  cargarPeliculas(): void {
    this.cargando = true;
    this.http.get<Pelicula[]>(`${this.api}/public/peliculas`).subscribe({
      next: data => { this.peliculas = data; this.cargando = false; },
      error: () => { this.mensaje = 'No se pudo cargar la cartelera. Verifica que el backend esté activo.'; this.cargando = false; }
    });
  }

  verDetalle(pelicula: Pelicula): void {
    this.peliculaSeleccionada = pelicula;
    this.funcionSeleccionada = undefined;
    this.asientoSeleccionado = undefined;
    this.ticketGenerado = undefined;
    this.vista = 'detalle';
    this.http.get<Funcion[]>(`${this.api}/public/peliculas/${pelicula.id}/funciones`).subscribe({
      next: data => this.funciones = data,
      error: () => this.mensaje = 'No se pudieron cargar las funciones.'
    });
  }

  elegirFuncion(funcion: Funcion): void {
    this.funcionSeleccionada = funcion;
    this.asientoSeleccionado = undefined;
    this.ticketGenerado = undefined;
    this.vista = 'asientos';
    this.http.get<Asiento[]>(`${this.api}/public/funciones/${funcion.id}/asientos`).subscribe({
      next: data => this.asientos = data,
      error: () => this.mensaje = 'No se pudieron cargar los asientos.'
    });
  }

  seleccionarAsiento(asiento: Asiento): void {
    if (!asiento.disponible) return;
    this.asientoSeleccionado = asiento;
  }

  comprar(): void {
    if (!this.autenticado) {
      this.mensaje = 'Primero inicia sesión o regístrate para comprar el ticket.';
      this.vista = 'login';
      return;
    }
    if (!this.funcionSeleccionada || !this.asientoSeleccionado) {
      this.mensaje = 'Selecciona una función y un asiento.';
      return;
    }
    const body = { funcionId: this.funcionSeleccionada.id, asientoId: this.asientoSeleccionado.id, metodoPago: 'EFECTIVO' };
    this.http.post<Ticket>(`${this.api}/cliente/comprar-ticket`, body, { headers: this.authHeaders() }).subscribe({
      next: ticket => {
        this.ticketGenerado = ticket;
        this.mensaje = 'Compra realizada correctamente.';
        this.http.get<Asiento[]>(`${this.api}/public/funciones/${this.funcionSeleccionada!.id}/asientos`).subscribe(data => this.asientos = data);
      },
      error: err => this.mensaje = err?.error?.message || 'No se pudo realizar la compra.'
    });
  }

  login(): void {
    this.http.post<any>(`${this.api}/auth/login`, this.loginData).subscribe({
      next: res => {
        localStorage.setItem('cine_token', res.token);
        localStorage.setItem('cine_rol', res.rol);
        this.mensaje = 'Sesión iniciada correctamente.';
        this.vista = 'home';
      },
      error: () => this.mensaje = 'Correo o contraseña incorrectos.'
    });
  }

  registrar(): void {
    this.http.post<any>(`${this.api}/auth/register`, this.registroData).subscribe({
      next: res => {
        localStorage.setItem('cine_token', res.token);
        localStorage.setItem('cine_rol', res.rol);
        this.mensaje = 'Registro completado correctamente.';
        this.vista = 'home';
      },
      error: err => this.mensaje = err?.error?.message || 'No se pudo registrar el usuario.'
    });
  }

  cargarMisTickets(): void {
    if (!this.autenticado) { this.vista = 'login'; return; }
    this.vista = 'tickets';
    this.http.get<Ticket[]>(`${this.api}/cliente/mis-tickets`, { headers: this.authHeaders() }).subscribe({
      next: data => this.misTickets = data,
      error: () => this.mensaje = 'No se pudieron cargar tus tickets.'
    });
  }

  cerrarSesion(): void {
    localStorage.removeItem('cine_token');
    localStorage.removeItem('cine_rol');
    this.vista = 'home';
    this.mensaje = 'Sesión cerrada.';
  }

  volverInicio(): void {
    this.vista = 'home';
    this.peliculaSeleccionada = undefined;
    this.funcionSeleccionada = undefined;
    this.asientoSeleccionado = undefined;
    this.ticketGenerado = undefined;
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('cine_token') || ''}` });
  }
}
