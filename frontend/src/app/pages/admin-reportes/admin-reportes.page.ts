import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-reportes-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Reportes</h1>
      <p>Visualiza los reportes del cine y las métricas de venta.</p>
    </section>
  `
})
export class AdminReportesPageComponent {}
