# 🧾 Stock Ecommerce API

Backend API desarrollada con **NestJS** para gestión de **productos**, **stock**, y **proformas (pedidos)**, con **autenticación JWT**, **roles**, **auditoría de movimientos** y **documentación Swagger**.

Este proyecto cubre el **core de un sistema comercial real**, preparado para integrarse con un frontend o panel administrativo.

---

## 🚀 Features principales

### 🔐 Autenticación y seguridad

* Login con **JWT**
* Roles (`ADMIN`)
* Guards y decorators reutilizables
* Protección por endpoint
* Headers de seguridad con **Helmet**
* Validación global con `class-validator`

---

### 📦 Productos

* CRUD de productos (admin)
* Catálogo público de productos activos
* Campos:

  * SKU
  * nombre
  * descripción
  * precio
  * stock actual
  * estado activo/inactivo

---

### 📊 Stock

* Control de stock **transaccional**
* Tipos de movimiento:

  * `IN` (ingreso)
  * `OUT` (egreso)
  * `ADJUST` (ajuste)
* Auditoría completa:

  * usuario
  * fecha
  * referencia (ej: orderId)
* Stock actual persistido en producto
* Historial completo de movimientos

---

### 🧾 Proformas / Órdenes

* Creación de proformas públicas (checkout sin pago)
* Creación de proformas como admin
* Estados:

  * `SUBMITTED`
  * `CONFIRMED`
  * `CANCELLED`
* Confirmación de proforma:

  * valida stock
  * descuenta stock
  * crea movimientos `OUT`
  * todo en **una transacción**
* Cancelación segura
* Listados con filtros (`status`)

---

### 📚 Documentación

* Swagger UI disponible
* Endpoints agrupados
* Autenticación Bearer integrada
* DTOs visibles y claros

---

## 🛠️ Tecnologías

* **Node.js**
* **NestJS**
* **TypeORM**
* **PostgreSQL**
* **JWT**
* **Swagger**
* **Docker** (Postgres)
* **ESLint + Prettier**

---

## 📂 Estructura del proyecto

```
src/
├── auth/
├── users/
├── products/
├── stock/
├── orders/
├── database/
├── config/
├── health/
└── main.ts
```

Arquitectura **modular**, orientada a escalabilidad y mantenimiento.

---

## ⚙️ Setup del proyecto

### 1️⃣ Clonar repositorio

```bash
git clone <repo-url>
cd stock-ecommerce-api
```

---

### 2️⃣ Instalar dependencias

```bash
npm install
```

---

### 3️⃣ Variables de entorno

Crear archivo `.env`:

```env
PORT=3010

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=stock_ecommerce

JWT_SECRET=supersecret
JWT_EXPIRES_IN=1d
```

---

### 4️⃣ Levantar base de datos (Docker)

```bash
docker compose up -d
```

---

### 5️⃣ Ejecutar migraciones

```bash
npm run migration:run
```

---

### 6️⃣ Levantar el servidor

```bash
npm run start:dev
```

Servidor disponible en:

```
http://localhost:3010
```

---

## 📚 Swagger

Documentación interactiva:

```
http://localhost:3010/docs
```

* Autenticarse con **Authorize**
* Usar `Bearer <token>`
* Probar todos los endpoints desde la UI

---

## 🔑 Ejemplos de uso

### 🔐 Login

**POST** `/auth/login`

```json
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

Respuesta:

```json
{
  "accessToken": "..."
}
```

---

### 📦 Crear producto (admin)

**POST** `/products`

```json
{
  "sku": "SKU-001",
  "name": "Lampara LED 9W",
  "description": "Luz fría",
  "price": 1999.99
}
```

---

### 🧾 Crear proforma (público)

**POST** `/orders`

```json
{
  "customerName": "Juan Perez",
  "customerEmail": "juan@mail.com",
  "items": [
    {
      "productId": "<product-uuid>",
      "quantity": 2
    }
  ]
}
```

---

### ✅ Confirmar proforma (admin)

**POST** `/orders/{id}/confirm`

* Cambia estado a `CONFIRMED`
* Descuenta stock
* Registra movimientos

---

### 📊 Ingreso de stock (admin)

**POST** `/stock/in`

```json
{
  "productId": "<product-uuid>",
  "quantity": 10,
  "note": "Ingreso inicial"
}
```

---

## 🧠 Decisiones de diseño

* **Stock transaccional** (consistencia > performance)
* **Snapshot de precios** en proformas
* **Separación clara** entre público y admin
* **Auditoría completa**
* **Sin pagos online** (listo para integrar luego)

---

## 🚧 Próximos pasos posibles

* Panel admin (Next.js)
* Integración de pagos
* Reportes
* Multi-sucursal
* Tests automatizados
* Rate limiting

---

## 👤 Autor

Proyecto desarrollado por **Lucas Fasolato**
Backend Engineer · Systems Engineering Student
