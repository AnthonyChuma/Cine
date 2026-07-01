import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-generos-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Géneros</h1>
      <p>Gestiona los géneros disponibles en el sistema.</p>
    </section>
  `
})
export class AdminGenerosPageComponent {}
