/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';
module.exports = {
  darkMode: ['attribute', 'data-theme'],
  content: ['./src/**/*.{html,ts}', './node_modules/primeng/**/*.{js,ts}'],
  theme: {
    extend: {
      /* =====================================================
        COLORES (De los temas: light.scss / dark.scss)
      ===================================================== */
      colors: {
        /* ─────────────────────────────────────────────────
           BRAND
        ───────────────────────────────────────────────── */

        // Color principal de la app: botones primarios, links activos, badges importantes
        // Uso: bg-primary-w, text-primary-w
        'primary-w': 'var(--color-primary)',
        'primary-hover-w': 'var(--color-primary-hover)',
        'primary-active-w': 'var(--color-primary-active)',
        'primary-soft-w': 'var(--color-primary-soft)',

        // Color de acento: CTAs destacados, elementos importantes
        // Uso: bg-accent-w, text-accent-w
        'accent-w': 'var(--color-accent)',
        'accent-hover-w': 'var(--color-accent-hover)',
        'accent-soft-w': 'var(--color-accent-soft)',

        /* ─────────────────────────────────────────────────
           TEXTO
        ───────────────────────────────────────────────── */

        // Texto principal: títulos h1-h3, párrafos importantes, labels
        // Uso: text-ink-primary-w
        'ink-primary-w': 'var(--text-primary)',

        // Subtítulos h4-h6, descripciones, labels secundarios
        // Uso: text-ink-secondary-w
        'ink-secondary-w': 'var(--text-secondary)',

        // Texto de baja importancia: metadata, hints, placeholders
        // Uso: text-ink-muted-w
        'ink-muted-w': 'var(--text-muted)',
        // Texto deshabilitado en inputs o botones
        // Uso: text-ink-disabled-w
        'ink-disabled-w': 'var(--text-disabled)',

        // Texto sobre fondos oscuros (botones primarios, badges)
        // Uso: text-ink-inverse-w
        'ink-inverse-w': 'var(--text-inverse)',

        // Colores de tags por tono (status)
        'ink-tone-neutral-w': 'var(--tag-tone-neutral-text)',
        'ink-tone-info-w': 'var(--tag-tone-info-text)',
        'ink-tone-danger-w': 'var(--tag-tone-danger-text)',
        'ink-tone-success-w': 'var(--tag-tone-success-text)',
        'ink-tone-muted-w': 'var(--text-muted)',

        /* ─────────────────────────────────────────────────
           BACKGROUNDS
        ───────────────────────────────────────────────── */

        // Fondo principal de la aplicación (body)
        // Uso: bg-canvas-w
        'canvas-w': 'var(--bg-app)',

        // Fondo de superficies (sidebar, header)
        // Uso: bg-surface-w
        'surface-w': 'var(--bg-surface)',

        // Fondo de tarjetas, modales
        // Uso: bg-panel-w
        'panel-w': 'var(--bg-card)',

        // Fondo de elementos de baja jerarquía
        // Uso: bg-subtle-w
        'subtle-w': 'var(--bg-muted)',

        // Fondo al hacer hover sobre elementos interactivos
        // Uso: hover:bg-interactive-w
        'interactive-w': 'var(--bg-hover)',

        // Fondo de elementos seleccionados
        // Uso: bg-selected-w
        'selected-w': 'var(--bg-selected)',

        // Fondo de overlays (dialogs, popups)
        // Uso: bg-overlay-w
        'overlay-w': 'var(--bg-overlay)',

        // Fondo temático general (usos varios, tema oscuro es negro puro, tema claro es blanco)
        'theme-w': 'var(--bg-theme)',
        /* ─────────────────────────────────────────────────
           INPUTS
        ───────────────────────────────────────────────── */

        // Fondos de inputs
        'input-bg-w': 'var(--input-bg)',
        'input-bg-hover-w': 'var(--input-bg-hover)',
        'input-bg-focus-w': 'var(--input-bg-focus)',
        'input-bg-disabled-w': 'var(--input-bg-disabled)',

        // Textos de inputs
        'input-text-w': 'var(--input-text)',
        'input-placeholder-w': 'var(--input-placeholder)',
        'input-disabled-text-w': 'var(--input-disabled-text)',

        // Bordes de inputs
        'input-border-w': 'var(--input-border)',
        'input-border-hover-w': 'var(--input-border-hover)',
        'input-border-focus-w': 'var(--input-border-focus)',
        'input-border-error-w': 'var(--input-border-error)',
        'input-border-disabled-w': 'var(--input-border-disabled)',

        // Focus rings de inputs
        'input-ring-focus-w': 'var(--input-ring-focus)',
        'input-ring-error-w': 'var(--input-ring-error)',

        /* ─────────────────────────────────────────────────
           BUTTONS
        ───────────────────────────────────────────────── */

        // Primary button
        'button-primary-bg-w': 'var(--button-primary-bg)',
        'button-primary-bg-hover-w': 'var(--button-primary-bg-hover)',
        'button-primary-bg-active-w': 'var(--button-primary-bg-active)',
        'button-primary-text-w': 'var(--button-primary-text)',

        // Secondary button
        'button-secondary-bg-w': 'var(--button-secondary-bg)',
        'button-secondary-bg-hover-w': 'var(--button-secondary-bg-hover)',
        'button-secondary-bg-active-w': 'var(--button-secondary-bg-active)',
        'button-secondary-text-w': 'var(--button-secondary-text)',

        // Ghost button
        'button-ghost-bg-hover-w': 'var(--button-ghost-bg-hover)',
        'button-ghost-text-w': 'var(--button-ghost-text)',

        // Danger button
        'button-danger-bg-w': 'var(--button-danger-bg)',
        'button-danger-bg-hover-w': 'var(--button-danger-bg-hover)',
        'button-danger-text-w': 'var(--button-danger-text)',

        // Disabled button
        'button-disabled-bg-w': 'var(--button-disabled-bg)',
        'button-disabled-text-w': 'var(--button-disabled-text)',

        /* ─────────────────────────────────────────────────
           BORDES
        ───────────────────────────────────────────────── */

        // Bordes estándar: cards, inputs, tablas, divisores
        // Uso: border-stroke-w
        'stroke-w': 'var(--border-default)',

        // Bordes al hacer hover o en estado activo
        // Uso: border-stroke-strong-w
        'stroke-strong-w': 'var(--border-strong)',
        // Separadores sutiles entre secciones
        // Uso: border-separator-w
        'separator-w': 'var(--border-divider)',

        // Bordes de botones
        'button-border-secondary-w': 'var(--button-border-secondary)',
        'button-border-secondary-hover-w': 'var(--button-border-secondary-hover)',
        'button-border-danger-w': 'var(--button-border-danger)',

        /* ─────────────────────────────────────────────────
           ESTADOS / FEEDBACK
        ───────────────────────────────────────────────── */

        // Éxito: confirmaciones, mensajes success, badges positivos
        // Uso: bg-success-w, text-success-w, border-success-w
        'success-w': 'var(--color-success)',
        'success-soft-w': 'var(--state-success-bg-soft)',

        // Advertencia: alerts, warnings, badges de precaución
        // Uso: bg-warning-w, text-warning-w, border-warning-w
        'warning-w': 'var(--color-warning)',
        'warning-soft-w': 'var(--state-warning-bg-soft)',

        // Error/Peligro: mensajes de error, botones destructivos, validaciones fallidas
        // Uso: bg-error-w, text-error-w, border-error-w
        'error-w': 'var(--color-error)',
        'error-soft-w': 'var(--state-error-bg-soft)',

        // Información: tips, info alerts, badges informativos
        // Uso: bg-info-w, text-info-w, border-info-w
        'info-w': 'var(--color-info)',
        'info-soft-w': 'var(--state-info-bg-soft)',

        /* ─────────────────────────────────────────────────
           ENLACES
        ───────────────────────────────────────────────── */

        // Links normales en texto
        // Uso: text-link-w
        'link-w': 'var(--link-text)',

        // Links al hacer hover
        // Uso: hover:text-link-hover-w
        'link-hover-w': 'var(--link-hover)',

        // Links activos
        // Uso: active:text-link-active-w
        'link-active-w': 'var(--link-active)',

        // Links ya visitados
        // Uso: visited:text-link-visited-w
        'link-visited-w': 'var(--link-visited)',

        // Links mutados
        'link-muted-w': 'var(--link-muted)',

        // Subrayado de links
        'link-underline-w': 'var(--link-underline)',

        /* ─────────────────────────────────────────────────
           OVERLAYS
        ───────────────────────────────────────────────── */

        'overlay-bg-w': 'var(--overlay-bg)',
        'overlay-surface-w': 'var(--overlay-surface)',

        /* ─────────────────────────────────────────────────
           FOCUS RINGS
        ───────────────────────────────────────────────── */

        'focus-ring-primary-w': 'var(--focus-ring-primary)',
        'focus-ring-danger-w': 'var(--focus-ring-danger)',
      },

      /* =====================================================
         BACKGROUND IMAGES (Degradados)
      ===================================================== */
      backgroundImage: {
        // Fondo de vistas de autenticación (con degradado)
        // Uso: bg-auth-w
        'auth-w': 'var(--bg-auth)',
      },

      /* =====================================================
         TIPOGRAFÍA (De tokens.scss)
      ===================================================== */
      fontSize: {
        // Textos muy pequeños: metadata, hints, footnotes
        // Uso: text-xs
        xs: ['var(--text-xs)', { lineHeight: 'var(--lh-tight)' }],

        // Texto secundario: descripciones cortas, labels pequeños
        // Uso: text-sm
        sm: ['var(--text-sm)', { lineHeight: 'var(--lh-normal)' }],

        // Texto base: párrafos, labels normales, la mayoría del contenido
        // Uso: text-base
        base: ['var(--text-base)', { lineHeight: 'var(--lh-normal)' }],

        // Subtítulos medianos
        // Uso: text-md
        md: ['var(--text-md)', { lineHeight: 'var(--lh-tight)' }],

        // Subtítulos grandes
        // Uso: text-lg
        lg: ['var(--text-lg)', { lineHeight: 'var(--lh-tight)' }],

        // Títulos de sección (h3-h4)
        // Uso: text-xl
        xl: ['var(--text-xl)', { lineHeight: 'var(--lh-tight)' }],

        // Título principal de página (h2)
        // Uso: text-2xl
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--lh-tight)' }],
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '700',
        bold: '700',
      },

      /* =====================================================
         ESPACIADO - margin / padding / gap (De tokens.scss)
      ===================================================== */
      spacing: {
        0: '0px',
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
      },

      /* =====================================================
         BORDER RADIUS (De tokens.scss)
      ===================================================== */
      borderRadius: {
        none: 'var(--radius-none)',
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },

      /* =====================================================
        SOMBRAS (De los temas)
      ===================================================== */
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },

      /* =====================================================
         ALTURAS DE CONTROLES (De tokens.scss)
      ===================================================== */
      height: {
        'control-xs': 'var(--control-height-xs)',
        'control-sm': 'var(--control-height-sm)',
        'control-md': 'var(--control-height-md)',
        'control-lg': 'var(--control-height-lg)',
      },
      minHeight: {
        'control-xs': 'var(--control-height-xs)',
        'control-sm': 'var(--control-height-sm)',
        'control-md': 'var(--control-height-md)',
        'control-lg': 'var(--control-height-lg)',
      },

      /* =====================================================
        FOCUS RING (De los temas)
      ===================================================== */
      ringColor: {
        DEFAULT: 'var(--focus-ring-primary)',
        primary: 'var(--focus-ring-primary)',
        danger: 'var(--focus-ring-danger)',
      },
    },
  },
  plugins: [PrimeUI],
};
