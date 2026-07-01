import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-section">
      <h1>Checkout</h1>
      <p>Completa la compra de tu ticket desde aquí.</p>
    </section>
  `
})
export class CheckoutPageComponent {}
