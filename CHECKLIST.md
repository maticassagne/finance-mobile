# ✅ Checklist de Setup - Finance Tracker Mobile

## 🚀 Antes de Empezar

Usa esta lista para asegurar que todo esté configurado correctamente.

---

## 1️⃣ Configuración Inicial

- [ ] Leí [RESUMEN_SETUP.md](RESUMEN_SETUP.md)
- [ ] Leí [CONFIGURACION_RAPIDA.md](CONFIGURACION_RAPIDA.md)
- [ ] Tengo Node.js instalado (`node -v` en terminal)
- [ ] Tengo npm instalado (`npm -v` en terminal)

---

## 2️⃣ Configurar Backend

- [ ] Backend NestJS está en `personal-finance-api/`
- [ ] Ejecuté `npm install` en el backend
- [ ] El backend corre con: `npm run start:dev`
- [ ] Backend responde en: `http://localhost:4000`
- [ ] Ver: Debería ver "Nest application successfully started on port 4000"

---

## 3️⃣ Configurar IP Local

- [ ] Obtuve mi IP local:
  - Windows: `ipconfig` (buscar "IPv4 Address")
  - Mac/Linux: `hostname -I`

Mi IP es: `_______________` (ej: 192.168.1.100)

- [ ] Abrí: `finance-mobile/src/lib/axios.ts`
- [ ] Cambié la línea:
  ```typescript
  const API_BASE_URL = "http://MI_IP:4000"; // ← Cambié aquí
  ```
- [ ] Guardé el archivo

---

## 4️⃣ Configurar Dependencias

- [ ] Estoy en carpeta: `finance-mobile/`
- [ ] Ejecuté: `npm install`
- [ ] Vi: "added XXX packages" (sin errores)

---

## 5️⃣ Configurar Emulador Android

**Opción A: Usar Expo Go (Más fácil)**

- [ ] Descargué "Expo Go" en Play Store
- [ ] Descargué la app en mi teléfono real

**Opción B: Usar Android Emulator**

- [ ] Tengo Android Studio instalado
- [ ] Creé un AVD (Android Virtual Device)
- [ ] El emulador abre sin problemas

---

## 6️⃣ Probar Conexión

- [ ] Backend corre: `npm run start:dev` ✅
- [ ] Ejecuté en `finance-mobile/`: `npm start`
- [ ] Vi el código QR o el menú de opciones
- [ ] Presioné `a` para abrir Android
- [ ] La app cargó sin errores

---

## 7️⃣ Verificar que Funciona

En la app, debería ver:

Dashboard:

- [ ] 3 tarjetas de stats (Ingresos, Gastos, Balance)
- [ ] Listado de transacciones (o "Sin transacciones")
- [ ] Los números NO están en 0 (significa que el API responde)

Transacciones:

- [ ] Listado de transacciones (si existen)
- [ ] Botón flotante (+) verde
- [ ] Icono de tipo (+ para ingresos, - para gastos)

Categorías:

- [ ] Listado de categorías
- [ ] Agrupadas por Ingresos/Gastos
- [ ] Botón para eliminar
- [ ] Botón flotante (+) verde

---

## 8️⃣ Troubleshooting Rápido

Si algo NO funciona:

### "No puedo conectar al API"

- [ ] Verifica que backend está corriendo en `npm run start:dev`
- [ ] Verifica IP en `src/lib/axios.ts`
- [ ] Si usas emulador, intenta cambiar a: `http://10.0.2.2:4000`
- [ ] Ver: [CONFIGURACION_RAPIDA.md](CONFIGURACION_RAPIDA.md)

### "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### "La app se cierra"

- [ ] Ver los logs en rojo en la terminal de Expo
- [ ] Presiona `d` en la terminal para abrir DevTools
- [ ] Ver: [DEBUGGING.md](DEBUGGING.md)

### "Emulador muy lento"

- [ ] En Android Studio: AVD Manager
- [ ] Edita el emulador → Graphics → Selecciona "GPU"

---

## 9️⃣ Documentación de Referencia

Si necesitas ayuda, consulta:

| Documento                                          | Cuándo usarlo               |
| -------------------------------------------------- | --------------------------- |
| [RESUMEN_SETUP.md](RESUMEN_SETUP.md)               | Visión general del proyecto |
| [CONFIGURACION_RAPIDA.md](CONFIGURACION_RAPIDA.md) | Setup inicial rápido        |
| [GUIA_DESARROLLO.md](GUIA_DESARROLLO.md)           | Cómo desarrollar            |
| [DEBUGGING.md](DEBUGGING.md)                       | Errores y soluciones        |
| [EJEMPLOS_CODIGO.md](EJEMPLOS_CODIGO.md)           | Ejemplos de código          |
| [README_MOBILE.md](README_MOBILE.md)               | Overview proyecto           |

---

## 🔟 Próximas Acciones

### Próxima Semana - Fase 1

- [ ] Crear pantalla para agregar transacciones
- [ ] Crear pantalla para agregar categorías
- [ ] Agregar filtro de fechas avanzado
- [ ] Testing en teléfono real

### Próximas Semanas - Fase 2

- [ ] Agregar gráficos (victory-native)
- [ ] Agregar autenticación JWT
- [ ] Storage offline (sincronización)
- [ ] Push notifications

### Próximas Semanas - Fase 3

- [ ] Build APK para producción
- [ ] Publicar en Play Store
- [ ] Agregar más idiomas (i18n)

---

## 🎯 Resumen de Comandos Esenciales

```bash
# Terminal 1: Backend
cd personal-finance-api
npm run start:dev

# Terminal 2: Frontend Mobile
cd finance-mobile
npm start

# En la app:
# a = Abrir Android
# r = Recargar app
# c = Clear cache + recargar
# d = DevTools
# q = Quit
```

---

## ✨ Una Vez Todo Funcione

Puedes empezar a:

- Modificar componentes en `src/components/`
- Crear nuevas pantallas en `src/screens/`
- Agregar nuevos hooks en `src/hooks/`
- Cambiar estilos en los `StyleSheet.create()`

¡El hot reload (Fast Refresh) actualizará todo automáticamente!

---

## 📞 ¿Necesitas Ayuda?

1. Revisa los logs rojos en la terminal
2. Busca en [DEBUGGING.md](DEBUGGING.md)
3. Revisa [GUIA_DESARROLLO.md](GUIA_DESARROLLO.md)
4. Abre DevTools con `d` en la terminal

---

**¡Felicitaciones!** Tu setup está 100% listo. 🎉

Siguiente paso: **[CONFIGURACION_RAPIDA.md](CONFIGURACION_RAPIDA.md)**
