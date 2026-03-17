# 🔍 Debugging y Tips - React Native Expo

## 📊 Ver Logs en Tiempo Real

### Terminal de Expo

```bash
npm start

# Todos los logs aparecen aquí en tiempo real
# Errores → Rojo
# Advertencias → Amarillo
# Info → Gris
```

### DevTools en el Teléfono

```
1. Toca la pantalla 5 veces rápido OR sacude el teléfono
2. Aparecerá un menú → "Show Developer Menu"
3. Toca "Debug Remote JS"
```

---

## 🛑 Errores Comunes

### 1. "TypeError: Cannot read property 'data' of undefined"

**Causa:** La API retorna undefined

```typescript
// ❌ Malo
const res = await api.get("/endpoint");
setData(res.data); // Puede ser undefined

// ✅ Bueno
const res = await api.get("/endpoint");
if (res.data) {
  setData(res.data);
}
```

### 2. "Network request failed"

**Causa:** El backend no responde

**Solución:**

```bash
# 1. Verifica backend corriendo
cd personal-finance-api
npm run start:dev

# 2. Verifica la IP en src/lib/axios.ts
# 3. Si usas emulador, intenta:
# const API_BASE_URL = "http://10.0.2.2:4000";
```

### 3. "Each child in a list should have a unique 'key' prop"

**Causa:** Map sin key

```typescript
// ❌ Malo
{data.map((item) => (
  <Card>{item.name}</Card>
))}

// ✅ Bueno
{data.map((item) => (
  <Card key={item.id}>{item.name}</Card>
))}
```

### 4. "View config getter callback for component 'RCTButton' not found"

**Causa:** Componente web usado en React Native

```typescript
// ❌ Malo
<button onClick={() => {}}>Click</button>

// ✅ Bueno
<Pressable onPress={() => {}}>
  <Text>Click</Text>
</Pressable>
```

### 5. "Cannot destructure property 'navigation' of 'undefined'"

**Causa:** Pantalla no está dentro del navigator

**Solución:** Asegúrate que está en `NavigationStack.tsx`

---

## 🎯 Debug Tips

### Usar console.log

```typescript
import { useEffect } from 'react';

export const MyScreen = () => {
  useEffect(() => {
    console.log('Screen mounted'); // Aparecerá en Expo logs
    console.log('Data:', data);
  }, [data]);

  return <View>...</View>;
};
```

### Usar React DevTools

```bash
# Instala la extensión de Chrome
# (Opcional, para web/emulador)

npm install --global react-devtools-core

# En otra terminal
react-devtools
```

### Inspecionar Red (Network)

```typescript
// En src/lib/axios.ts, agrega logging:

api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.config?.url, error.response?.data);
    return Promise.reject(error);
  },
);
```

---

## 📱 Debug en Diferentes Plataformas

### Emulador Android

```bash
# Abre Developer Menu
# Presiona Ctrl+M (Windows) o Cmd+D (Mac)
# o sacude el emulador
```

### Teléfono Real

```bash
# Sacude el teléfono
# Aparecerá "Developer Menu"
# Selecciona "Debug Remote JS"
```

---

## ⚡ Performance Profiling

### Encontrar bottlenecks

```bash
npm start

# En DevMenu → Enable Performance Monitor
# Verás FPS en tiempo real
```

### Optimizar renders

```typescript
// ❌ Malo - se renderiza todo el tiempo
const TransactionList = ({ transactions }) => {
  return transactions.map(t => <Card key={t.id}>{t.name}</Card>);
};

// ✅ Bueno - usa useMemo
const TransactionList = ({ transactions }) => {
  const memoizedList = useMemo(
    () => transactions.map(t => <Card key={t.id}>{t.name}</Card>),
    [transactions]
  );
  return memoizedList;
};
```

---

## 🔒 Seguridad en Desarrollo

### No guardes credenciales en el código

```typescript
// ❌ Malo
const API_BASE_URL = "http://192.168.1.100:4000"; // Visible en git

// ✅ Bueno
import * as Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || "http://192.168.1.100:4000";
```

### Variables de Entorno

```bash
# Crear .env (no guardar en git)
API_URL=http://192.168.1.100:4000
```

```typescript
// Usar en app.json
{
  "expo": {
    "extra": {
      "apiUrl": process.env.API_URL
    }
  }
}
```

---

## 📦 Debugging Dependencias

### Ver qué pasa con una librería

```bash
# Reinstalar limpio
rm -rf node_modules package-lock.json
npm install

# Ver árbol de dependencias
npm list

# Ver si hay vulnerabilidades
npm audit
```

---

## 🎬 Grabar Sesión de Debug

```bash
# En la terminal de Expo
# Presiona:
# d = Abrir DevTools
# Aquí puedes:
# - Ver console.log
# - Inspeccionar red
# - Ver React components
# - Profiling
```

---

## ✅ Checklist de Debug

- [ ] ¿Backend corre en npm run start:dev?
- [ ] ¿IP correcta en axios.ts?
- [ ] ¿Teléfono en misma WiFi?
- [ ] ¿Logs aparecen en Expo?
- [ ] ¿Red tab muestra requests?
- [ ] ¿React DevTools abierto?

---

## 🚀 Producción Debug

### Build APK para testing

```bash
eas build --platform android --local
```

### Ver logs del APK

```bash
adb logcat | grep "finance"
```

---

## 📞 Soporte

- Revisa **[GUIA_DESARROLLO.md](GUIA_DESARROLLO.md)**
- Revisa **[CONFIGURACION_RAPIDA.md](CONFIGURACION_RAPIDA.md)**
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
