import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-usuarios-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Usuarios</h1>
      <p>Gestiona los usuarios del sistema.</p>
    </section>
  `
})
export class AdminUsuariosPageComponent {}
