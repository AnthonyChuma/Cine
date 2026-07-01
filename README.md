# Cine Hispano - Sistema Web de Venta de Tickets

Aplicación web unificada para la venta de tickets del **Cine Hispano de la ciudad de Potosí**.

El proyecto ahora está en una sola aplicación **Node.js + Express + EJS + PostgreSQL**, lista para ejecución local y despliegue en Railway.

## Estructura

```text
Cine/
├── controllers/
├── middleware/
├── models/
├── public/
│   ├── css/
│   └── js/
├── routes/
├── views/
├── .env.example
├── .gitignore
├── package.json
├── railway.toml
├── README.md
└── server.js
```

## Requisitos

- Node.js 20 o superior
- npm
- PostgreSQL en Railway

## Instalación local

```bash
npm install
```

Crea un archivo `.env` basado en `.env.example`:

```env
PORT=8080
NODE_ENV=development
DATABASE_URL=postgresql://postgres:TU_PASSWORD@reseau.proxy.rlwy.net:53406/railway
JWT_SECRET=clave_segura_larga_cine_hispano_2026
```

Luego ejecuta:

```bash
npm run dev
```

Abrir:

```text
http://localhost:8080/
http://localhost:8080/cartelera
http://localhost:8080/login
http://localhost:8080/api/public/peliculas
```

## Variables en Railway

En el servicio donde despliegas la página, agrega:

```env
NODE_ENV=production
PORT=8080
DATABASE_URL=PEGAR_AQUI_DATABASE_PUBLIC_URL_DE_POSTGRES
JWT_SECRET=clave_larga_privada_y_segura
```

Si la base PostgreSQL está en otro proyecto Railway, usa el valor de `DATABASE_PUBLIC_URL` como `DATABASE_URL`.
No uses `postgres.railway.internal` si la app y la base están en proyectos diferentes.

## Comandos

```bash
npm start
npm run dev
```

## Rutas principales

- `/` página principal
- `/cartelera` cartelera pública
- `/login` login único
- `/registro` registro de cliente
- `/mis-tickets` tickets del cliente
- `/comprar/:funcionId` compra de tickets
- `/caja` panel de cajero
- `/caja/venta` venta presencial
- `/caja/validar-ticket` validación de tickets
- `/admin` panel administrador
- `/admin/peliculas` administración de películas
- `/admin/funciones` administración de funciones
- `/admin/usuarios` usuarios
- `/admin/reportes` reportes

## API

- `GET /api/public/peliculas`
- `GET /api/public/funciones`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Seguridad aplicada

- JWT en cookie `httpOnly`
- bcrypt para contraseñas
- rutas protegidas por rol
- consultas SQL parametrizadas
- Helmet configurado para producción
- `.env` ignorado por Git

## Roles

- `CLIENTE`: cartelera, compra y mis tickets
- `CAJERO`: caja, venta presencial y validación
- `ADMIN`: administración general
