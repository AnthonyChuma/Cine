# Sistema Web para la Venta de Tickets - Cine Hispano Potosí

Proyecto full-stack para venta de tickets del Cine Hispano de la ciudad de Potosí.

## Estructura

```text
Cine/
├── Backend/              # Spring Boot + PostgreSQL + JWT + Flyway
├── frontend/             # Web pública cliente Angular
├── dashboard_frontend/   # Panel administrador/cajero Angular
└── README.md
```

## Puertos locales

- Backend: http://localhost:8080
- Frontend cliente: http://localhost:4200
- Dashboard: http://localhost:4300

## Variables para backend local

Configura estas variables en CMD antes de arrancar el backend. Usa los datos públicos de Railway, no `postgres.railway.internal`.

```cmd
cd C:\Cine\Backend
set PGHOST=reseau.proxy.rlwy.net
set PGPORT=PUERTO_PUBLICO_RAILWAY
set PGDATABASE=railway
set PGUSER=postgres
set PGPASSWORD=TU_PASSWORD_RAILWAY
set JWT_SECRET=clave_segura_local_123456789_para_pruebas_cine_hispano_2026
set FRONTEND_URL=http://localhost:4200
set DASHBOARD_URL=http://localhost:4300
set SPRING_PROFILES_ACTIVE=dev
```

## Ejecutar backend

```cmd
cd C:\Cine\Backend
mvn clean
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Al iniciar, Flyway ejecuta migraciones:

- `V1__init_schema.sql`: crea tablas.
- `V2__seed_data.sql`: crea roles, géneros, salas, asientos y admin.
- `V3__seed_movies_functions.sql`: crea cartelera y funciones de prueba.

## Ejecutar frontend cliente

```cmd
cd C:\Cine\frontend
npm install
npx ng serve --port 4200 --open
```

## Ejecutar dashboard

```cmd
cd C:\Cine\dashboard_frontend
npm install
npx ng serve --port 4300 --open
```

## Endpoints principales

```text
GET  /api/public/peliculas
GET  /api/public/peliculas/{id}
GET  /api/public/funciones
GET  /api/public/peliculas/{id}/funciones
GET  /api/public/funciones/{id}/asientos
POST /api/auth/register
POST /api/auth/login
POST /api/cliente/comprar-ticket
GET  /api/cliente/mis-tickets
GET  /api/admin/reportes/dashboard
```

## Pruebas rápidas

```cmd
curl.exe http://localhost:8080/api/public/peliculas
curl.exe http://localhost:8080/api/public/funciones
curl.exe http://localhost:8080/api/public/funciones/1/asientos
```

## Seguridad aplicada

- JWT para autenticación.
- BCrypt para contraseñas.
- Roles: ADMIN, CAJERO y CLIENTE.
- CORS limitado a frontend y dashboard.
- DTOs para respuestas principales.
- Migraciones con Flyway.
- Base de datos PostgreSQL en Railway.

## Nota de seguridad

No subas credenciales reales de Railway ni `JWT_SECRET` al repositorio. Si alguna contraseña se mostró en una captura, cambia/regenera la contraseña de PostgreSQL en Railway.
