# Estado Actual de la Aplicación Finance Mobile

## 📊 Resumen General

La aplicación Finance Tracker ha sido migrada exitosamente de una aplicación web React a una aplicación Android con React Native + Expo. Funciona completamente **offline** sin necesidad de conectividad a internet, utilizando SQLite como base de datos local en el dispositivo.

**Versión Actual**: 1.0.0  
**Estado**: ✅ Completamente funcional  
**Plataforma**: Android vía Expo Go o APK

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

| Capa                     | Tecnología                | Versión            |
| ------------------------ | ------------------------- | ------------------ |
| **Frontend**             | React Native              | 0.73+              |
| **Framework**            | Expo Managed Workflow     | 54.0.33            |
| **Lenguaje**             | TypeScript                | 5.x                |
| **Base de Datos**        | SQLite                    | expo-sqlite@14.x   |
| **Navegación**           | React Navigation          | 6.x                |
| **Estado Global**        | Context API + React Hooks | -                  |
| **Almacenamiento Local** | AsyncStorage              | expo-async-storage |
| **Íconos**               | Material Community Icons  | @expo/vector-icons |
| **Fechas**               | date-fns                  | 3.x                |

### Estructura de Carpetas

```
finance-mobile/
├── src/
│   ├── app/
│   │   └── _layout.tsx                 (Root layout con DataRefreshProvider)
│   ├── db/
│   │   ├── database.ts                 (Inicialización SQLite, schema)
│   │   └── seed.ts                     (Datos iniciales de prueba)
│   ├── services/                       (Lógica de negocio)
│   │   ├── transactionService.ts       (CRUD transacciones)
│   │   ├── categoryService.ts          (CRUD categorías, cascade delete)
│   │   └── statsService.ts             (Cálculos de estadísticas)
│   ├── hooks/                          (Custom hooks con SQLite + Context)
│   │   ├── useTransactions.ts
│   │   ├── useCategories.ts
│   │   └── useSummary.ts
│   ├── context/
│   │   └── DataRefreshContext.tsx      (Global refresh trigger)
│   ├── screens/                        (Pantallas UI)
│   │   ├── DashboardScreen.tsx         (Resumen financiero)
│   │   ├── TransactionsScreen.tsx      (Lista y CRUD de transacciones)
│   │   ├── CategoriesScreen.tsx        (Lista y CRUD de categorías)
│   │   ├── CreateTransactionScreen.tsx (Formulario crear transacción)
│   │   ├── CreateCategoryScreen.tsx    (Formulario crear categoría)
│   │   └── EditTransactionScreen.tsx   (Formulario editar transacción)
│   ├── navigation/
│   │   └── NavigationStack.tsx         (Configuración de rutas)
│   ├── components/                     (UI Components reutilizables)
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── StatCard.tsx
│   └── types/
│       └── index.ts                    (TypeScript interfaces)
├── app.json                            (Configuración Expo)
├── package.json
├── tsconfig.json
└── eslint.config.mjs
```

---

## 🗄️ Esquema de Base de Datos

### Tabla: `categories`

```sql
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,  -- 'income' | 'expense'
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
```

### Tabla: `transactions`

```sql
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL,  -- 'income' | 'expense'
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (category) REFERENCES categories(name)
);
```

### Tabla: `stats`

```sql
CREATE TABLE IF NOT EXISTS stats (
  id TEXT PRIMARY KEY,
  totalIncome REAL NOT NULL DEFAULT 0,
  totalExpense REAL NOT NULL DEFAULT 0,
  balance REAL NOT NULL DEFAULT 0,
  lastUpdated TEXT NOT NULL
);
```

---

## 📱 Pantallas y Funcionalidades

### 1. **DashboardScreen** (Inicio)

- Resumen del balance actual (Ingresos, Egresos, Saldo)
- Últimas 5 transacciones
- FAB para crear nueva transacción
- Auto-refresco al enfocar la pantalla

### 2. **TransactionsScreen** (Transacciones)

- Lista completa de transacciones (filtradas por mes actual)
- Botones de acción en cada transacción:
  - ✏️ Editar - Navega a EditTransactionScreen
  - 🗑️ Eliminar - Confirma y elimina con refresh global
- FAB para crear nueva transacción
- Filtro por rango de fechas (por implementar en detalle)

### 3. **CategoriesScreen** (Categorías)

- Lista separada de categorías de ingresos y egresos
- Botón eliminar con cascade delete
- Muestra alerta con cantidad de transacciones que serán eliminadas
- FAB para crear nueva categoría

### 4. **CreateTransactionScreen** (Nueva Transacción)

- Formulario con campos:
  - Descripción (texto)
  - Monto (número)
  - Tipo (income/expense)
  - Categoría (selector dinámico según tipo)
  - Fecha (date picker)
- Botón guardar con validación
- Dispara refresh global al guardar
- Navega de vuelta a TransactionsScreen

### 5. **EditTransactionScreen** (Editar Transacción)

- Carga automática de datos de la transacción
- Mismos campos que CreateTransactionScreen
- Botón guardar actualiza la base de datos
- Dispara refresh global
- Navega de vuelta a TransactionsScreen

### 6. **CreateCategoryScreen** (Nueva Categoría)

- Formulario con campos:
  - Nombre (texto, validación de duplicados)
  - Tipo (selector income/expense)
- Botón guardar con validación
- Dispara refresh global
- Navega de vuelta a CategoriesScreen

---

## 🔧 Servicios de Negocio

### transactionService.ts

**Funciones disponibles**:

- `createTransaction(data)` - Crear nueva transacción
- `getAllTransactions()` - Obtener todas las transacciones
- `getTransactionById(id)` - Obtener una transacción específica
- `getTransactionsByDateRange(from, to)` - Obtener por rango de fechas
- `updateTransaction(id, data)` - Actualizar transacción existente
- `deleteTransaction(id)` - Eliminar transacción
- `updateStatsCache()` - Actualizar caché de estadísticas

### categoryService.ts

**Funciones disponibles**:

- `createCategory(data)` - Crear nueva categoría (valida duplicados)
- `getAllCategories()` - Obtener todas las categorías
- `getCategoriesByType(type)` - Obtener categorías por tipo
- `deleteCategory(id)` - Eliminar categoría y sus transacciones (CASCADE DELETE)
  - **Retorna**: número de transacciones eliminadas
- `updateCategory(id, data)` - Actualizar categoría existente

### statsService.ts

**Funciones disponibles**:

- `getSummary()` - Obtener resumen financiero (income, expense, balance)
- `getStatsByCategory()` - Obtener estadísticas por categoría
- `getMonthlyStats(month)` - Obtener estadísticas mensuales
- `getTotalTransactions()` - Contar transacciones totales
- `getAverageTransaction()` - Promediar monto de transacciones

---

## 🔄 Mecanismo de Sincronización Global

### DataRefreshContext

```typescript
// Proporciona:
- refreshVersion: number (incrementa cada vez que se necesita refresh)
- triggerRefresh(): void (función para disparar refresh)

// Uso:
const { triggerRefresh } = useDataRefresh();
await createTransaction(...);
triggerRefresh(); // Todos los hooks recargan datos
```

**Cómo funciona**:

1. Componente llama `triggerRefresh()`
2. Context incrementa `refreshVersion`
3. Todos los hooks suscritos ven el nuevo valor en su array de dependencias
4. useEffect se ejecuta y los datos se recargan desde la BD
5. Componentes se re-renderizan con datos actualizados

**Ventajas**:

- Sincronización instantánea entre pantallas
- No se usan Redux o MobX (exceso de complejidad)
- Fácil de entender y mantener
- Perfecto para apps offline-first

---

## 🪝 Custom Hooks

### useTransactions(dateRange?)

- **Parametros**: `dateRange?: { from: Date, to: Date }`
- **Retorna**: `{ data: Transaction[], isLoading: boolean, refresh: () => void }`
- **Comportamiento**: Se refresca cuando cambia `refreshVersion` del context

### useCategories()

- **Retorna**: `{ data: Category[], isLoading: boolean, refresh: () => void }`
- **Comportamiento**: Se refresca cuando cambia `refreshVersion` del context

### useSummary()

- **Retorna**: `{ data: { totalIncome, totalExpense, balance }, isLoading: boolean }`
- **Comportamiento**: Se refresca cuando cambia `refreshVersion` del context

**Patrón común**: Todos los hooks suscribieron a `refreshVersion` en su array de dependencias.

---

## 🧪 Datos de Prueba

La aplicación incluye un archivo `src/db/seed.ts` que carga automáticamente:

- **10 categorías**: 5 de ingresos (Salario, Bonus, etc) y 5 de egresos (Comida, Transporte, etc)
- **10 transacciones**: distribuidas entre las categorías

Estos datos se cargan **una sola vez** cuando se instala la aplicación (verifica si ya existen).

---

## 🎯 CRUD Operations Status

### ✅ Transacciones

- **Create**: Implementado en `CreateTransactionScreen` ✅
- **Read**: Implementado en `TransactionsScreen` (lista) y `DashboardScreen` (últimas) ✅
- **Update**: Implementado en `EditTransactionScreen` ✅
- **Delete**: Implementado en `TransactionsScreen` (botón papelera) ✅

### ✅ Categorías

- **Create**: Implementado en `CreateCategoryScreen` ✅
- **Read**: Implementado en `CategoriesScreen` ✅
- **Update**: Implementado en `CategoriesScreen` (inline) ⏳ (parcial)
- **Delete**: Implementado en `CategoriesScreen` (cascade delete) ✅

### ✅ Estadísticas

- **Read**: Implementado en `DashboardScreen` (summary) ✅
- **Aggregations**: Implementado en `statsService` (by category, monthly, etc) ✅

---

## 🚀 Cómo Ejecutar

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor Expo
npm start
# o
npx expo start

# En Expo Go (Android):
# 1. Abre la app Expo Go en tu dispositivo
# 2. Escanea el código QR mostrado en la terminal
```

### Generar APK para Android

```bash
# Opción 1: Con EAS (recomendado)
eas build --platform android --profile preview

# Opción 2: Localmente (requiere Android SDK)
npx expo run:android
```

---

## 📝 Flujos de Usuario Principales

### Flujo: Crear Transacción

```
Dashboard/Transacciones → FAB (+) → CreateTransactionScreen
→ Llenar formulario → Guardar
→ updateTransaction() → triggerRefresh()
→ Navegar a TransactionsScreen
→ Lista se actualiza automáticamente
```

### Flujo: Editar Transacción

```
TransactionsScreen → Botón lápiz (editar)
→ EditTransactionScreen (carga datos)
→ Modificar campos → Guardar
→ updateTransaction() → triggerRefresh()
→ Navegar a TransactionsScreen
→ Lista se actualiza automáticamente
```

### Flujo: Eliminar Transacción

```
TransactionsScreen → Botón papelera (eliminar)
→ Alert de confirmación
→ deleteTransaction() → triggerRefresh()
→ Alert de éxito
→ Lista se actualiza automáticamente
```

### Flujo: Eliminar Categoría con Cascade

```
CategoriesScreen → Botón eliminar
→ Alert con cantidad de transacciones
→ deleteCategory() (elimina categoría + transacciones)
→ triggerRefresh()
→ Alert de éxito con cantidad
→ Listas se actualizan automáticamente
```

---

## ⚠️ Consideraciones Técnicas

### Sincronización de Datos

- **Problema**: ¿Cómo mantienen todas las pantallas datos actualizados?
- **Solución**: DataRefreshContext con `refreshVersion`
- **Resultado**: Consistencia de datos sin Redux/MobX

### Cascade Delete

- **Problema**: Al eliminar categoría, ¿qué pasa con las transacciones?
- **Solución**: `deleteCategory()` elimina transacciones asociadas en la BD
- **Comportamiento**: Muestra al usuario cuántas transacciones serán eliminadas

### Validación

- **Categorías duplicadas**: `createCategory()` usa `LOWER(name)` para evitar duplicados
- **Monto negativo**: Validación en pantalla (puede mejorarse)
- **Campos requeridos**: Validación en FormData

### Performance

- **Caching**: `statsService` mantiene caché en tabla `stats`
- **Indices**: Se pueden agregar para optimizar búsquedas
- **Lazy loading**: Se puede implementar para listas muy grandes

---

## 🔌 Backend NestJS (Intacto)

La aplicación NestJS backend original está completamente **intacta** en la carpeta `personal-finance-api/`.

**Estado actual**: No utilizada (app funciona offline)  
**Propósito futuro**: Sincronización en la nube cuando se implemente

**Cómo integrar después**:

1. Reemplazar servicios de SQLite con llamadas Axios/fetch
2. Mantener caché local como respaldo offline
3. Implementar queue para sincronización

---

## 📊 Próximas Mejoras

### Funcionalidades

- [ ] Exportar datos a CSV/PDF
- [ ] Importar datos desde CSV
- [ ] Búsqueda y filtros avanzados
- [ ] Gráficos y visualizaciones
- [ ] Notificaciones de recordatorio
- [ ] Presupuestos por categoría

### UI/UX

- [ ] Modo oscuro (dark mode)
- [ ] Animaciones suaves
- [ ] Swipe para eliminar
- [ ] Gestos táctiles avanzados
- [ ] Tema personalizado

### Backend

- [ ] Sincronización con NestJS backend
- [ ] Autenticación con usuario
- [ ] Almacenamiento en nube
- [ ] Múltiples dispositivos sincronizados

---

## 📞 Soporte

**Problemas comunes**:

1. **"No aparece la pantalla de editar"**
   - Verifica que `EditTransactionScreen` esté registrado en `NavigationStack.tsx`
   - Comprueba los console.log en el botón de editar

2. **"Los cambios no se ven en las otras pantallas"**
   - Verifica que el servicio llame `triggerRefresh()`
   - Comprueba que el hook esté suscrito a `refreshVersion`

3. **"Base de datos sin datos iniciales"**
   - Ejecuta `npm start -- --reset-cache` para reiniciar Expo
   - Verifica que `src/db/seed.ts` esté siendo llamado en `_layout.tsx`

4. **"APK no se instala en Android"**
   - Verifica compatibilidad de versión (minSDK: 24)
   - Desinstala versión anterior antes de instalar nueva

---

**Última actualización**: [Fecha actual]  
**Versión de documentación**: 2.0.0
