import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-pelicula-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Detalle de película</h1>
      <p>Selecciona una película para ver los detalles y funciones disponibles.</p>
    </section>
  `
})
export class DetallePeliculaPageComponent {}
