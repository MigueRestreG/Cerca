# Cerca - Quick iOS Fix Script for Windows PowerShell
# Este script limpia el proyecto y lo prepara para iOS

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "Cerca - iOS Quick Fix (Windows PowerShell)" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Step 1: Limpiar caché de npm
Write-Host "[1/5] Limpiando caché de npm..." -ForegroundColor Yellow
npm cache clean --force
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en npm cache clean" -ForegroundColor Red
    exit 1
}

# Step 2: Limpiar directorio .expo
Write-Host "[2/5] Limpiando directorio .expo..." -ForegroundColor Yellow
$expoPath = "$env:USERPROFILE\.expo"
if (Test-Path $expoPath) {
    Remove-Item -Recurse -Force $expoPath
    Write-Host "✓ .expo limpiado" -ForegroundColor Green
} else {
    Write-Host "✓ .expo no existe" -ForegroundColor Green
}

# Step 3: Limpiar node_modules
Write-Host "[3/5] Limpiando node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
    Write-Host "✓ node_modules eliminado" -ForegroundColor Green
    
    if (Test-Path "package-lock.json") {
        Remove-Item -Force package-lock.json
        Write-Host "✓ package-lock.json eliminado" -ForegroundColor Green
    }
} else {
    Write-Host "✓ node_modules no existe" -ForegroundColor Green
}

# Step 4: Reinstalar dependencias
Write-Host "[4/5] Reinstalando dependencias..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en npm install" -ForegroundColor Red
    exit 1
}

# Step 5: Validar configuración
Write-Host "[5/5] Validando configuración..." -ForegroundColor Yellow
npx expo config | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en expo config" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "✓ Limpieza completada exitosamente" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "OPCIÓN 1 - Tunnel Mode (Recomendado):" -ForegroundColor Yellow
Write-Host "  npm run dev -- --tunnel" -ForegroundColor White
Write-Host "  Escanea el QR en Expo Go en tu iPhone" -ForegroundColor White
Write-Host ""
Write-Host "OPCIÓN 2 - LAN Mode (misma red WiFi):" -ForegroundColor Yellow
Write-Host "  npm run dev -- --lan" -ForegroundColor White
Write-Host "  Escanea el QR en Expo Go en tu iPhone" -ForegroundColor White
Write-Host ""
Write-Host "OPCIÓN 3 - EAS Build (Cloud - Recomendado para iOS):" -ForegroundColor Yellow
Write-Host "  npm install -g eas-cli" -ForegroundColor White
Write-Host "  eas login" -ForegroundColor White
Write-Host "  eas build --platform ios --profile development" -ForegroundColor White
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

Read-Host "Presiona Enter para cerrar esta ventana"
