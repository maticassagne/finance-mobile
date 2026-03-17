# 📱 React Native Finance App - Guía de Desarrollo

> Aplicación de finanzas personales en React Native con Expo para Android

## 📋 Tabla de Contenidos

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Configuración Inicial](#configuración-inicial)
3. [Desarrollo](#desarrollo)
4. [Diferencias Web → Mobile](#diferencias-web--mobile)
5. [Construir APK para Android](#construir-apk-para-android)
6. [Troubleshooting](#troubleshooting)

---

## 🏗️ Estructura del Proyecto

```
finance-mobile/
├── app/
│   └── _layout.tsx          # App root layout con navegación
├── src/
│   ├── lib/
│   │   └── axios.ts         # Cliente HTTP configurado
│   ├── types/
│   │   └── index.ts         # Tipos TypeScript compartidos
│   ├── hooks/
│   │   ├── useSummary.ts    # Hook para resumen de finanzas
│   │   ├── useTransactions.ts # Hook para transacciones
│   │   ├── useCategories.ts  # Hook para categorías
│   │   └── index.ts         # Exports
│   ├── components/
│   │   ├── Card.tsx         # Componente Card
│   │   ├── Button.tsx       # Componente Button
│   │   ├── Input.tsx        # Componente Input
│   │   ├── Select.tsx       # Componente Select
│   │   ├── StatCard.tsx     # Componente StatCard (stats)
│   │   └── index.ts         # Exports
│   ├── screens/
│   │   ├── DashboardScreen.tsx   # Pantalla principal
│   │   ├── TransactionsScreen.tsx # Listado de transacciones
│   │   ├── CategoriesScreen.tsx   # Gestión de categorías
│   │   └── index.ts              # Exports
│   └── navigation/
│       ├── NavigationStack.tsx   # Bottom Tab Navigator
│       └── index.ts             # Exports
├── app.json                 # Configuración de Expo
├── tsconfig.json            # Config TypeScript
├── package.json             # Dependencias
└── README.md
```

---

## 🚀 Configuración Inicial

### 1. Requisitos

```bash
# Verificar que tienes Node.js instalado
node -v
npm -v
```

### 2. Variables de Entorno

⚠️ **IMPORTANTE**: Necesitas cambiar la IP base de la API

En [src/lib/axios.ts](src/lib/axios.ts):

```typescript
const API_BASE_URL = "http://192.168.1.100:4000"; // ← Cambiar IP
```

**Para obtener tu IP local:**

En Windows:

```bash
ipconfig
# Busca "IPv4 Address" (ej: 192.168.1.100)
```

En Mac/Linux:

```bash
ifconfig
# o
hostname -I
```

⚠️ **Asegúrate que tu backend NestJS esté corriendo en el puerto 4000**

---

## 💻 Desarrollo

### 3. Instalar Dependencias

```bash
cd finance-mobile
npm install
```

### 4. Ejecutar en Android

**Opción A: Usar Expo Go (Más fácil)**

```bash
npm start
```

Verás un código QR. Abre la app **Expo Go** en tu teléfono y escanea el QR.

```
┌────────────────────────────────────────┐
│                                        │
│   Use 'a' to open Android emulator    │
│   Use 'i' to open iOS Simulator       │
│   Use 'w' to open web                 │
│                                        │
│   Metro waiting on exp://0.0.0.0:8081 │
│                                        │
└────────────────────────────────────────┘
```

Presiona `a` para abrir Android Emulator.

**Opción B: Emulador Android Studio (Recomendado para producción)**

```bash
# Primero inicia el emulador desde Android Studio
# Luego:
npm start

# Presiona 'a' en la terminal
```

### 5. Desarrollo en Caliente

Los cambios se reflejan automáticamente:

- **Modificar código**: Los cambios aparecen al guardar (Fast Refresh)
- **Reiniciar app**: Presiona `r` en la terminal
- **Recargar completamente**: Presiona `c` en la terminal

---

## 📱 Diferencias Web → Mobile

### Componentes que Cambiaron

| Web (Next.js)    | Mobile (React Native)    |
| ---------------- | ------------------------ |
| `<button>`       | `<Pressable>` + `<Text>` |
| `<input>`        | `<TextInput>`            |
| `<div>`          | `<View>`                 |
| `<p>` / `<span>` | `<Text>`                 |
| CSS Modules      | `StyleSheet.create()`    |
| `recharts`       | (No disponible)          |
| Tailwind         | StyleSheet nativo        |

### Ejemplo de Migración

**Web:**

```tsx
<div className="p-4 bg-white rounded-lg">
  <p className="text-lg font-bold">Hola</p>
  <button onClick={() => {}}>Click</button>
</div>
```

**Mobile:**

```tsx
<View style={styles.container}>
  <Text style={styles.title}>Hola</Text>
  <Pressable onPress={() => {}}>
    <Text>Click</Text>
  </Pressable>
</View>;

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", borderRadius: 8 },
  title: { fontSize: 18, fontWeight: "bold" },
});
```

---

## 🔧 Construir APK para Android

### 6. Preparar Build

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Loguéarse en Expo
eas login
# Entra tu usuario/contraseña de Expo
```

### 7. Construir APK

```bash
# Desde la carpeta finance-mobile/
eas build --platform android --local
```

Esto va a:

1. Compilar tu código
2. Crear un APK
3. Descargarlo a tu máquina

El archivo APK se guardará en la carpeta raíz.

**El build toma ~5-10 minutos.**

### 8. Instalar APK en el Teléfono

```bash
# Conecta tu teléfono por USB
adb devices

# Instala el APK
adb install -r finance-mobile-v1.0.0.apk
```

O envía el APK por email/WhatsApp y toca para instalar.

---

## 🐛 Troubleshooting

### Error: "Cannot connect to API"

**Problema:** La app no puede conectar con el backend

**Soluciones:**

1. Verifica la IP en `src/lib/axios.ts`

   ```bash
   ipconfig # obtén tu IP local
   ```

2. Asegúrate que el backend está corriendo:

   ```bash
   # En otra terminal
   cd personal-finance-api
   npm run start:dev
   ```

3. Si usas Emulador:
   - La IP debe ser tu IP local, NO `localhost`
   - Prueba con: `http://10.0.2.2:4000` (redirección de Android)

### Error: "Module not found"

```bash
npm install
npm start

# Si persiste
rm -rf node_modules package-lock.json
npm install
```

### La app se cierra al abrir

Mira los logs:

```bash
npm start
# Los logs mostrarán el error en rojo
```

### Performance lento en el emulador

```bash
# Usa hardware acceleration
# En Android Studio → AVD Manager → editar emulador
# Hardware: Habilitar "GPU" bajo "Graphics"
```

---

## 📚 Recursos Útiles

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [Expo Router](https://docs.expo.dev/routing/introduction/)
- [React Navigation](https://reactnavigation.org)

---

## 🎯 Próximos Pasos

1. **Agregar pantalla de crear transacción**

   ```bash
   # Crear: src/screens/CreateTransactionScreen.tsx
   # Agregar en navigation
   ```

2. **Agregar autenticación**

   ```bash
   # Usar expo-secure-store para guardar tokens
   ```

3. **Agregar gráficos**

   ```bash
   npm install react-native-svg @visx/visx
   # o usar victory-native
   ```

4. **Sincronización offline**
   ```bash
   npm install @react-native-async-storage/async-storage
   ```

---

## 💡 Tips de Desarrollo

### Hot Reload

Los cambios se recargan automáticamente al guardar. Si algo no funciona:

```
Presiona 'r' en la terminal para recargar
Presiona 'd' para abrir DevTools
```

### Debugging

```bash
# En el teléfono/emulador, abre:
# Shake the device → Select "Show Developer Menu"
# → "Debug Remote JS"
```

### Usar estilos globales

En [src/components/index.ts](src/components/index.ts) ya hemos centralizado los colores:

```typescript
// Reutiliza siempre estos:
const colors = {
  primary: "#10b981",
  danger: "#ef4444",
  text: "#111827",
  textSecondary: "#6b7280",
  // ...
};
```

---

## 📝 Cambios Respecto al Web

| Característica | Web           | Mobile                       |
| -------------- | ------------- | ---------------------------- |
| Ruteo          | Next.js Pages | Bottom Tabs                  |
| Gráficos       | Recharts      | (Pendiente - victory-native) |
| Styling        | Tailwind      | StyleSheet nativo            |
| Persistencia   | localStorage  | @react-native-async-storage  |
| Storage Seguro | -             | expo-secure-store            |

---

**¿Dudas?** Revisa los archivos de pantalla en `src/screens/` como referencia.
