# 🚀 GUÍA DE BUILD & DEPLOYMENT - Finance Tracker v1.0.0

## 📋 Pasos para Generar APK Limpio

### Paso 1: Modificar seed.ts para APK Limpio

Abre `src/db/seed.ts` y cambia esta línea:

```typescript
// Línea 5
const LOAD_SAMPLE_DATA = true; // ← CAMBIAR A FALSE
```

A:

```typescript
const LOAD_SAMPLE_DATA = false; // ✅ Sin datos iniciales
```

**Resultado:**

- ✅ APK sin datos de prueba
- ✅ Base de datos limpia
- ✅ Solo categorías predefinidas
- ✅ Listo para uso en producción

### Paso 2: Compilar y Generar APK

#### Opción A: Con EAS Build (Recomendado)

```bash
cd finance-mobile
eas build --platform android --profile preview
```

**Ventajas:**

- ✅ Compilación en la nube
- ✅ No necesita Android SDK localmente
- ✅ APK generado y descargado automáticamente
- ✅ Más confiable

**Requisitos:**

- Cuenta en Expo (eas account)
- El proyecto debe tener `eas.json`

#### Opción B: Build Local

```bash
npx expo run:android
```

**Ventajas:**

- ✅ No requiere cuenta Expo
- ✅ Más rápido

**Requisitos:**

- Android SDK instalado
- Emulador o dispositivo conectado

---

## 🔄 Flujo Completo de Generación

```
1. Terminal
   ├─ cd finance-mobile
   └─ Cambiar LOAD_SAMPLE_DATA a false

2. Build
   ├─ eas build --platform android --profile preview
   └─ Esperar a que compile (5-10 minutos)

3. Descarga
   ├─ Se descarga APK automáticamente
   └─ Guardado en carpeta de descargas

4. Instalación
   ├─ adb install app-release.apk
   └─ O instalar manualmente en dispositivo

5. Prueba
   ├─ Abre app en Android
   ├─ Verifica que está limpia
   └─ Comienza a usar
```

---

## 📱 Instalación Manual (sin ADB)

### En Windows:

1. Conecta tu Android vía USB
2. Activa "Depuración USB" en Configuración → Opciones de desarrollador
3. Descarga el APK
4. Copia el APK a la carpeta Descargas del dispositivo
5. Abre Administrador de Archivos
6. Busca el APK en Descargas
7. Toca el APK para instalar
8. Confirma la instalación

---

## 🔍 Verificación Previa al Build

Antes de generar el APK, verifica:

### ✅ Código

```bash
npm run lint
# Debe mostrar: 0 errors, XX warnings
```

### ✅ TypeScript

```bash
npx tsc --noEmit
# No debe mostrar errores
```

### ✅ Testing en Expo Go

```bash
npm start
# Prueba todas las funcionalidades
# - Create transacción
# - Edit transacción
# - Delete transacción
# - Cascade delete categorías
# - Sincronización global
```

---

## 📦 Archivos Importantes

### Configuración:

```
app.json                    - Metadata de la app
eas.json                    - Configuración de build
package.json               - Dependencias
tsconfig.json              - Config de TypeScript
```

### Código:

```
src/db/seed.ts             - Flag LOAD_SAMPLE_DATA aquí ⭐
src/app/_layout.tsx        - Punto de entrada
src/navigation/NavigationStack.tsx - Rutas
```

---

## 🎯 Estados del Seed

### Estado 1: LOAD_SAMPLE_DATA = true (Desarrollo)

```
const LOAD_SAMPLE_DATA = true;

✅ Con datos de prueba
✅ 11 transacciones
✅ 10 categorías
✅ Para testing y desarrollo
❌ No apto para producción
```

### Estado 2: LOAD_SAMPLE_DATA = false (Producción)

```
const LOAD_SAMPLE_DATA = false;

✅ BD completamente limpia
✅ Solo 10 categorías
✅ 0 transacciones
✅ Listo para APK limpio
✅ Apto para producción
```

---

## 🚀 Comandos Útiles

### Iniciar Expo Go

```bash
npm start
# Escanea QR con Expo Go
```

### Reset de Expo

```bash
npm start -- --reset-cache
# Limpia caché y reinicia
```

### Build APK Local

```bash
npx expo run:android
# Compila localmente (requiere Android SDK)
```

### Build APK en la Nube

```bash
eas build --platform android --profile preview
# Compila en servidores de Expo
```

### Instalar APK (Windows)

```bash
adb install app-release.apk
# Instala en dispositivo conectado
```

---

## 📊 Checklist Previa al Build

Antes de generar el APK final:

```
CÓDIGO:
  ☐ LOAD_SAMPLE_DATA = false (en seed.ts)
  ☐ npm run lint pasó (0 errors)
  ☐ Sin console.errors en logs
  ☐ Sin TODO o FIXME pendientes

TESTING:
  ☐ Probé en Expo Go
  ☐ Create transacción funciona
  ☐ Edit transacción funciona
  ☐ Delete transacción funciona
  ☐ Cascade delete funciona
  ☐ Dashboard se actualiza
  ☐ Sin crashes
  ☐ Sin errores en consola

DATOS:
  ☐ BD limpia sin datos iniciales
  ☐ Solo 10 categorías predefinidas
  ☐ 0 transacciones de prueba
  ☐ Stats vacíos (0 balance)

CONFIGURACIÓN:
  ☐ app.json actualizado
  ☐ eas.json correctamente configurado
  ☐ Versión en 1.0.0
  ☐ Permisos Android correctos
```

---

## 🔐 Seguridad y Privacidad

### Antes de hacer público:

- ☐ Cambiar LOAD_SAMPLE_DATA a false
- ☐ Remover datos de desarrollo
- ☐ Validar que no hay secretos en código
- ☐ Revisar permisos Android en AndroidManifest.xml
- ☐ Verificar que offline-first no expone datos

---

## 📈 Versioning

Formato: `MAJOR.MINOR.PATCH`

- **1.0.0** - Release inicial con CRUD completo
- **1.1.0** - Futuro: Nuevas features
- **1.0.1** - Futuro: Bug fixes

Actualizar en:

1. `app.json` → `"version"`
2. `package.json` → `"version"`
3. Commit con tag: `git tag v1.0.0`

---

## ✅ Después del Build

1. **Descarga el APK** desde la consola de EAS o tu carpeta de descargas
2. **Prueba en dispositivo real**
3. **Verifica funcionalidades críticas**
4. **Comparte con usuarios**
5. **Recopila feedback**
6. **Repite proceso para v1.1.0**

---

## 🎊 Resultado Final

Cuando todo esté listo:

✅ APK limpio sin datos de prueba  
✅ Todas las funcionalidades funcionan  
✅ Sin errores en consola  
✅ Pronto para producción  
✅ Listo para usuarios reales

---

**Versión de esta guía**: 1.0  
**Actualizado**: Hoy  
**Próximo paso**: Ejecutar los comandos de build
