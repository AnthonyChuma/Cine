export interface Pelicula {
  id: number;
  titulo: string;
  sinopsis: string;
  duracionMinutos: number;
  clasificacion: string;
  imagenUrl: string;
  trailerUrl?: string;
  estado: string;
  fechaEstreno: string;
  generoId: number;
  generoNombre?: string;
}
