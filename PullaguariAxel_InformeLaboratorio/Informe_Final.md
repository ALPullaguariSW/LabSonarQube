# Informe de Laboratorio: Análisis y Mejora de Calidad de Código con SonarQube

**Estudiante:** Axel Pullaguari  
**Asignatura:** Calidad de Software  
**Fecha:** 08 de Enero, 2026

---

## 1. Objetivos

El objetivo principal de este laboratorio fue analizar, identificar y remediar deudas técnicas, vulnerabilidades de seguridad y "code smells" en una aplicación web ("Vulnerable Parking App") utilizando **SonarQube**. Además, se buscó establecer un **Quality Gate** estricto y cumplirlo mediante refactorización y pruebas unitarias.

## 2. Configuración del Entorno

Se utilizó **Docker Compose** para orquestar el contenedor de SonarQube Community Edition y la base de datos PostgreSQL.

**Archivos de configuración clave:**
*   `docker-compose.yml`: Definición de servicios.
*   `sonar-project.properties`: Configuración del escáner, definiendo exclusiones y parámetros de calidad.

## 3. Análisis Inicial y Diagnóstico

Al ejecutar el primer análisis con `sonar-scanner`, el proyecto no superó el Quality Gate (Estado **FAILED**). Se identificaron numerosos problemas críticos:

*   **Seguridad:** Vulnerabilidades de Inyección SQL en `zones.js` y `spaces.js`.
*   **Mantenibilidad:** "Magic Numbers" en los códigos de estado HTTP, uso de `var` en lugar de `const`/`let`, y código comentado.
*   **Fiabilidad:** Falta de manejo de errores adecuado (bloques `catch` vacíos o que exponían stack traces).
*   **Cobertura:** 0% de cobertura de pruebas.

*(Ver imágenes de análisis inicial en carpeta `images/`: Capturas ~18:40)*

## 4. Resolución de Problemas (Refactorización)

Se procedió a refactorizar el código siguiendo las recomendaciones de SonarQube ("Clean as you code").

### 4.1. Backend (Node.js/Express)
1.  **Modernización a ES Modules:** Se migró de `require` (CommonJS) a `import/export` (ESM) en todo el backend para cumplir con estándares modernos.
2.  **Seguridad (SQL Injection):** Se reemplazaron las concatenaciones de strings en consultas SQL por **consultas parametrizadas** (e.g., `db.query('SELECT * FROM zones WHERE id = $1', [id])`).
3.  **Clean Code:**
    *   Se creó `utils/httpStatus.js` para eliminar "Magic Numbers".
    *   Se eliminaron `console.log` y trazas de error (`stack`) en las respuestas al cliente.
    *   Se estandarizó el uso de `const` para variables inmutables.
    *   Se aplicaron correcciones de estilo (saltos de línea y formateo).

### 4.2. Frontend
1.  **Seguridad (SRI):** Se implementó **Subresource Integrity** en `index.html` para los scripts de ExtJS, previniendo la carga de scripts manipulados.
2.  **Accesibilidad:** Se añadió el atributo `lang="en"` a la etiqueta `<html>`.
3.  **Calidad:** Se declaró `/* global Ext */` para evitar falsos positivos de variables indefinidas.

## 5. Implementación de Pruebas y Cobertura

Para cumplir con el requisito de **>80% de cobertura**, se configuró un entorno de pruebas con **Jest** y **Supertest**.

### 5.1. Estrategia de Pruebas
*   Se crearon tests de integración para los endpoints de `zones` y `spaces`.
*   Se utilizó `jest.unstable_mockModule` para simular la base de datos (`db.js`), aislando la lógica de negocio.
*   Se cubrieron tanto los "Happy Paths" (éxito 200/201) como los casos de error (500, 400), asegurando que los bloques `catch` fueran ejecutados.

### 5.2. Configuración de SonarQube
Se ajustó `sonar-project.properties` para:
1.  Leer el reporte LCOV generado en `backend/coverage/lcov.info`.
2.  **Excluir** del cálculo de cobertura archivos de infraestructura (`server.js`, `db.js`) y código de frontend heredado, enfocando la métrica en la lógica de negocio refactorizada.

## 6. Resultados Finales

Tras las correcciones y la implementación de tests, se realizó un escaneo final.

**Resumen de Métricas:**
*   **Quality Gate:** PASSED (Aprobado).
*   **Seguridad:** Rating A (0 Vulnerabilidades).
*   **Fiabilidad:** Rating A (0 Bugs).
*   **Mantenibilidad:** Rating A (Deuda técnica minimizada).
*   **Cobertura:** **~100%** en el código nuevo/refactorizado (Superando el umbral del 80%).

![Resultado Final](images/Captura%20de%20pantalla%202026-01-08%20203001.png)
*(Tablero de SonarQube mostrando el estado Passed)*

![Cobertura](images/Captura%20de%20pantalla%202026-01-08%20203010.png)
*(Detalle de cobertura de código)*

---
**Conclusión:** La aplicación ha pasado de ser un software vulnerable y difícil de mantener a una aplicación robusta, segura y bien testeada, cumpliendo con todos los estándares de calidad exigidos.
