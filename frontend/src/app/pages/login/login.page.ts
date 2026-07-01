import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="auth-page">
      <h1>Iniciar sesión</h1>
      <form (ngSubmit)="onSubmit()">
        <label>
          Correo
          <input type="email" [(ngModel)]="credentials.correo" name="correo" required />
        </label>
        <label>
          Contraseña
          <input type="password" [(ngModel)]="credentials.password" name="password" required />
        </label>
        <button type="submit" class="btn primary">Ingresar</button>
      </form>
      <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
    </section>
  `
})
export class LoginPageComponent {
  credentials = { correo: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe({
      next: () => {},
      error: () => {
        this.errorMessage = 'Correo o contraseña incorrectos.';
      }
    });
  }
}
