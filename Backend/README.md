# Backend - Cine Hispano Potosí

## Descripción
Backend en Spring Boot para el sistema de venta de tickets del Cine Hispano de la ciudad de Potosí.

## Arquitectura
- Arquitectura por capas
- Spring Boot 3.x
- PostgreSQL
- JWT
- Spring Security
- Flyway

## Estructura
- config/
- controller/
- dto/
- entity/
- exception/
- mapper/
- repository/
- security/
- service/
- util/

## Variables de entorno
- DATABASE_URL
- PGHOST
- PGPORT
- PGDATABASE
- PGUSER
- PGPASSWORD
- JWT_SECRET
- FRONTEND_URL
- DASHBOARD_URL
- SPRING_PROFILES_ACTIVE=prod

## Ejecución local
```bash
mvn spring-boot:run
```

## Seguridad
- JWT
- BCrypt
- Roles CLIENTE, CAJERO, ADMIN
- CORS restringido
