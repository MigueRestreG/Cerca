# 🚀 iOS FIX - Instrucciones Rápidas (Windows)

## 📱 El Problema
"No usable Data Found" en Expo Go cuando intentas conectarte desde Windows a iPhone.

## ✅ La Solución (3 pasos)

### Paso 1️⃣: Limpiar el Proyecto

**Opción A - PowerShell (Recomendado):**
```powershell
# Click derecho en PowerShell y selecciona "Run as Administrator"
cd c:\Users\migue\OneDrive\Documents\Riwi\Cerca
.\fix-ios.ps1
```

**Opción B - Command Prompt:**
```cmd
cd c:\Users\migue\OneDrive\Documents\Riwi\Cerca
fix-ios.bat
```

**Opción C - Manual:**
```powershell
npm cache clean --force
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

### Paso 2️⃣: Instalar EAS CLI (Una sola vez)

```powershell
npm install -g eas-cli
eas login
```

### Paso 3️⃣: Hacer Build para iOS en Cloud

```powershell
cd c:\Users\migue\OneDrive\Documents\Riwi\Cerca
eas build --platform ios --profile development
```

**Espera 5-10 minutos** mientras se construye en los servidores de Expo.

---

## 📲 Instalar en tu iPhone

1. Cuando el build termine, verás un link
2. Abre el link en **Safari** en tu iPhone
3. Toca el botón de **Install**
4. Espera a que se instale (aparecerá el ícono en tu home screen)
5. ¡Abre la app!

---

## 🎯 Alternativa Rápida (Sin Cloud Build)

Si prefieres probar rápido sin esperar el build:

```powershell
npm run dev -- --tunnel
```

Luego:
1. Abre **Expo Go** en tu iPhone
2. Toca el **+** (Plus sign)
3. Escanea el QR o ingresa tu email de Expo
4. ¡La app debería cargar!

---

## 📋 Requerimientos

- [ ] Node.js instalado
- [ ] `npm install` ejecutado
- [ ] Expo Go instalado en iPhone
- [ ] Conexión a internet en ambos dispositivos

---

## 🆘 Si Sigue sin Funcionar

1. **Verifica que Expo Go esté actualizado:**
   - Abre App Store → Expo Go → Update

2. **Prueba con web primero:**
   ```powershell
   npm run web
   ```
   Debería abrirse en tu navegador

3. **Lee los logs:**
   ```powershell
   npm run dev -- --tunnel
   # Lee los mensajes en la terminal
   ```

4. **Revisa la guía completa:**
   - Lee `iOS_SETUP_WINDOWS.md` en el proyecto

---

## 🔧 Solución Nuclear (Si nada funciona)

```powershell
# Elimina TODO
Remove-Item -Recurse -Force "$env:USERPROFILE\.expo"
Remove-Item -Recurse -Force "$env:USERPROFILE\.cache\expo"
Remove-Item -Recurse -Force "node_modules"
Remove-Item -Force "package-lock.json"

# Reinstala
npm install
npx expo config

# Intenta de nuevo
eas build --platform ios --profile development
```

---

## ✨ Recommended Workflow

```
┌─────────────────────────────────────┐
│ 1. Ejecuta fix-ios.ps1              │
│    (limpia proyecto)                │
├─────────────────────────────────────┤
│ 2. npm install -g eas-cli           │
│    eas login                        │
├─────────────────────────────────────┤
│ 3. eas build --platform ios \       │
│    --profile development            │
├─────────────────────────────────────┤
│ 4. Abre link en Safari en iPhone    │
│    y instala                        │
├─────────────────────────────────────┤
│ 5. ¡Abre app y prueba!              │
└─────────────────────────────────────┘
```

---

**Status: Listo para probar ✅**

¿Necesitas ayuda con algún paso? 🤝
