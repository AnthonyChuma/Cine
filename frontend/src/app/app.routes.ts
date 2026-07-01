import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.page';
import { CarteleraPageComponent } from './pages/cartelera/cartelera.page';
import { DetallePeliculaPageComponent } from './pages/detalle-pelicula/detalle-pelicula.page';
import { LoginPageComponent } from './pages/login/login.page';
import { RegistroPageComponent } from './pages/registro/registro.page';
import { MisTicketsPageComponent } from './pages/mis-tickets/mis-tickets.page';
import { CheckoutPageComponent } from './pages/checkout/checkout.page';
import { AdminDashboardPageComponent } from './pages/admin-dashboard/admin-dashboard.page';
import { AdminPeliculasPageComponent } from './pages/admin-peliculas/admin-peliculas.page';
import { AdminFuncionesPageComponent } from './pages/admin-funciones/admin-funciones.page';
import { AdminUsuariosPageComponent } from './pages/admin-usuarios/admin-usuarios.page';
import { AdminReportesPageComponent } from './pages/admin-reportes/admin-reportes.page';
import { AdminGenerosPageComponent } from './pages/admin-generos/admin-generos.page';
import { AdminSalasPageComponent } from './pages/admin-salas/admin-salas.page';
import { AdminAsientosPageComponent } from './pages/admin-asientos/admin-asientos.page';
import { CajeroDashboardPageComponent } from './pages/cajero-dashboard/cajero-dashboard.page';
import { CajeroVentaPageComponent } from './pages/cajero-venta/cajero-venta.page';
import { CajeroValidarTicketPageComponent } from './pages/cajero-validar-ticket/cajero-validar-ticket.page';
import { CajeroVentasDiaPageComponent } from './pages/cajero-ventas-dia/cajero-ventas-dia.page';
import { PerfilPageComponent } from './pages/perfil/perfil.page';
import { SeleccionarFuncionPageComponent } from './pages/seleccionar-funcion/seleccionar-funcion.page';
import { SeleccionarAsientosPageComponent } from './pages/seleccionar-asientos/seleccionar-asientos.page';
import { NoAutorizadoPageComponent } from './pages/no-autorizado/no-autorizado.page';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { ClienteLayoutComponent } from './layouts/cliente-layout/cliente-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { CajeroLayoutComponent } from './layouts/cajero-layout/cajero-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { PublicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'cartelera', component: CarteleraPageComponent },
      { path: 'pelicula/:id', component: DetallePeliculaPageComponent },
      { path: 'login', component: LoginPageComponent, canActivate: [PublicGuard] },
      { path: 'registro', component: RegistroPageComponent, canActivate: [PublicGuard] },
      { path: 'no-autorizado', component: NoAutorizadoPageComponent }
    ]
  },
  {
    path: '',
    component: ClienteLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'mis-tickets', component: MisTicketsPageComponent, canActivate: [RoleGuard], data: { roles: ['CLIENTE'] } },
      { path: 'checkout', component: CheckoutPageComponent, canActivate: [RoleGuard], data: { roles: ['CLIENTE'] } },
      { path: 'perfil', component: PerfilPageComponent, canActivate: [RoleGuard], data: { roles: ['CLIENTE', 'ADMIN', 'CAJERO'] } },
      { path: 'seleccionar-funcion/:id', component: SeleccionarFuncionPageComponent, canActivate: [RoleGuard], data: { roles: ['CLIENTE'] } },
      { path: 'seleccionar-asientos/:id', component: SeleccionarAsientosPageComponent, canActivate: [RoleGuard], data: { roles: ['CLIENTE'] } }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', component: AdminDashboardPageComponent },
      { path: 'peliculas', component: AdminPeliculasPageComponent },
      { path: 'generos', component: AdminGenerosPageComponent },
      { path: 'salas', component: AdminSalasPageComponent },
      { path: 'asientos', component: AdminAsientosPageComponent },
      { path: 'funciones', component: AdminFuncionesPageComponent },
      { path: 'usuarios', component: AdminUsuariosPageComponent },
      { path: 'reportes', component: AdminReportesPageComponent }
    ]
  },
  {
    path: 'caja',
    component: CajeroLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CAJERO', 'ADMIN'] },
    children: [
      { path: '', component: CajeroDashboardPageComponent },
      { path: 'venta', component: CajeroVentaPageComponent },
      { path: 'validar-ticket', component: CajeroValidarTicketPageComponent },
      { path: 'ventas-dia', component: CajeroVentasDiaPageComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
