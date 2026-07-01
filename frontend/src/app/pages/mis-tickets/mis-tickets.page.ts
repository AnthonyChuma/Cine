import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-tickets-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Mis tickets</h1>
      <p>Accede a tus compras recientes desde esta pantalla.</p>
    </section>
  `
})
export class MisTicketsPageComponent {}
