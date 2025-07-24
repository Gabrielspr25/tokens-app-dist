# 🚨 GUÍA DE SOLUCIÓN DE ERRORES COMUNES

## 🔍 ERRORES MÁS FRECUENTES Y SOLUCIONES

### ❌ Error: "Página en blanco"
**Causa:** Archivos no subidos correctamente
**Solución:**
1. Verifica que index.html esté en la raíz del subdominio
2. Revisa permisos de archivos (644 para archivos, 755 para carpetas)
3. Verifica que no haya caracteres especiales en nombres

### ❌ Error: "CSS/JS no cargan"
**Causa:** Rutas incorrectas o archivos faltantes
**Solución:**
1. Estructura correcta:
   ```
   /public_html/tokens/
   ├── index.html
   ├── css/
   │   └── styles.css
   └── js/
       └── auth.js
   ```
2. Verifica que las rutas en HTML sean relativas: `href="css/styles.css"`

### ❌ Error: "Cannot connect to database"
**Causa:** Configuración incorrecta de BD
**Solución:**
1. Edita config.php con datos reales de Hostinger:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'tu_usuario_tokens');
   define('DB_USER', 'tu_usuario_bd');
   define('DB_PASS', 'tu_contraseña_bd');
   ```

### ❌ Error: "403 Forbidden"
**Causa:** Permisos incorrectos
**Solución:**
1. Archivos: chmod 644
2. Carpetas: chmod 755
3. Verifica que index.html exista

### ❌ Error: "500 Internal Server Error"
**Causa:** Error en PHP o .htaccess
**Solución:**
1. Revisa logs de error en Hostinger
2. Comenta temporalmente el .htaccess
3. Verifica sintaxis PHP

### ❌ Error: "Mixed Content" (HTTP/HTTPS)
**Causa:** Enlaces HTTP en sitio HTTPS
**Solución:**
1. Cambia todos los enlaces a HTTPS
2. Usa enlaces relativos cuando sea posible

### ❌ Error: "Font Awesome no carga"
**Causa:** Bloqueador de anuncios o red
**Solución:**
1. Descarga Font Awesome localmente
2. O usa CDN alternativo

### ❌ Error: "Chart.js no funciona"
**Causa:** JavaScript bloqueado o error
**Solución:**
1. Verifica consola del navegador
2. Asegúrate que Chart.js se carga antes que dashboard.js
