import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-no-autorizado-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="page-section">
      <h1>No autorizado</h1>
      <p>No tienes permiso para acceder a esta página.</p>
      <a routerLink="/login" class="btn primary">Ir a login</a>
    </section>
  `
})
export class NoAutorizadoPageComponent {}
