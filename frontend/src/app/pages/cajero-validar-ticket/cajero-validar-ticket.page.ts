import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cajero-validar-ticket-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Validar ticket</h1>
      <p>Ingresa el código de ticket para validar su estado.</p>
    </section>
  `
})
export class CajeroValidarTicketPageComponent {}
