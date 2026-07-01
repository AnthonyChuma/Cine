import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-registro-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="auth-page">
      <h1>Crear cuenta</h1>
      <form (ngSubmit)="onRegister()">
        <label>
          Nombre
          <input type="text" [(ngModel)]="user.nombre" name="nombre" required />
        </label>
        <label>
          Apellido
          <input type="text" [(ngModel)]="user.apellido" name="apellido" required />
        </label>
        <label>
          Correo
          <input type="email" [(ngModel)]="user.correo" name="correo" required />
        </label>
        <label>
          Contraseña
          <input type="password" [(ngModel)]="user.password" name="password" required />
        </label>
        <button type="submit" class="btn primary">Registrarse</button>
      </form>
      <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
    </section>
  `
})
export class RegistroPageComponent {
  user = { nombre: '', apellido: '', correo: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService) {}

  onRegister(): void {
    this.errorMessage = '';
    this.authService.register(this.user).subscribe({
      next: () => {},
      error: (err) => {
        this.errorMessage = err?.error?.message || 'No se pudo registrar el usuario.';
      }
    });
  }
}
