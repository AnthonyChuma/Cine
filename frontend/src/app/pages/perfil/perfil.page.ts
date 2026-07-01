import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Perfil</h1>
      <p>Próximamente encontrarás los detalles de tu perfil y tus datos personales.</p>
    </section>
  `
})
export class PerfilPageComponent {}
