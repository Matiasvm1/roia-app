# 📖 Guía de Usuario — ROIA

**Sistema de Gestión Textil**

---

## Índice

1. [Inicio de Sesión](#1-inicio-de-sesión)
2. [Navegación](#2-navegación)
3. [Panel de Control (Dashboard)](#3-panel-de-control)
4. [Órdenes de Producción](#4-órdenes-de-producción)
5. [Clientes](#5-clientes)
6. [Artículos](#6-artículos)
7. [Compras](#7-compras)
8. [Gastos](#8-gastos)
9. [Finanzas](#9-finanzas)
10. [Equipo](#10-equipo)
11. [Roles y Permisos](#11-roles-y-permisos)

---

## 1. Inicio de Sesión

Al ingresar a la aplicación verás la pantalla de login.

1. Escribí tu **usuario** (proporcionado por el administrador).
2. Escribí tu **contraseña**.
3. Hacé click en **"Ingresar"**.

> Si ves un error en rojo, verificá que el usuario y la contraseña sean correctos. Si tu cuenta fue desactivada, contactá al administrador.

Según tu rol serás redirigido a:
- **Administrador** → Panel de Control (Dashboard)
- **Empleado** → Órdenes de Producción

---

## 2. Navegación

### En celular (mobile)

- Tocá el ícono **☰** (hamburguesa) en la esquina superior izquierda para abrir el menú lateral.
- Seleccioná la sección que necesitás.
- El menú se cierra automáticamente al elegir una opción.

### En computadora (desktop)

- El menú lateral está siempre visible a la izquierda.
- La sección activa se resalta con un color de fondo.

### Secciones del menú

| Grupo | Secciones |
|---|---|
| **Principal** | Panel de Control, Órdenes, Clientes, Artículos |
| **Finanzas** | Compras, Gastos, Resumen Financiero |
| **Administración** | Equipo |

> Los empleados solo ven **Órdenes** en el menú.

### Cerrar sesión

Hacé click en tu nombre/avatar en la esquina superior derecha y seleccioná **"Cerrar sesión"**.

---

## 3. Panel de Control

> 🔒 Solo administradores

El dashboard muestra un resumen general del negocio:

### Tarjetas de resumen

| Indicador | Qué muestra |
|---|---|
| **Órdenes Activas** | Cantidad de órdenes en proceso (excluye finalizadas, entregadas y canceladas) |
| **Clientes** | Total de clientes activos |
| **Artículos** | Total de artículos activos en catálogo |
| **Ingresos del Mes** | Suma total de las órdenes del mes actual |
| **Gastos del Mes** | Suma de compras + gastos del mes actual |
| **Balance** | Ingresos menos gastos (verde si es positivo, rojo si es negativo) |

### Gráficos

- **Ingresos vs Gastos**: Gráfico de barras con los últimos 6 meses.
- **Órdenes por Estado**: Gráfico circular con la distribución actual de órdenes por estado de producción.

---

## 4. Órdenes de Producción

> ✅ Administradores y empleados

Esta es la sección principal del sistema. Acá se gestionan todas las órdenes de producción.

### Vista de la tabla

Cada fila muestra:
- **Número de orden** (#)
- **Cliente**
- **Estado** (etiqueta de color según el estado de producción)
- **Artículos** (los primeros 2 artículos; si hay más, muestra "+N más")
- **Total** en pesos
- **Botón de ver** (ícono de ojo) para abrir el detalle

> En celular, algunas columnas se ocultan para mejor legibilidad. Tocá el ojo para ver toda la información.

### Crear una nueva orden

1. Hacé click en **"Nueva Orden"**.
2. Completá los campos:
   - **Cliente** — Seleccioná de la lista (obligatorio).
   - **Estado** — Seleccioná el estado inicial de producción (obligatorio).
   - **Fecha de entrega** — Opcional. Cuándo se espera entregar.
   - **Notas** — Opcional. Observaciones adicionales.
3. Agregá artículos haciendo click en **"Agregar"**:
   - Seleccioná el **artículo** del catálogo (el precio se completa automáticamente).
   - Ajustá la **cantidad**.
   - Modificá el **precio** si es diferente al base.
   - Indicá el **talle** si corresponde (ej: S, M, L, XL).
   - Podés agregar tantos artículos como necesites.
   - Cada artículo muestra su **subtotal** y abajo se ve el **total** general.
4. Hacé click en **"Crear Orden"**.

### Ver detalle de una orden

Hacé click en el ícono del **ojo** (👁️) en la fila de la orden. Se abre un panel con:

- **Información general**: Cliente, fecha de creación, estado, fecha de entrega.
- **Imágenes de diseño**: Fotos o bocetos asociados a la orden.
- **Notas**: Observaciones.
- **Tabla de artículos**: Detalle completo con cantidades, precios, talles y subtotales.

### Editar una orden

1. Abrí el detalle de la orden (ícono de ojo).
2. Hacé click en **"Editar Orden"**.
3. Podés modificar:
   - **Estado** de producción
   - **Fecha de entrega**
   - **Notas**
4. Hacé click en **"Guardar Cambios"**.

### Subir imágenes de diseño

1. Abrí el detalle de la orden.
2. En la sección "Imágenes de Diseño", hacé click en **"Subir Imágenes"**.
3. Seleccioná una o varias imágenes (JPEG, PNG, WebP o GIF).
4. Las imágenes se suben y aparecen como miniaturas.
5. Hacé click en una imagen para verla en tamaño completo.
6. Para eliminar una imagen, pasá el mouse por encima y hacé click en la **✕ roja**.

### Eliminar una orden

1. Abrí el detalle de la orden.
2. Hacé click en **"Eliminar"** (botón rojo).
3. Confirmá la eliminación.

> ⚠️ Esta acción no se puede deshacer. Se elimina la orden, sus artículos y sus imágenes.

---

## 5. Clientes

> 🔒 Solo administradores

### Vista de la tabla

Cada fila muestra: nombre, email, teléfono, ciudad, cantidad de órdenes y estado (Activo/Inactivo).

### Crear un cliente

1. Hacé click en **"Nuevo Cliente"**.
2. Completá los campos:
   - **Nombre** (obligatorio)
   - **Email** (opcional)
   - **Teléfono** (opcional)
   - **Dirección** (opcional)
   - **Ciudad** (opcional)
   - **Notas** (opcional)
3. Hacé click en **"Crear"**.

### Editar un cliente

1. Hacé click en el ícono del **lápiz** (✏️) en la fila del cliente.
2. Modificá los campos que necesites.
3. Hacé click en **"Guardar"**.

### Desactivar / Activar un cliente

Dentro del formulario de edición hay un botón para **"Desactivar"** o **"Activar"** al cliente. Los clientes desactivados aparecen con opacidad reducida pero no se eliminan del sistema.

---

## 6. Artículos

> 🔒 Solo administradores

Los artículos son los productos que se fabrican (ej: remeras, buzos, pantalones).

### Vista de tarjetas

Cada artículo se muestra como una tarjeta con:
- **Nombre**
- **Categoría** (si tiene)
- **Precio base** (en verde)
- **Cantidad de pedidos** que lo usan
- **Descripción** (si tiene)

### Crear un artículo

1. Hacé click en **"Nuevo Artículo"**.
2. Completá:
   - **Nombre** (obligatorio)
   - **Precio Base** (obligatorio)
   - **Categoría** (opcional, ej: "Remeras", "Pantalones")
   - **Descripción** (opcional)
3. Hacé click en **"Crear"**.

### Editar un artículo

1. Hacé click en el ícono del **lápiz** (✏️) en la tarjeta.
2. Modificá los campos.
3. Hacé click en **"Guardar"**.

### Desactivar / Activar un artículo

Dentro del formulario de edición podés desactivar artículos que ya no se fabrican. Los artículos desactivados aparecen atenuados pero no se eliminan.

---

## 7. Compras

> 🔒 Solo administradores

Las compras son las adquisiciones de materiales, insumos o materia prima.

### Vista de la tabla

Cada fila muestra: proveedor, descripción, categoría, monto (en rojo) y fecha.

En la parte superior se muestra el **total acumulado** de compras.

### Crear una compra

1. Hacé click en **"Nueva Compra"**.
2. Completá:
   - **Proveedor** (obligatorio)
   - **Descripción** (obligatorio)
   - **Monto** (obligatorio)
   - **Categoría** (opcional, ej: "Telas", "Hilos")
   - **Fecha** (opcional, por defecto la fecha actual)
   - **Notas** (opcional)
3. Hacé click en **"Crear"**.

### Editar una compra

Hacé click en el ícono del **lápiz** (✏️) y modificá los campos que necesites.

---

## 8. Gastos

> 🔒 Solo administradores

Los gastos son egresos generales (alquiler, servicios, sueldos, etc).

### Vista de la tabla

Similar a Compras: descripción, categoría, monto y fecha.

### Crear un gasto

1. Hacé click en **"Nuevo Gasto"**.
2. Completá:
   - **Descripción** (obligatorio)
   - **Monto** (obligatorio)
   - **Categoría** (opcional, ej: "Servicios", "Alquiler")
   - **Fecha** (opcional)
   - **Notas** (opcional)
3. Hacé click en **"Crear"**.

### Editar un gasto

Hacé click en el ícono del **lápiz** (✏️) y modificá los campos.

---

## 9. Finanzas

> 🔒 Solo administradores

La sección de Finanzas es un resumen de solo lectura que muestra:

### Tarjetas del mes actual

| Tarjeta | Qué muestra |
|---|---|
| **Ingresos** | Total de órdenes del mes (en verde) |
| **Gastos** | Total de compras + gastos del mes (en rojo) |
| **Balance** | Diferencia entre ingresos y gastos |

### Gráfico de evolución

Un gráfico de barras que compara **Ingresos vs Gastos** de los últimos 6 meses, para ver la tendencia del negocio.

---

## 10. Equipo

> 🔒 Solo administradores

Acá se gestionan los usuarios del sistema.

### Tarjetas de resumen

- **Total de usuarios**
- **Administradores** (cantidad)
- **Empleados** (cantidad)

### Vista de la tabla

Cada fila muestra: nombre, usuario (@), rol, estado y acciones.

### Crear un usuario

1. Hacé click en **"Nuevo Usuario"**.
2. Completá:
   - **Nombre completo** (obligatorio)
   - **Usuario** (obligatorio, mínimo 3 caracteres, solo letras minúsculas, números, puntos y guiones bajos)
   - **Contraseña** (obligatorio, mínimo 6 caracteres)
   - **Rol**: Empleado o Administrador
3. Hacé click en **"Crear"**.

### Editar un usuario

1. Hacé click en el ícono del **lápiz** (✏️).
2. Podés cambiar:
   - **Nombre completo**
   - **Rol** (Empleado ↔ Administrador)
   - **Estado** (Activo ↔ Desactivado)
3. Hacé click en **"Guardar"**.

> Un usuario desactivado no podrá iniciar sesión.

### Restablecer contraseña

1. Hacé click en el ícono de la **llave** (🔑).
2. Escribí la nueva contraseña (mínimo 6 caracteres).
3. Hacé click en **"Restablecer"**.

> Avisale al usuario su nueva contraseña ya que no recibirá un email.

---

## 11. Roles y Permisos

El sistema tiene dos roles:

### 👑 Administrador

Acceso completo a todas las secciones:
- ✅ Panel de Control
- ✅ Órdenes (crear, ver, editar, eliminar, subir imágenes)
- ✅ Clientes (crear, editar, activar/desactivar)
- ✅ Artículos (crear, editar, activar/desactivar)
- ✅ Compras (crear, editar)
- ✅ Gastos (crear, editar)
- ✅ Finanzas (ver resumen)
- ✅ Equipo (crear usuarios, editar, restablecer contraseñas)

### 👤 Empleado

Acceso limitado:
- ✅ Órdenes (crear, ver, editar, eliminar, subir imágenes)
- ❌ No puede acceder a ninguna otra sección

---

## Consejos Útiles

- **Buscar información**: Las tablas muestran toda la información. En celular, usá el botón de ver (👁️) o editar (✏️) para acceder a los datos completos.
- **Montos**: Todos los montos están en pesos argentinos ($). Se formatean automáticamente con separadores de miles.
- **Fechas**: Se muestran en formato día/mes/año (ej: 09/02/2026).
- **Estados de producción**: Los estados se configuran en el sistema y se muestran con colores para fácil identificación.
- **Imágenes**: Podés subir fotos de diseños en las órdenes. Se aceptan formatos JPEG, PNG, WebP y GIF.

---

*ROIA — Sistema de Gestión Textil*
