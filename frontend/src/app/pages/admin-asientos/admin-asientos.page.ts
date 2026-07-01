import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-asientos-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Asientos</h1>
      <p>Revisa y administra el estado de los asientos.</p>
    </section>
  `
})
export class AdminAsientosPageComponent {}
