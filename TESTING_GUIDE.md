# 🧪 GUÍA DE TESTING - Finance Tracker v1.0.0

## ✅ Testing en Expo Go

### Paso 1: Conectar Dispositivo

1. Abre la app **Expo Go** en tu Android
2. En la terminal, verás un código QR
3. Escanea el código con tu dispositivo
4. La app cargará automáticamente

### Paso 2: Probar Funcionalidades Básicas

#### Dashboard

- [ ] Se carga correctamente
- [ ] Muestra balance total
- [ ] Muestra ingresos y egresos
- [ ] Muestra últimas transacciones
- [ ] FAB (+) funciona

#### Transacciones

- [ ] Se carga la lista
- [ ] Se ven todas las transacciones
- [ ] Botón lápiz (editar) ✏️ visible
- [ ] Botón papelera (eliminar) 🗑️ visible

#### Crear Transacción

- [ ] Toca FAB (+)
- [ ] Abre CreateTransactionScreen ✅
- [ ] Completa formulario ✅
- [ ] Toca Guardar ✅
- [ ] Vuelve a TransactionsScreen ✅
- [ ] Nueva transacción aparece en la lista ✅
- [ ] Dashboard se actualiza ✅

#### Editar Transacción

- [ ] Toca lápiz en transacción ✏️
- [ ] Abre EditTransactionScreen ✅
- [ ] Formulario está pre-rellenado ✅
- [ ] Modifica un campo (ej: monto) ✅
- [ ] Toca Guardar ✅
- [ ] Vuelve a TransactionsScreen ✅
- [ ] El cambio se refleja en la lista ✅
- [ ] Dashboard se actualiza ✅

#### Eliminar Transacción

- [ ] Toca papelera 🗑️
- [ ] Aparece confirmación modal ✅
- [ ] Toca Eliminar ✅
- [ ] Aparece alert de éxito ✅
- [ ] Transacción desaparece de la lista ✅
- [ ] Dashboard se actualiza ✅

#### Categorías

- [ ] Se carga la lista
- [ ] Categorías separadas por tipo ✅
- [ ] Botón eliminar visible

#### Crear Categoría

- [ ] Toca FAB (+)
- [ ] Abre CreateCategoryScreen ✅
- [ ] Completa nombre ✅
- [ ] Selecciona tipo (income/expense) ✅
- [ ] Toca Guardar ✅
- [ ] Nueva categoría aparece en la lista ✅

#### Eliminar Categoría con Cascade

- [ ] Crea una categoría nueva "TestCat"
- [ ] Crea 2 transacciones con "TestCat"
- [ ] Ve a Categorías
- [ ] Toca eliminar en "TestCat" ✅
- [ ] Modal muestra "Se eliminarán 2 transacción(es)" ✅
- [ ] Confirma ✅
- [ ] Modal de éxito muestra "Se eliminaron 2" ✅
- [ ] "TestCat" desaparece de Categorías ✅
- [ ] Las 2 transacciones desaparecen de Transacciones ✅
- [ ] Dashboard se actualiza ✅

#### Navegación

- [ ] Tabs en la parte inferior funcionan
- [ ] Puedes ir entre Dashboard → Transacciones → Categorías
- [ ] Estado se mantiene al cambiar de tab
- [ ] Volver y adelantar funciona

### Paso 3: Validar Sincronización Global

Crea una transacción y verifica que:

- [ ] Aparece en TransactionsScreen ✅
- [ ] Aparece en DashboardScreen ✅
- [ ] Los totales del Dashboard se actualizan ✅

Edita una transacción y verifica que:

- [ ] El cambio aparece en TransactionsScreen ✅
- [ ] El Dashboard se actualiza ✅

Elimina una transacción y verifica que:

- [ ] Desaparece de TransactionsScreen ✅
- [ ] Desaparece de DashboardScreen ✅
- [ ] Los totales se actualizan ✅

---

## ✨ Funcionalidades Críticas a Validar

### ✅ CRUD Transacciones

- [x] Create: Crea sin errores
- [x] Read: Muestra en lista
- [x] Update: Edita y refleja cambios
- [x] Delete: Elimina con confirmación

### ✅ CRUD Categorías

- [x] Create: Crea sin duplicados
- [x] Read: Muestra en lista
- [x] Delete: Elimina categoría + transacciones

### ✅ Sincronización

- [x] Global refresh context funciona
- [x] Todas las pantallas se actualizan
- [x] Sin inconsistencias de datos

### ✅ Offline

- [x] App funciona sin internet
- [x] Datos persisten en SQLite
- [x] Sin llamadas API

---

## 🎯 Posibles Problemas y Soluciones

### Problema: La app no carga

**Solución:**

```bash
npm start -- --reset-cache
```

### Problema: Botones no aparecen

**Solución:**

- Cierra Expo Go completamente
- Vuelve a escanear el QR
- Si persiste, verifica TransactionsScreen.tsx tiene los botones

### Problema: Cambios no se reflejan

**Solución:**

- Verifica que triggerRefresh() se está llamando
- Revisa los logs de la terminal
- Reinicia Expo Go

### Problema: Datos no persisten

**Solución:**

- Verifica que SQLite está inicializado
- Revisa app/\_layout.tsx llama initializeDatabase()

---

## 📝 Checklist de Validación Completa

Marca estos items mientras pruebas:

```
DASHBOARD:
  ☐ Carga correctamente
  ☐ Muestra balance
  ☐ FAB funciona

TRANSACCIONES:
  ☐ Lista carga
  ☐ Botones visibles
  ☐ Create funciona
  ☐ Edit funciona
  ☐ Delete funciona

CATEGORÍAS:
  ☐ Lista carga
  ☐ Create funciona
  ☐ Delete con cascade funciona

SINCRONIZACIÓN:
  ☐ Dashboard se actualiza
  ☐ Transacciones se actualizan
  ☐ Categorías se actualizan
  ☐ Sin inconsistencias

OFFLINE:
  ☐ Sin conexión a internet
  ☐ Todo funciona igual
  ☐ Datos persisten

ERRORES:
  ☐ 0 crashes
  ☐ 0 mensajes de error
  ☐ Console limpia
```

---

## ✅ LISTO PARA GENERAR APK

Si todos los tests pasan, la app está lista para:

```bash
eas build --platform android --profile preview
```

Esto generará un APK que puedes instalar directamente en Android.

---

**Versión**: 1.0.0  
**Status**: Listo para testing  
**Próximo**: Generar APK si todo funciona
