# 🎯 PLAN FINAL - Testing & APK Limpio

## 📊 Lo Que Vas a Hacer

```
┌─────────────────────────────────────────────────┐
│ 1️⃣  PROBAR EN EXPO GO (5-10 min)               │
│    - Abre app en dispositivo Android            │
│    - Prueba todas las funcionalidades           │
│    - Verifica que todo funciona                 │
│                                                 │
│ 2️⃣  CAMBIAR CONFIGURACIÓN (1 min)              │
│    - seed.ts: LOAD_SAMPLE_DATA = false         │
│    - Esto hace que el APK sea limpio            │
│                                                 │
│ 3️⃣  GENERAR APK (5-10 min)                     │
│    - eas build --platform android              │
│    - Compila en la nube                        │
│                                                 │
│ 4️⃣  INSTALAR EN ANDROID (5 min)                │
│    - Descarga el APK                           │
│    - Instala en tu dispositivo                 │
│    - ¡Listo para usar!                         │
│                                                 │
│ ⏱️  TIEMPO TOTAL: 20-30 MINUTOS                │
└─────────────────────────────────────────────────┘
```

---

## 🚀 PASO 1: INICIAR EXPO GO

### Abre una terminal y corre:

```bash
cd c:\Users\Matias\Desktop\Finance\finance-mobile
npm start
```

### Verás algo como:

```
> Expo server is ready
> ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
> ║  Scan this QR  ║
> ║  code with     ║
> ║  Expo Go       ║
> ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
>
> URL: exp://...
```

---

## 📱 PASO 2: ESCANEAR QR CON EXPO GO

### En tu Android:

1. Abre **Expo Go** (debe estar instalado)
2. Toca el botón **"Scan QR code"** (ícono cuadrado)
3. Apunta a la pantalla donde ves el código QR
4. Escanea
5. **La app cargará automáticamente** ✅

### Verás:

```
Dashboard
├─ Balance: $0.00
├─ Ingresos: $0.00
├─ Egresos: $0.00
└─ 0 transacciones
```

---

## ✅ PASO 3: TESTING (Sigue Este Orden)

### 1️⃣ Crear Transacción

```
Dashboard → Toca botón (+) rojo abajo a la derecha
                ↓
Llena: Descripción, Monto, Tipo, Categoría
                ↓
Toca "Guardar"
                ↓
Deberías ver tu transacción en "Transacciones"
Deberías ver el total actualizado en "Dashboard"
```

### 2️⃣ Editar Transacción

```
Transacciones → Busca tu transacción
                ↓
Toca el botón [✏️] (lápiz)
                ↓
Se abre el formulario con tus datos
                ↓
Modifica el monto (ej: 100 → 250)
                ↓
Toca "Guardar"
                ↓
Verifica que cambió en "Transacciones"
Verifica que cambió en "Dashboard"
```

### 3️⃣ Eliminar Transacción

```
Transacciones → Busca tu transacción
                ↓
Toca el botón [🗑️] (papelera)
                ↓
Modal: "¿Estás seguro...?"
                ↓
Toca "Eliminar"
                ↓
Modal: "Transacción eliminada correctamente"
                ↓
Verifica que desapareció de "Transacciones"
Verifica que Dashboard se actualizó
```

### 4️⃣ Crear Categoría

```
Categorías → Toca botón (+)
                ↓
Nombre: "MiCategoria"
Tipo: "Expense"
                ↓
Toca "Guardar"
                ↓
Deberías verla en la lista
```

### 5️⃣ Cascade Delete (Prueba Final)

```
Transacciones → Crea 3 transacciones con "MiCategoria"
                ↓
Categorías → Busca "MiCategoria"
                ↓
Toca botón eliminar
                ↓
Modal: "Se eliminarán 3 transacción(es)"
                ↓
Toca "Eliminar"
                ↓
Modal: "Se eliminaron 3 transacción(es)"
                ↓
Verifica que "MiCategoria" desapareció
Verifica que las 3 transacciones desaparecieron
Verifica que Dashboard se actualizó
```

---

## ✨ SI TODO FUNCIONA:

```
✅ Create: Funciona
✅ Read: Funciona
✅ Update: Funciona
✅ Delete: Funciona
✅ Cascade Delete: Funciona
✅ Sincronización: Funciona
✅ Sin Crashes: Funciona

= LISTO PARA GENERAR APK =
```

---

## 🔧 PASO 4: CAMBIAR CONFIGURACIÓN

### Abre este archivo:

```
c:\Users\Matias\Desktop\Finance\finance-mobile
  └─ src
      └─ db
          └─ seed.ts
```

### Busca la línea 5:

```typescript
const LOAD_SAMPLE_DATA = true; // ← AQUÍ
```

### Cámbialo a:

```typescript
const LOAD_SAMPLE_DATA = false; // ✅ LISTO
```

### Guarda (Ctrl+S)

**Resultado**: El APK se generará sin datos iniciales (BD limpia)

---

## 🚀 PASO 5: GENERAR APK LIMPIO

### En la terminal, escribe:

```bash
cd c:\Users\Matias\Desktop\Finance\finance-mobile
eas build --platform android --profile preview
```

### Espera... verás:

```
✓ Credentials
✓ Building...
⏳ Building APK... (esto toma 5-10 minutos)
✓ Build complete!

Build ID: ...
Download URL: https://...
```

### Automáticamente:

- Se descargará el APK a tu carpeta de descargas
- O abre el link que te da para descargarlo

**Nombre del archivo**: `app-release.apk` (o similar)

---

## 📱 PASO 6: INSTALAR EN ANDROID

### Opción A: USB Directo (Recomendado)

```bash
adb install app-release.apk
```

### Opción B: Manual (Sin ADB)

1. Copia el APK a la carpeta Descargas del Android
2. Abre Administrador de Archivos en el teléfono
3. Ve a Descargas
4. Toca el archivo `.apk`
5. Toca "Instalar"
6. Confirma cualquier permiso
7. ¡Listo!

---

## 🎊 RESULTADO FINAL

### Tendrás instalada la app:

```
Finance Tracker v1.0.0
├─ 📊 Dashboard
├─ 💳 Transacciones
├─ 🏷️  Categorías
└─ ✨ Totalmente funcional

Sin datos iniciales (BD limpia)
Listo para que agregues tus datos
```

---

## 🎯 CHECKLIST FINAL

```
TESTING EN EXPO GO:
  ☐ Create transacción
  ☐ Read transacción
  ☐ Update transacción
  ☐ Delete transacción
  ☐ Crear categoría
  ☐ Cascade delete categoría
  ☐ Sincronización global
  ☐ Sin crashes

CONFIGURACIÓN:
  ☐ LOAD_SAMPLE_DATA = false en seed.ts
  ☐ Archivo guardado

BUILD:
  ☐ eas build ejecutado
  ☐ APK descargado
  ☐ APK instalado en Android

INSTALACIÓN:
  ☐ App abre sin errores
  ☐ BD está vacía (como esperado)
  ☐ Todas las funciones funcionan
  ☐ Listo para usar
```

---

## ⏱️ TIEMPO ESTIMADO

```
Testing en Expo Go:          5-10 min
Cambiar configuración:        1 min
Generar APK:                 5-10 min
Descargar e instalar:         5 min
─────────────────────────────────────
TOTAL:                       20-30 min
```

---

## 🆘 SOLUCIONES RÁPIDAS

| Problema                   | Solución                                   |
| -------------------------- | ------------------------------------------ |
| La app no carga en Expo    | `npm start -- --reset-cache`               |
| Botones no aparecen        | Reinicia Expo Go completamente             |
| Cascade delete no funciona | Verifica que categoría tiene transacciones |
| APK no descarga            | Revisa el URL que EAS te da                |
| APK no instala             | Activa "Fuentes desconocidas" en Android   |

---

## 📞 COMANDO RÁPIDO PARA COPIAR

### Copiar y pegar en terminal:

```bash
cd c:\Users\Matias\Desktop\Finance\finance-mobile && npm start
```

### Después de cambiar seed.ts:

```bash
eas build --platform android --profile preview
```

---

## ✅ LISTO PARA EMPEZAR

Sigue los pasos arriba y en 20-30 minutos tendrás:

🎉 **APP INSTALADA EN ANDROID**  
🎉 **BD LIMPIA Y LISTA PARA USAR**  
🎉 **TODAS LAS FUNCIONES FUNCIONANDO**

---

**Versión**: 1.0.0  
**Estado**: Listo para testing  
**Próximo paso**: Ejecuta `npm start` 👈
