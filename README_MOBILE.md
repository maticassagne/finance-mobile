# 📱 Finance Tracker Mobile - React Native + Expo

> Una app de finanzas personales para Android construida con React Native, Expo y NestJS

## 🎯 Características

✅ Dashboard con resumen de ingresos/gastos  
✅ Listado de transacciones  
✅ Gestión de categorías  
✅ Sincronización con backend NestJS  
✅ UI nativa optimizada para móvil  
✅ TypeScript para mayor seguridad de tipos

---

## 🚀 Inicio Rápido

### 1️⃣ Configuración Inicial

```bash
# Clona el repositorio (si no lo has hecho)
cd finance-mobile

# Instala dependencias
npm install
```

### 2️⃣ Configura tu IP Local

**Abre:** `src/lib/axios.ts`

Cambia la IP según tu máquina:

```typescript
const API_BASE_URL = "http://192.168.1.100:4000"; // ← Tu IP aquí
```

📌 Ver **[CONFIGURACION_RAPIDA.md](CONFIGURACION_RAPIDA.md)** para instrucciones detalladas.

### 3️⃣ Inicia la App

```bash
npm start
```

**Opciones:**

- Presiona `a` → Android Emulator
- Presiona `i` → iOS Simulator (Mac)
- Presiona `w` → Web browser
- Escanea QR con Expo Go en teléfono real

---

## 📱 Cómo Usar

### En Desarrollo

```bash
npm start

# Comandos en la terminal:
# a = Abrir Android Emulator
# r = Recargar app
# c = Recargar completamente
# d = DevTools
# q = Quit
```

### Cambios en Tiempo Real

Los cambios se reflejan automáticamente gracias a **Fast Refresh**. Solo guarda el archivo.

---

## 🏗️ Estructura del Proyecto

```
finance-mobile/
├── src/
│   ├── lib/
│   │   └── axios.ts          # Configuración de API
│   ├── hooks/
│   │   ├── useSummary.ts     # Datos financieros
│   │   ├── useTransactions.ts # Transacciones
│   │   └── useCategories.ts  # Categorías
│   ├── components/
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── StatCard.tsx
│   ├── screens/
│   │   ├── DashboardScreen.tsx
│   │   ├── TransactionsScreen.tsx
│   │   ├── CategoriesScreen.tsx
│   │   └── CreateTransactionScreen.tsx
│   ├── navigation/
│   │   └── NavigationStack.tsx
│   └── types/
│       └── index.ts
├── app/
│   └── _layout.tsx           # Root layout
├── GUIA_DESARROLLO.md        # Documentación completa
├── CONFIGURACION_RAPIDA.md   # Setup rápido
└── package.json
```

---

## 🔌 Backend

**Asegúrate que tu backend NestJS está corriendo:**

```bash
cd personal-finance-api
npm run start:dev

# Debería escuchar en:
# http://localhost:4000
```

**Endpoints esperados:**

- `GET /stats/summary` - Resumen de finanzas
- `GET /stats/categories` - Estadísticas por categoría
- `GET /transaction` - Listado de transacciones
- `POST /transaction` - Crear transacción
- `GET /category` - Listado de categorías

---

## 🛠️ Stack Tecnológico

| Tecnología           | Uso                        |
| -------------------- | -------------------------- |
| **React Native**     | Framework móvil            |
| **Expo**             | Herramienta de desarrollo  |
| **TypeScript**       | Tipado estático            |
| **Axios**            | HTTP client                |
| **React Navigation** | Navegación entre pantallas |
| **Date-fns**         | Manejo de fechas           |
| **Expo Icons**       | Iconos nativos             |

---

## 📚 Documentación

- **[GUIA_DESARROLLO.md](GUIA_DESARROLLO.md)** - Guía completa de desarrollo
- **[CONFIGURACION_RAPIDA.md](CONFIGURACION_RAPIDA.md)** - Setup rápido
- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)

---

## 🐛 Troubleshooting

### "Cannot connect to backend"

1. Verifica que el backend corre en `npm run start:dev`
2. Cambia la IP en `src/lib/axios.ts`
3. Si usas emulador, intenta `http://10.0.2.2:4000`

### "Module not found"

```bash
npm install
npm start
```

### Performance lento

- Usa hardware acceleration en Android Emulator
- Reinicia el emulador

Ver **[GUIA_DESARROLLO.md](GUIA_DESARROLLO.md#-troubleshooting)** para más soluciones.

---

## 📝 Próximos Pasos

- [ ] Gráficos (Victory Native o @visx/visx)
- [ ] Autenticación con JWT
- [ ] Sincronización offline
- [ ] Push notifications
- [ ] Filtros avanzados en transacciones
- [ ] Exportar reportes

---

## 🚢 Construir APK

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Build para Android
eas build --platform android --local
```

El APK se descargará automáticamente.

---

## 📄 Licencia

Este proyecto es parte de Finance Tracker.

---

## 💬 ¿Dudas?

Revisa la documentación detallada en [GUIA_DESARROLLO.md](GUIA_DESARROLLO.md)
