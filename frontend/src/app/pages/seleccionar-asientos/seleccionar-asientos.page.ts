import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seleccionar-asientos-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Seleccionar asientos</h1>
      <p>Selecciona tus asientos preferidos para la función.</p>
    </section>
  `
})
export class SeleccionarAsientosPageComponent {}
