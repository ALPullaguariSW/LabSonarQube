# Taller de Análisis Estático con SonarQube - Parking App

Este proyecto es parte del laboratorio de Calidad de Software enfocado en la detección de vulnerabilidades, refactorización y cobertura de código.

## Requisitos Previos
*   [Node.js](https://nodejs.org/) (v14+)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop)
*   [SonarScanner](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/) (Opcional, si no se usa el contenedor)

## 1. Levantar el Entorno (SonarQube + PostgreSQL)

Se utiliza **Docker Compose** para orquestar los servicios. 

```bash
# Levantar los contenedores en segundo plano
docker-compose up -d
```

*   **SonarQube**: Disponible en [http://localhost:9000](http://localhost:9000) (Credenciales: `admin`/`admin` o `laboratorio123` si ya fue cambiado).
*   **PostgreSQL**: Disponible en `localhost:5432`.

## 2. Ejecutar la Aplicación "Parking App"

### Backend (Node.js)
```bash
cd backend
npm install
npm start
```
La API estará escuchando en `http://localhost:3000`.

### Frontend (ExtJS)
No requiere compilación. Simplemente servir el archivo `index.html`.
```bash
# En la raíz del proyecto
npx http-server .
```
Acceder a la web en `http://localhost:8080`.

## 3. Ejecutar Análisis de Código (SonarScanner)

Asegúrate de tener configurado el archivo `sonar-project.properties` con tu token.

```bash
# Ejecutar desde la raíz del proyecto
sonar-scanner
```

## 4. Pruebas Unitarias y Cobertura

Para verificar el Quality Gate (Cobertura > 80%), ejecutar los tests de Jest:

```bash
cd backend
npm test
```
Esto generará los reportes LCOV en `backend/coverage` que son leídos por SonarQube.

## Estructura del Informe
El informe detallado de este laboratorio se encuentra en la carpeta `PullaguariAxel_InformeLaboratorio/` y el PDF final como `main.pdf`.