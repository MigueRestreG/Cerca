# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

# Cerca

Aplicación móvil construida con Expo Router para el dominio de búsquedas, anuncios, reservas y cuenta del producto Cerca.

## Inicio rápido

1. Instala dependencias.

   ```bash
   npm install
   ```

2. Inicia la app.

   ```bash
   npm run dev
   ```

   Si en Linux aparece `ENOSPC: System limit for number of file watchers reached`, sube el límite de inotify y vuelve a intentar:

   ```bash
   sudo sysctl -w fs.inotify.max_user_watches=524288
   ```

   Para hacerlo persistente, agrega esta línea en `/etc/sysctl.conf` o en un archivo bajo `/etc/sysctl.d/`:

   ```bash
   fs.inotify.max_user_watches=524288
   ```

3. Abre la app en un build de desarrollo, Android, iOS o Expo Go según el flujo local.

## Guía priorizada de alineación

### P0. Seguridad y sesión

- Reemplazar el uso de AsyncStorage para la sesión por expo-secure-store.
- Leer la sesión segura al iniciar y mantener un estado de carga inicial antes de renderizar login o navegación.
- No guardar credenciales sensibles en el bundle; solo accessToken y refreshToken deben vivir en almacenamiento seguro.

### P1. Contrato API y validación

- Integrar el contrato compartido @cerca/contract si existe.
- Validar cada respuesta de API con Zod en el borde del cliente; evitar as para convertir respuestas.
- En cada endpoint privado enviar Authorization: Bearer <accessToken>.
- Traducir errores RFC 9457 con campos reason a mensajes de UI claros.

### P1. Capa de datos robusta

- Sustituir useRemoteData por una solución de caché como React Query o TanStack Query.
- Definir claves de caché estables desde el inicio.
- Evitar peticiones redundantes con cancelQueries, staleTime, cacheTime y enabled.
- Implementar mutaciones optimistas con rollback e invalidación de vistas afectadas.
- Configurar retry: false para 401, 403 y errores de permisos.

### P1. Autorización basada en capacidades

- Mantener actor.capacities como fuente única de capacidades.
- No usar role: 'customer' | 'provider' en el cliente.
- Añadir un helper can(actor, permission) para decidir qué UI mostrar.
- Ocultar botones cuando no exista la capacidad pertinente.
- Deshabilitar acciones y explicar el motivo cuando la operación esté bloqueada por propiedad, relación, estado o tiempo.

### P2. Ubicación y degradación

- Implementar expo-location para obtener ubicación real.
- Si el usuario niega el permiso, ofrecer selector de ciudad o búsqueda manual.
- No dejar pantallas en blanco si no hay GPS.
- Asegurar que la búsqueda funcione con o sin ubicación.

### P2. Rendimiento y virtualización

- Renderizar resultados grandes con FlatList como lista desplazable nativa principal.
- Usar getItemLayout, keyExtractor, memo() en tarjetas y useCallback en renderItem.
- Optimizar imágenes con expo-image, cachePolicy, blurhash y tamaños adecuados.
- Medir en dispositivo de gama media; no confiar solo en emulador o portátil.

### P2. Modelo de dominio y estados

- Usar uniones discriminadas para ListingStatus, BookingStatus, Pricing y modelos afines.
- Evitar opcionales que permitan estados inválidos.
- Implementar switches exhaustivos con assertNever.
- Modelar dinero como Money { amountMinor, currency } y no como number.
- Formatear con Intl usando minorUnitDigits(currency) y locale.

### P2. Screens y UX de estados

- Cada pantalla con datos debe cubrir carga, error, vacío inicial y vacío por filtro.
- En búsqueda, el vacío por filtro debe permitir limpiar o ampliar criterios.
- En formularios, mostrar errores claros y evitar texto técnico.
- En botones, mostrar loading y disabled durante la petición.

### P3. Publicación y revisión

- Asegurar que publicar un anuncio en 4 pasos respete el modelo de Pricing.
- Para reseñas, aplicar canReviewBooking con razones bloqueadas: not_your_booking, not_completed, already_reviewed y window_closed.
- Mostrar siempre el motivo exacto en lugar de ocultar el botón.
- Validar relación, estado y tiempo antes de permitir reseñar.

### P3. Accesibilidad e i18n

- Mantener i18n con claves tipadas e Intl para dinero, fechas y distancias.
- Verificar pluralización y textos en es-MX, en-US y de-DE.
- No comunicar estado solo por color.
- Asegurar áreas táctiles de al menos 44 × 44.
- Soportar maxFontSizeMultiplier y no usar allowFontScaling={false}.

### P3. Calidad de código y entrega

- Mantener la regla de arquitectura: dominio no depende de UI.
- Ejecutar lint, formato y tests antes de subir cambios.
- No subir a main sin verificación.
- Documentar el uso real del backend y la configuración de EXPO_PUBLIC_API_URL.

## Resumen de prioridad

1. Sesión segura y estado de login inicial.
2. Validación de contrato API.
3. Capa de datos y caché robusta.
4. Autorización basada en capacidades.
5. Ubicación y degradación.
6. Virtualización y rendimiento.
7. Modelo de dominio y estados.
8. UX de estados en pantallas.
9. Reseñas y políticas de negocio.
10. i18n y accesibilidad.
11. Calidad y pipeline de entrega.

## Configuración del entorno

- Variables de entorno: define EXPO_PUBLIC_API_URL con la URL real del backend antes de ejecutar flujos que dependan de API.
- El proyecto usa Expo Router con TypeScript y Zod, y ya incluye expo-secure-store y expo-image como base para la alineación propuesta.

## Comandos útiles

```bash
npm run lint
```

```bash
npm run dev
```

```bash
npm run android
```

```bash
npm run ios
```
