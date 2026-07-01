import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cartelera-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Cartelera</h1>
      <p>Aquí se mostrarán todas las películas activas y sus funciones disponibles.</p>
    </section>
  `
})
export class CarteleraPageComponent {}
