import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="home-hero">
      <h1>Cine Hispano Potosí</h1>
      <p>Compra tus tickets en línea y consulta la cartelera actual.</p>
      <div class="home-actions">
        <a routerLink="/cartelera" class="btn primary">Ver cartelera</a>
        <a routerLink="/login" class="btn secondary">Ingresar</a>
      </div>
    </section>
  `
})
export class HomePageComponent {}
