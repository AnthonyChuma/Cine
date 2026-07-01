import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cajero-ventas-dia-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Ventas del día</h1>
      <p>Consulta las ventas registradas durante la jornada.</p>
    </section>
  `
})
export class CajeroVentasDiaPageComponent {}
