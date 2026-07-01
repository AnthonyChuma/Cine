export interface AuthResponse {
  token: string;
  tipo: string;
  rol: 'CLIENTE' | 'CAJERO' | 'ADMIN';
  correo: string;
}

export interface UserProfile {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'CLIENTE' | 'CAJERO' | 'ADMIN';
  estado: string;
  fechaCreacion: string;
}
