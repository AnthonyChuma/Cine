import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-peliculas-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Películas</h1>
      <p>Administración de películas activas y contenidos.</p>
    </section>
  `
})
export class AdminPeliculasPageComponent {}
