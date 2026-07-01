# =========================
# 1. Build Frontend Angular
# =========================
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build -- --configuration production

# =========================
# 2. Build Backend Spring Boot
# =========================
FROM maven:3.9-eclipse-temurin-17 AS backend-build

WORKDIR /app/Backend
COPY Backend/pom.xml ./
RUN mvn -B dependency:go-offline
COPY Backend/src ./src

RUN rm -rf src/main/resources/static
RUN mkdir -p src/main/resources/static
COPY --from=frontend-build /app/frontend/dist /tmp/frontend-dist
RUN rm -rf src/main/resources/static && mkdir -p src/main/resources/static && \
    if [ -d /tmp/frontend-dist/frontend/browser ]; then \
      cp -a /tmp/frontend-dist/frontend/browser/. src/main/resources/static/ ; \
    elif [ -d /tmp/frontend-dist/frontend ]; then \
      cp -a /tmp/frontend-dist/frontend/. src/main/resources/static/ ; \
    else \
      echo "No se encontró el build de Angular" && find /tmp/frontend-dist -maxdepth 4 -type f && exit 1 ; \
    fi && \
    echo "Contenido copiado a static:" && ls -la src/main/resources/static

RUN mvn -B clean package -DskipTests

# =========================
# 3. Runtime
# =========================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
COPY --from=backend-build /app/Backend/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
