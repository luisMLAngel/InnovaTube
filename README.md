# InnovaTube Frontend

Aplicación web para descubrir, buscar y guardar videos favoritos de YouTube. Cuenta con autenticación segura, búsqueda en tiempo real y protección anti-bots con reCAPTCHA v3.

## Tecnologías

- **Angular 21** — Framework principal con componentes standalone
- **PrimeNG 21** — Librería de componentes UI con tema Aura
- **TailwindCSS 3** — CSS utility-first con sistema de diseño personalizado
- **Angular Signals** — Reactividad moderna para state management y formularios
- **@ngneat/elf** — State management reactivo con stores basados en signals
- **TypeScript 5.9** — Tipado estático

## Integraciones Externas

- **YouTube Data API v3** — Búsqueda de videos, listado de populares y detalle de videos
- **Google reCAPTCHA v3** — Protección invisible en el formulario de registro (score-based)

## Características

### Autenticación

- Login y registro de usuarios
- Recuperación y restablecimiento de contraseña
- JWT con access token y refresh token
- Refresh automático en requests 401
- Auth guard funcional para rutas protegidas

### Videos

- Listado de videos populares (región MX)
- Búsqueda con autocompletado
- Reproducción de video con embed de YouTube
- Marcado y listado de videos favoritos

### User

- Estado de usuario persistente con Elf store

## Arquitectura

- **Lazy loading** de todas las features via `loadComponent()`
- **Patrón Facade** — `AuthFacadeService`, `UserFacadeService` como capa de abstracción
- **BaseStore genérico** — Store abstracto con entities, active entity y undo/redo
- **BaseService HTTP** — Capa HTTP genérica con retry y manejo estandarizado de errores
- **Interceptors en cadena** — Auth, auth-error y loader
- **Dark mode** — Toggle con soporte completo vía atributo `data-theme`

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm start
```

## Build de Producción

```bash
npm run build
```

## Variables de Entorno

| Variable             | Descripción                     |
| -------------------- | ------------------------------- |
| `SERVER`             | URL del backend API             |
| `YOUTUBE_API_KEY`    | API key de YouTube Data API v3  |
| `RECAPTCHA_SITE_KEY` | Site Key de Google reCAPTCHA v3 |
