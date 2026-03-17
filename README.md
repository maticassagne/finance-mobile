# 🎉 Finance Tracker Mobile - Listo para Desarrollar

> App de finanzas personales en **React Native + Expo** para Android

[![Status](https://img.shields.io/badge/Status-Ready%20to%20Dev-green.svg)](https://github.com)
[![Stack](https://img.shields.io/badge/Stack-React%20Native%20%2B%20Expo-blue.svg)](https://reactnative.dev)
[![Backend](https://img.shields.io/badge/Backend-NestJS-red.svg)](https://nestjs.com)

---

## 🚀 Comienza Aquí

Tu aplicación Android está **100% configurada** y lista para desarrollar.

### ⚡ Setup en 3 pasos (5 minutos)

1. **Abre** `src/lib/axios.ts` y cambia tu IP:

   ```typescript
   const API_BASE_URL = "http://TU_IP:4000"; // ← Cambiar aquí
   ```

   📖 Ver: [CONFIGURACION_RAPIDA.md](CONFIGURACION_RAPIDA.md)

2. **Inicia el Backend** (Terminal 1):

   ```bash
   cd personal-finance-api
   npm run start:dev
   ```

3. **Inicia la App** (Terminal 2):
   ```bash
   cd finance-mobile
   npm start
   # Presiona 'a' para Android
   ```

✅ **¡Listo!** La app debería cargar sin errores.

---

## 📚 Documentación

| Documento                                              | Descripción           |
| ------------------------------------------------------ | --------------------- |
| **[CONFIGURACION_RAPIDA.md](CONFIGURACION_RAPIDA.md)** | Setup en 5 minutos ⭐ |
| **[RESUMEN_VISUAL.txt](RESUMEN_VISUAL.txt)**           | Visión visual general |
| **[RESUMEN_SETUP.md](RESUMEN_SETUP.md)**               | Qué se creó           |
| **[GUIA_DESARROLLO.md](GUIA_DESARROLLO.md)**           | Cómo desarrollar      |
| **[DEBUGGING.md](DEBUGGING.md)**                       | Troubleshooting       |
| **[EJEMPLOS_CODIGO.md](EJEMPLOS_CODIGO.md)**           | Code snippets         |
| **[CHECKLIST.md](CHECKLIST.md)**                       | Lista de verificación |

---

## 📁 Estructura del Proyecto

```
finance-mobile/
├── src/
│   ├── lib/           # Cliente HTTP (axios)
│   ├── types/         # Tipos TypeScript
│   ├── hooks/         # Custom hooks (data fetching)
│   ├── components/    # Componentes UI reutilizables
│   ├── screens/       # Pantallas de la app
│   └── navigation/    # Navegación (Bottom Tabs)
├── app/
│   └── _layout.tsx    # App root
└── [documentación]
```

---

## 🎯 Características

✅ Dashboard con resumen de finanzas  
✅ Listado de transacciones  
✅ Gestión de categorías  
✅ Crear/Editar transacciones  
✅ Sincronización con backend NestJS  
✅ UI nativa optimizada para móvil  
✅ TypeScript en todo el código

---

## 🏗️ Stack Tecnológico

```
Frontend Mobile:
├── React Native      (Framework móvil)
├── Expo             (Herramienta desarrollo)
├── TypeScript       (Tipado)
├── React Navigation (Navegación)
├── Axios            (HTTP)
└── Date-fns         (Fechas)

Backend:
└── NestJS           (API REST)
```

---

## 🎬 Pantallas Implementadas

### 1. 📊 Dashboard

- Resumen de ingresos/gastos/balance
- Últimas 5 transacciones
- Stats en tarjetas

### 2. 💳 Transacciones

- Listado completo
- Filtro por fecha
- Ícono por tipo
- Botón para crear

### 3. 🏷️ Categorías

- Listado agrupado
- Opción eliminar
- Botón para crear

---

## 🔥 Comandos Esenciales

```bash
# Desarrollo
npm start              # Inicia servidor Expo

# En la terminal Expo:
# a = Android Emulator
# r = Recargar app
# c = Clear cache + reload
# d = DevTools
# q = Quit

# Build APK
npm install -g eas-cli
eas build --platform android --local
```

---

## ⚠️ Puntos Importantes

1. **IP Local**: CAMBIAR en `src/lib/axios.ts`
2. **Backend**: Debe correr en `npm run start:dev`
3. **WiFi**: Teléfono real debe estar en misma WiFi
4. **Emulador**: Si no funciona con IP, usar `10.0.2.2:4000`

---

## 🐛 ¿Algo No Funciona?

### "Cannot connect to API"

```
1. ¿Backend corriendo? npm run start:dev
2. ¿IP correcta? Cambiar en src/lib/axios.ts
3. ¿Misma WiFi? Teléfono + PC
```

### "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### Ver soluciones completas:

👉 [DEBUGGING.md](DEBUGGING.md)

---

## 📖 Cómo Desarrollar

### Crear Nueva Pantalla

```typescript
// src/screens/MiPantalla.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../components';

const MiPantalla = () => {
  return (
    <View>
      <Card>
        <Text>Hola desde mi pantalla</Text>
      </Card>
    </View>
  );
};

export default MiPantalla;
```

Luego agregar en `src/navigation/NavigationStack.tsx`

👉 Ver más: [EJEMPLOS_CODIGO.md](EJEMPLOS_CODIGO.md)

---

## 🔐 Seguridad

✅ Tokens en `expo-secure-store` (encrypted)  
✅ Interceptores Axios  
✅ Validación de formularios  
✅ Error handling

---

## 📊 Próximos Pasos

```
Inmediato:
├─ Cambiar IP en axios.ts
└─ npm start + presionar 'a'

Próxima Semana:
├─ Crear transacciones
├─ Crear categorías
└─ Testing en teléfono

Próximas Semanas:
├─ Gráficos (victory-native)
├─ Autenticación JWT
├─ Sincronización offline
└─ Build APK producción
```

---

## 💬 ¿Dudas?

**Lee primero:** [CONFIGURACION_RAPIDA.md](CONFIGURACION_RAPIDA.md) (5 min)

Si persisten, revisa:

- [GUIA_DESARROLLO.md](GUIA_DESARROLLO.md) - Documentación completa
- [DEBUGGING.md](DEBUGGING.md) - Troubleshooting
- [EJEMPLOS_CODIGO.md](EJEMPLOS_CODIGO.md) - Ejemplos

---

## 📝 Estructura de Ficheros

```
finance-mobile/
├── 📖 CONFIGURACION_RAPIDA.md   ← START HERE
├── 📖 RESUMEN_VISUAL.txt
├── 📖 RESUMEN_SETUP.md
├── 📖 GUIA_DESARROLLO.md
├── 📖 DEBUGGING.md
├── 📖 EJEMPLOS_CODIGO.md
├── 📖 CHECKLIST.md
├── 📖 README_MOBILE.md
│
├── src/
│   ├── lib/axios.ts              ← CAMBIAR IP AQUÍ
│   ├── types/index.ts
│   ├── hooks/
│   ├── components/
│   ├── screens/
│   └── navigation/
│
├── app/_layout.tsx
├── package.json
└── app.json
```

---

## 🎓 Aprendiste

- ✅ React Native basics
- ✅ Expo workflow
- ✅ TypeScript en móvil
- ✅ React Navigation
- ✅ HTTP requests con Axios
- ✅ Custom hooks
- ✅ StyleSheet nativo

---

## 🚀 Status

```
✅ Proyecto creado
✅ Dependencias instaladas
✅ Estructura configurada
✅ Componentes creados
✅ Pantallas implementadas
✅ Navegación lista
✅ Backend integrado
✅ Documentación completa

→ LISTO PARA DESARROLLAR
```

---

**Siguiente paso:** 👉 [CONFIGURACION_RAPIDA.md](CONFIGURACION_RAPIDA.md)

---

<div align="center">

🎉 **¡Tu app móvil está lista!** 🎉

Made with ❤️ for Finance Tracker

</div>

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
