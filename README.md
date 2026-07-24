# Masm Store - Frontend

Frontend de **Masm Store**, una tienda virtual desarrollada con **React**, **TypeScript** y **Vite**. Esta aplicación consume una API REST desarrollada en ASP.NET Core y permite a los usuarios explorar productos, gestionar un carrito de compras y realizar pedidos simulados.

## Características

- Autenticación mediante JWT.
- Renovación automática de sesión mediante Refresh Token.
- Gestión de usuarios.
- Visualización de productos y categorías.
- Carrito de compras.
- Simulación de proceso de compra.
- Visualización del detalle de una orden.
- Notificaciones mediante Snackbar.
- Diseño responsive para dispositivos móviles y escritorio.

---

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Material UI
- React Router DOM
- Context API
- Fetch API

---

## Requisitos

- Node.js 20 o superior
- npm

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/masm-store-client.git
```

Ingresar al proyecto:

```bash
cd masm-store-client
```

Instalar dependencias:

```bash
npm install
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

Ejemplo:

```env
VITE_API_URL=https://localhost:7201/api
```

---

## Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:

```
http://localhost:5173
```

---

## Compilar para producción

```bash
npm run build
```

---

## Vista previa del build

```bash
npm run preview
```

---

## Estructura del proyecto

```
src/
│
├── assets/            # Imágenes e íconos
├── components/        # Componentes reutilizables
├── constants/         # Constantes de la aplicación
├── hooks/             # Hooks personalizados
├── pages/             # Páginas principales
├── providers/         # Context Providers
├── routes/            # Configuración de rutas
├── services/          # Consumo de la API
├── styles/            # Archivos CSS
├── types/             # Interfaces y tipos
└── utils/             # Funciones auxiliares
```

---

## Funcionalidades principales

### Autenticación

- Inicio de sesión.
- Registro de usuarios.
- Cierre de sesión.
- Refresh Token mediante cookies HttpOnly.
- Protección de rutas.

### Productos

- Listado de productos.
- Visualización de detalles.
- Consulta de categorías.
- Estado de disponibilidad.

### Carrito

- Agregar productos.
- Modificar cantidades.
- Eliminar productos.
- Cálculo automático del subtotal.

### Órdenes

- Confirmación de compra.
- Simulación de creación de una orden.
- Visualización del resumen de la compra.

### Notificaciones

La aplicación utiliza un `NotificationProvider` para mostrar mensajes de éxito, advertencia, información y error mediante componentes `Snackbar` y `Alert` de Material UI.

---

## Backend

Este proyecto consume la API REST desarrollada en:

```
https://localhost:7201/api
```

El backend se encuentra desarrollado con:

- ASP.NET Core
- Entity Framework Core
- MySQL
- JWT Authentication
- Refresh Tokens
- Cloudinary

---

## Estado del proyecto

Proyecto en desarrollo.

Actualmente se encuentran implementadas las funcionalidades principales de autenticación, catálogo de productos, carrito de compras y simulación del proceso de compra. Se continúa trabajando en el módulo de órdenes y mejoras generales de la experiencia de usuario.

---

## Autor

Marco Salazar