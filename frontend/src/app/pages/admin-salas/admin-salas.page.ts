import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-salas-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Salas</h1>
      <p>Gestiona las salas y su configuración.</p>
    </section>
  `
})
export class AdminSalasPageComponent {}
