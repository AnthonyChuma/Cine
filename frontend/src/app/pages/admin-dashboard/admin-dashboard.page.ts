import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Panel de administración</h1>
      <p>Accede a métricas, gestión de películas y funciones.</p>
    </section>
  `
})
export class AdminDashboardPageComponent {}
