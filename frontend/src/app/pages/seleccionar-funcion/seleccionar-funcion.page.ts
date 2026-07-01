import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seleccionar-funcion-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Seleccionar función</h1>
      <p>Selecciona la función deseada para continuar con la compra.</p>
    </section>
  `
})
export class SeleccionarFuncionPageComponent {}
