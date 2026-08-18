@echo off
REM Cerca - Quick iOS Fix Script for Windows
REM Este script limpia el proyecto y lo prepara para iOS

echo.
echo ============================================
echo Cerca - iOS Quick Fix (Windows)
echo ============================================
echo.

echo [1/5] Limpiando caché de npm...
call npm cache clean --force
if %errorlevel% neq 0 echo Error en npm cache clean && pause && exit /b 1

echo [2/5] Limpiando directorio .expo...
if exist "%USERPROFILE%\.expo" (
    rmdir /s /q "%USERPROFILE%\.expo"
    echo ✓ .expo limpiado
) else (
    echo ✓ .expo no existe
)

echo [3/5] Limpiando node_modules...
if exist "node_modules" (
    rmdir /s /q node_modules
    echo ✓ node_modules eliminado
    
    if exist "package-lock.json" (
        del package-lock.json
        echo ✓ package-lock.json eliminado
    )
) else (
    echo ✓ node_modules no existe
)

echo [4/5] Reinstalando dependencias...
call npm install
if %errorlevel% neq 0 echo Error en npm install && pause && exit /b 1

echo [5/5] Validando configuración...
call npx expo config > nul
if %errorlevel% neq 0 echo Error en expo config && pause && exit /b 1

echo.
echo ============================================
echo ✓ Limpieza completada exitosamente
echo ============================================
echo.
echo Próximos pasos:
echo.
echo OPCIÓN 1 - Tunnel Mode (Recomendado):
echo   npm run dev -- --tunnel
echo   Escanea el QR en Expo Go en tu iPhone
echo.
echo OPCIÓN 2 - LAN Mode (misma red WiFi):
echo   npm run dev -- --lan
echo   Escanea el QR en Expo Go en tu iPhone
echo.
echo OPCIÓN 3 - EAS Build (Cloud):
echo   eas build --platform ios --profile development
echo   (Requiere: npm install -g eas-cli && eas login)
echo.
echo ============================================
echo.

pause
