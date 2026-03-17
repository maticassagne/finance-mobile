# 🔧 Configuración Rápida - Finance App Mobile

## Paso 1: Obtén tu IP Local

### Windows (CMD o PowerShell):

```
ipconfig
```

Busca la línea que dice **"IPv4 Address"** algo como: `192.168.1.100`

### Mac/Linux:

```bash
hostname -I
# o
ifconfig | grep "inet "
```

## Paso 2: Actualiza la Configuración

Abre este archivo: **`src/lib/axios.ts`**

Cambia esta línea:

```typescript
const API_BASE_URL = "http://192.168.1.100:4000"; // ← TU IP AQUÍ
```

**Ejemplo**: Si tu IP es `192.168.0.50`, déjalo así:

```typescript
const API_BASE_URL = "http://192.168.0.50:4000";
```

## Paso 3: Asegúrate que el Backend corre

En otra terminal/CMD:

```bash
cd personal-finance-api
npm run start:dev
```

Deberías ver:

```
[Nest] 1234  - 02/04/2026, 22:58:12     LOG [NestFactory] Starting Nest application...
[Nest] 1234  - 02/04/2026, 22:58:13     LOG [InstanceLoader] AppModule dependencies initialized
...
[Nest] 1234  - 02/04/2026, 22:58:14     LOG [NestApplication] Nest application successfully started on port 4000
```

## Paso 4: Inicia la App

```bash
cd finance-mobile
npm start
```

Verás opciones:

```
 › Press 'a' to open Android emulator
 › Press 'i' to open iOS simulator
 › Press 'w' to open web
```

**Presiona `a`** para abrir Android

---

## ⚡ Tips Rápidos

### Si usas Emulador Android:

A veces `192.168.x.x` no funciona, intenta:

```typescript
const API_BASE_URL = "http://10.0.2.2:4000"; // Redirect de emulador
```

### Si usas Teléfono Real:

Asegúrate que teléfono y PC **están en la misma WiFi**.

### Ver Logs:

```bash
# En la terminal donde corre la app
npm start

# Los errores aparecen en rojo
```

### Recargar App:

En la terminal: presiona `r`

---

## ✅ Checklist Inicial

- [ ] Backend corriendo en `npm run start:dev`
- [ ] IP actualizada en `src/lib/axios.ts`
- [ ] PC y teléfono en misma WiFi (si usas teléfono real)
- [ ] Emulador Android abierto (si usas emulador)
- [ ] `npm start` en finance-mobile
- [ ] Presionaste `a` para abrir Android

¡Listo! La app debería cargar sin errores. 🚀
