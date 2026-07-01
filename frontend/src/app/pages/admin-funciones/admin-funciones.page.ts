import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-funciones-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Funciones</h1>
      <p>Administra las funciones y horarios del cine.</p>
    </section>
  `
})
export class AdminFuncionesPageComponent {}
