# ✅ INSTRUCCIONES FINALES - Testing en Expo Go + APK Limpio

## 🎯 Objetivo: Probar en Expo Go y Generar APK Limpio

---

## 📱 PASO 1: PRUEBA EN EXPO GO (5-10 minutos)

### En tu PC (Abrir nueva terminal):

```bash
cd c:\Users\Matias\Desktop\Finance\finance-mobile
npm start
```

**Esperado**: Verás un código QR en la terminal

### En tu Android:

1. Abre la app **Expo Go**
2. Toca "Scan QR code"
3. Escanea el código QR de la terminal
4. La app cargará en unos segundos

---

## ✅ PASO 2: TESTING CHECKLIST (Sigue estos pasos)

Mientras la app está corriendo, prueba lo siguiente:

### Dashboard

- [ ] Se carga sin errores
- [ ] Muestra balance (puede estar vacío)
- [ ] Botón (+) rojo en la esquina abajo a la derecha funciona

### Crear Transacción

- [ ] Toca el botón (+)
- [ ] Llena un formulario: descripción, monto, tipo, categoría
- [ ] Toca "Guardar"
- [ ] Vuelve a Transacciones y verás tu transacción ✅
- [ ] Abre Dashboard y verás los totales actualizados ✅

### Editar Transacción

- [ ] En Transacciones, toca el botón **lápiz** ✏️
- [ ] Se abre el formulario con tus datos
- [ ] Modifica el monto (ej: 100 → 250)
- [ ] Toca "Guardar"
- [ ] Vuelve a Transacciones y verás el cambio ✅
- [ ] Dashboard se actualiza ✅

### Eliminar Transacción

- [ ] En Transacciones, toca el botón **papelera** 🗑️
- [ ] Aparece un modal pidiendo confirmación
- [ ] Toca "Eliminar"
- [ ] Aparece "Transacción eliminada correctamente"
- [ ] La transacción desaparece de la lista ✅
- [ ] Dashboard se actualiza ✅

### Crear Categoría

- [ ] Ve a la pestaña "Categorías"
- [ ] Toca el botón (+)
- [ ] Crea una categoría nueva llamada "TestCat"
- [ ] Selecciona tipo "Expense"
- [ ] Toca "Guardar"
- [ ] Verás "TestCat" en la lista ✅

### Cascade Delete (La Prueba Final)

- [ ] En Transacciones, crea 2 transacciones con la categoría "TestCat"
- [ ] Ve a Categorías
- [ ] Toca el botón eliminar de "TestCat"
- [ ] **Importante**: Debe aparecer un modal diciendo:
  ```
  "Se eliminarán 2 transacción(es)"
  ```
- [ ] Toca "Eliminar"
- [ ] Aparece: "Se eliminaron 2 transacción(es)" ✅
- [ ] "TestCat" desaparece de Categorías ✅
- [ ] Las 2 transacciones desaparecen de Transacciones ✅
- [ ] Dashboard se actualiza ✅

### Verificar Sincronización Global

- [ ] Crea una transacción
- [ ] Verifica que aparece en Transacciones
- [ ] Verifica que Dashboard se actualiza
- [ ] Edita la transacción
- [ ] Verifica que el cambio se refleja en ambas pantallas
- [ ] Elimina la transacción
- [ ] Verifica que desaparece de ambas pantallas

---

## 🎉 SI TODO FUNCIONA CORRECTAMENTE:

```
✅ Transacciones: CRUD 100% funcional
✅ Categorías: CRUD + Cascade Delete funcional
✅ Sincronización: Global y automática
✅ Interfaz: Intuitiva y responsiva
✅ Sin Crashes: 0 errores

= LISTO PARA APK LIMPIO =
```

---

## 🚀 PASO 3: GENERAR APK LIMPIO (Sin Datos de Prueba)

### Paso 1: Cambiar seed.ts para APK Limpio

Abre este archivo:

```
c:\Users\Matias\Desktop\Finance\finance-mobile\src\db\seed.ts
```

**Línea 5**, cambia:

```typescript
const LOAD_SAMPLE_DATA = true; // ← CAMBIAR ESTO
```

A:

```typescript
const LOAD_SAMPLE_DATA = false; // ✅ LISTO PARA APK LIMPIO
```

**Guarda el archivo** (Ctrl+S)

---

### Paso 2: Generar el APK

En la terminal, ejecuta:

```bash
cd c:\Users\Matias\Desktop\Finance\finance-mobile

# Espera a que EAS esté autenticado o inicia sesión
eas build --platform android --profile preview
```

**Esto tomará 5-10 minutos...**

Esperado:

```
✓ Building...
✓ Uploading...
✓ Build complete!

Download URL: https://...
```

---

### Paso 3: Descargar e Instalar APK

1. El APK se descargará automáticamente
2. **O** usa el link que te da EAS en la consola
3. **En Windows**:
   - Copia el APK a la carpeta de descargas del móvil
   - Abre el APK desde el administrador de archivos
   - Toca "Instalar"

---

## 📋 RESUMEN RÁPIDO

| Paso | Acción          | Comando                                          |
| ---- | --------------- | ------------------------------------------------ |
| 1️⃣   | Iniciar Expo    | `npm start`                                      |
| 2️⃣   | Escanear QR     | Expo Go → Scan QR                                |
| 3️⃣   | Probar          | Sigue checklist arriba ☝️                        |
| 4️⃣   | Cambiar seed.ts | `LOAD_SAMPLE_DATA = false`                       |
| 5️⃣   | Generar APK     | `eas build --platform android --profile preview` |
| 6️⃣   | Instalar        | Descarga APK e instala en Android                |

---

## ⚠️ SI ALGO FALLA

### "La app no carga en Expo Go"

```bash
npm start -- --reset-cache
# Limpia caché y reinicia
```

### "Los botones editar/eliminar no aparecen"

- Cierra Expo Go completamente
- Vuelve a escanear el QR
- Si persiste, revisa que TransactionsScreen.tsx tiene los botones

### "Cascade delete no funciona"

- Verifica que categoría tiene transacciones asociadas
- El modal debe mostrar "Se eliminarán X transacción(es)"

### "Cambios no se reflejan en Dashboard"

- Verifica que triggerRefresh() se está llamando
- Revisa los logs en la terminal

---

## 🔄 FLUJO COMPLETO VISUAL

```
START
  │
  ├─→ npm start
  │     │
  │     └─→ Código QR en terminal
  │
  ├─→ Expo Go: Scan QR
  │     │
  │     └─→ App carga
  │
  ├─→ TESTING CHECKLIST ✅
  │     ├─ Crear transacción ✅
  │     ├─ Editar transacción ✅
  │     ├─ Eliminar transacción ✅
  │     ├─ Crear categoría ✅
  │     ├─ Cascade delete ✅
  │     └─ Sincronización global ✅
  │
  ├─→ Cambiar LOAD_SAMPLE_DATA = false
  │
  ├─→ eas build --platform android --profile preview
  │     │
  │     └─→ Compila en la nube (5-10 min)
  │
  ├─→ Descarga APK
  │
  ├─→ Instala en Android
  │
  └─→ ✅ APK LIMPIO LISTO PARA USAR
```

---

## 📞 NOTAS IMPORTANTES

### Antes de generar APK:

- ✅ Debe funcionar 100% en Expo Go
- ✅ LOAD_SAMPLE_DATA debe ser `false`
- ✅ Sin datos de prueba en el APK
- ✅ Solo categorías vacías
- ✅ Listo para usuarios reales

### Requisitos para generar APK:

- ✅ Conexión a internet
- ✅ Cuenta Expo (gratuita)
- ✅ `eas` instalado (`npm install -g eas-cli`)

### APK resultante:

- ✅ BD completamente limpia
- ✅ 10 categorías predefinidas
- ✅ 0 transacciones iniciales
- ✅ Balance inicial: $0.00
- ✅ Listo para que el usuario agregue sus datos

---

## ✨ RESULTADO FINAL

Cuando termines, tendrás:

📱 **APK Limpio** (`app-release.apk`)

```
Tamaño: ~50-100 MB
Versión: 1.0.0
Sin datos de prueba
Listo para producción
```

✅ **Funcionalidades Incluidas**:

- ✅ Crear transacciones
- ✅ Editar transacciones
- ✅ Eliminar transacciones
- ✅ Crear categorías
- ✅ Eliminar categorías (cascade delete)
- ✅ Dashboard con resumen
- ✅ Sincronización global en tiempo real
- ✅ Offline-first (no necesita internet)

---

## 🎊 ¡LISTO!

Sigue estos pasos y tendrás tu APK listo en aproximadamente **30 minutos**.

```
Tiempo estimado:
- Testing en Expo: 5-10 min
- Compilación APK: 5-10 min
- Descarga e instalación: 5 min
= 15-25 minutos total
```

**¡Éxito! 🚀**

---

**Versión**: 1.0.0  
**Estado**: Listo para generar APK  
**Próximo**: Seguir los pasos arriba ☝️
