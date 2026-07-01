import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cajero-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Panel de caja</h1>
      <p>Gestión de ventas y validación de tickets.</p>
    </section>
  `
})
export class CajeroDashboardPageComponent {}
