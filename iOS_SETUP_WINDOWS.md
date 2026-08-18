# iOS Setup Guide - Windows Users

## 🚨 El Problema: "No usable Data Found"

Este error ocurre cuando intentas usar Expo Go en iPhone desde Windows y hay problemas con:
- La conexión red
- El QR code expirado
- Configuración de Expo
- Los plugins no están compilados correctamente

---

## ✅ Solución 1: Usar Tunnel Mode (Recomendado - Más Fácil)

El **Tunnel Mode** es la forma más confiable de conectar desde Windows a iPhone:

### Paso 1: Instalar desarrollo cliente de Expo

```powershell
cd "c:\Users\migue\OneDrive\Documents\Riwi\Cerca"

# Limpiar caché
npx expo prebuild --clean

# Construir desarrollo cliente
eas build --platform ios --profile development
```

Esto creará un `.ipa` que puedes instalar en tu iPhone.

### Paso 2: Usar Tunnel Mode con desarrollo

```powershell
npm run dev -- --tunnel
```

O:

```powershell
npx expo start --tunnel
```

Esto:
- Crea un túnel seguro entre tu PC e iPhone
- No necesita estar en la misma red Wi-Fi
- QR code válido por más tiempo
- Más estable que LAN mode

### Paso 3: Conectar iPhone

1. Abre **Expo Go** en tu iPhone
2. Toca el **+** (Plus sign)
3. Ingresa tu **dirección de correo de Expo** (o escanea QR)
4. La app debería cargar

---

## ✅ Solución 2: Usar EAS Build (Cloud Build)

La forma más oficial y recomendada:

### Paso 1: Instalar EAS CLI

```powershell
npm install -g eas-cli
```

### Paso 2: Hacer login en Expo

```powershell
eas login
```

### Paso 3: Crear build para iOS

```powershell
cd "c:\Users\migue\OneDrive\Documents\Riwi\Cerca"

# Hacer build en cloud
eas build --platform ios --profile development
```

### Paso 4: Instalar en iPhone

- Espera a que el build termine
- Recibirás un link a un QR o link directo
- Abre en Safari en tu iPhone
- Toca "Install"

**Ventajas:**
- No necesitas Mac
- Build confiable
- Funciona para testing
- App TestFlight para distribución

---

## ✅ Solución 3: LAN Mode (Si está en misma red)

```powershell
npm run dev -- --lan
```

**Requisitos:**
- iPhone y PC en **la misma red Wi-Fi**
- Sin VPN en la red
- IP local accesible entre dispositivos

---

## 🔧 Troubleshooting Adicional

### 1. Limpiar caché completo

```powershell
# Borrar caché de Expo
Remove-Item -Recurse -Force $env:USERPROFILE\.expo
Remove-Item -Recurse -Force $env:USERPROFILE\.cache\expo

# Borrar node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Reinstalar
npm install
```

### 2. Actualizar dependencias

```powershell
npm update
npm update expo@latest
```

### 3. Verificar configuración de app.json

Asegúrate que `app.json` sea válido:

```json
{
  "expo": {
    "name": "Cerca",
    "slug": "cerca",
    "version": "1.0.0",
    "scheme": "cerca",
    "ios": {
      "bundleIdentifier": "com.lolaso981.cerca"
    },
    "android": {
      "package": "com.lolaso981.cerca"
    },
    "owner": "lolaso981"
  }
}
```

### 4. Validar app.json

```powershell
npx expo config
```

---

## 🚀 Workflow Recomendado

### Para Desarrollo Rápido (Expo Go + Tunnel):

```powershell
# Terminal 1
npm run dev -- --tunnel

# En iPhone:
# 1. Abre Expo Go
# 2. Escanea QR o ingresa email
# 3. La app carga
```

### Para Testing Serio (EAS Build):

```powershell
# Primer build (tarda ~5-10 minutos)
eas build --platform ios --profile development

# En iPhone:
# Abre el link o escanea QR
# Instala la app
# Para subsecuentes cambios, usa Tunnel Mode
```

### Para Android + iOS Simultáneo:

```powershell
# Terminal 1: Dev server
npm run dev -- --tunnel

# Terminal 2: Android (si lo tienes configurado)
npm run android

# iPhone: Expo Go + Tunnel
# Android: Expo App + QR scan
```

---

## 📋 Checklist iOS Windows

- [ ] Expo CLI instalado: `npm install -g eas-cli`
- [ ] Eas login ejecutado: `eas login`
- [ ] Node modules instalados: `npm install`
- [ ] app.json válido: `npx expo config` funciona
- [ ] Expo Go instalado en iPhone
- [ ] PC e iPhone en misma red (para LAN) O usando Tunnel
- [ ] QR code válido y no expirado

---

## 🎯 Próximos Pasos

### Opción A: Tunnel Mode (Rápido)
```powershell
npm run dev -- --tunnel
# Escanea QR en Expo Go
```

### Opción B: EAS Build (Confiable)
```powershell
eas build --platform ios --profile development
# Espera build, instala en iPhone
```

---

## 🆘 Si Sigue sin Funcionar

1. **Verifica la conexión:**
   ```powershell
   ping 8.8.8.8  # Verifica internet
   ```

2. **Prueba con web primero:**
   ```powershell
   npm run web
   # Debería funcionar en navegador
   ```

3. **Rebuild limpio:**
   ```powershell
   npx expo prebuild --clean
   eas build --platform ios --profile development
   ```

4. **Revisa logs en Expo Dashboard:**
   - Ir a https://expo.dev
   - Ver builds y logs detallados

---

## 📚 Resources

- [Expo Tunnel Docs](https://docs.expo.dev/build/building-on-ci/#local-builds-with-eas)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Expo Go Manual Connection](https://docs.expo.dev/build/manual-connection/)
- [Troubleshooting Expo](https://docs.expo.dev/troubleshooting/expo-cli/)

---

**Status:** Ready to test iOS ✅
