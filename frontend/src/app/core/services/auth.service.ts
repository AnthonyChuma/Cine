import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, UserProfile } from '../../shared/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'cine_token';
  private readonly roleKey = 'cine_rol';
  private readonly profileKey = 'cine_user';
  currentUser = new BehaviorSubject<UserProfile | null>(this.loadProfile());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { correo: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        this.storeSession(response);
        this.redirectAfterLogin(response.rol);
      })
    );
  }

  register(payload: { nombre: string; apellido: string; correo: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload).pipe(
      tap((response) => {
        this.storeSession(response);
        this.redirectAfterLogin(response.rol);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.profileKey);
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): 'CLIENTE' | 'CAJERO' | 'ADMIN' | null {
    return localStorage.getItem(this.roleKey) as 'CLIENTE' | 'CAJERO' | 'ADMIN' | null;
  }

  hasRole(roles: Array<'CLIENTE' | 'CAJERO' | 'ADMIN'>): boolean {
    const role = this.getRole();
    return !!role && roles.includes(role);
  }

  private storeSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.roleKey, response.rol);
    localStorage.setItem(this.profileKey, JSON.stringify({ correo: response.correo, rol: response.rol }));
    this.currentUser.next({ correo: response.correo, rol: response.rol, id: 0, nombre: '', apellido: '', estado: '', fechaCreacion: '' });
  }

  private loadProfile(): UserProfile | null {
    const raw = localStorage.getItem(this.profileKey);
    return raw ? JSON.parse(raw) as UserProfile : null;
  }

  redirectAfterLogin(rol: 'CLIENTE' | 'CAJERO' | 'ADMIN'): void {
    if (rol === 'ADMIN') {
      this.router.navigate(['/admin']);
      return;
    }

    if (rol === 'CAJERO') {
      this.router.navigate(['/caja']);
      return;
    }

    this.router.navigate(['/cartelera']);
  }
}
