# Birbnb

Proyecto de la UTN FRBA para la materia **Desarrollo de Software**.  
Consiste en una aplicación web que emula el comportamiento de una plataforma de reservas estilo Airbnb, permitiendo a los usuarios publicar, buscar, reservar y gestionar propiedades.

---

## ⚙️ Cómo correr el proyecto localmente

### Requisitos

- Node.js ≥ 18
- npm ≥ 9
- MongoDB (puede ser local o remota, por ejemplo en Atlas)

### Instalación y ejecución

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/2025-1c-lu-sa-grupo-05.git
   cd 2025-1c-lu-sa-grupo-05
   ```

2. Instalar dependencias del backend:

   ```bash
   cd backend
   npm install
   npm start
   ```

3. Instalar dependencias del frontend:

   ```bash
   cd ../frontend/birbnb
   npm install
   npm start
   ```

> ⚠️ Asegurate de tener configuradas las variables de entorno necesarias (como `DB_URI`) en el backend.

---

## 🚀 Deploy y Actualización

El proyecto cuenta con tres partes desplegadas:

### 1. Backend (Render)

**Pasos para el deploy inicial en [Render](https://render.com):**

- Crear un nuevo servicio web en Render.
- Seleccionar el repositorio correspondiente.
- Elegir como **Root Directory**: `backend/`
- Configurar los siguientes comandos:
  - **Build Command:** `npm install`
  - **Start Command:** `node src/index.js`
- Establecer las variables de entorno necesarias:
  - `DB_NAME`: por ejemplo, `birbnb`
  - `DB_URI`: por ejemplo,  
    ```
    mongodb+srv://USERNAME:PASSWORD@birbnb.s4wmc4k.mongodb.net/?retryWrites=true&w=majority&appName=birbnb
    ```
- Render realizará el build y deploy automáticamente.
- Cada vez que se pushea a la rama `main`, Render actualiza automáticamente el backend.

---

### 2. Frontend (Netlify)

**Pasos para el deploy inicial en [Netlify](https://netlify.com):**

- Crear un nuevo sitio desde Git.
- Seleccionar el repositorio correspondiente (en nuestro caso, un **fork** por falta de permisos).
- Configurar:
  - **Base Directory:** `frontend/birbnb`
  - **Build Command:** `npm run build`
  - **Publish Directory:** `frontend/birbnb/build`
- Netlify realiza el deploy automáticamente.
- Cada vez que se pushea a la rama `main`, se actualiza nuestro fork con un GitHub Actions también y posteriormente el despliegue del frontend.

---

### 3. Base de Datos (MongoDB Atlas)

- Crear la base de datos en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- No requiere deploy adicional, solo provisión inicial de la base (`DB_NAME`).
- Asegurarse de que la URI esté configurada correctamente en Render como `DB_URI`.
