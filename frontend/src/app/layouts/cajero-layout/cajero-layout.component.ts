import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cajero-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cajero-layout.component.html'
})
export class CajeroLayoutComponent {
  constructor(public authService: AuthService) {}
}
