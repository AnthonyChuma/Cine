import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cajero-venta-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Venta</h1>
      <p>Realiza ventas rápidamente desde este módulo para cajeros.</p>
    </section>
  `
})
export class CajeroVentaPageComponent {}
