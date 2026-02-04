# 🚀 GUÍA COMPLETA DE DESPLIEGUE EN HOSTINGER

## 📋 Paso a Paso para Configurar tu Sistema de Tokens

### PASO 1: Preparar tu Dominio y Subdominio

1. **Acceder al Panel de Hostinger**
   - Ve a https://hpanel.hostinger.com
   - Inicia sesión con tu cuenta

2. **Crear Subdominio**
   - Ve a: **Hosting** → **Administrar** → **Dominios**
   - Busca la sección **Subdominios**
   - Haz clic en **Crear Subdominio**
   - Nombre sugerido: `tokens` (quedará como tokens.tudominio.com)
   - Selecciona la carpeta: `/public_html/tokens` (se creará automáticamente)
   - Clic en **Crear**

### PASO 2: Subir los Archivos

1. **Acceder al Administrador de Archivos**
   - En el panel, ve a: **Archivos** → **Administrador de archivos**
   - Navega a la carpeta `/public_html/tokens/`

2. **Subir el Proyecto**
   - Selecciona todos los archivos de tu proyecto local
   - Súbelos manteniendo la estructura de carpetas:
   ```
   /public_html/tokens/
   ├── index.html
   ├── dashboard.html
   ├── modelos.html
   ├── proveedores.html
   ├── ingresos.html
   ├── pagos.html
   ├── config.php
   ├── database.sql
   ├── css/
   │   └── styles.css
   ├── js/
   │   ├── auth.js
   │   ├── dashboard.js
   │   ├── modelos.js
   │   └── [otros archivos JS]
   └── README.md
   ```

### PASO 3: Configurar la Base de Datos

1. **Crear Base de Datos MySQL**
   - Ve a: **Bases de datos** → **MySQL**
   - Clic en **Crear base de datos**
   - Nombre: `tu_usuario_tokens` (Hostinger agrega prefijo automáticamente)
   - Crea un usuario para la BD:
     - Usuario: `tu_usuario_tokens_user`
     - Contraseña: (genera una segura)
   - Guarda estos datos ⚠️

2. **Importar Estructura**
   - En la sección MySQL, clic en **phpMyAdmin**
   - Selecciona tu base de datos
   - Ve a la pestaña **Importar**
   - Selecciona el archivo `database.sql`
   - Clic en **Ejecutar**

### PASO 4: Configurar la Conexión

1. **Editar config.php**
   ```php
   <?php
   // Reemplaza con tus datos reales de Hostinger
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'tu_usuario_tokens'); // Tu nombre de BD real
   define('DB_USER', 'tu_usuario_tokens_user'); // Tu usuario real
   define('DB_PASS', 'tu_contraseña_real'); // Tu contraseña real
   ?>
   ```

2. **Verificar Permisos**
   - Asegúrate que el archivo config.php tenga permisos 644
   - Clic derecho → Permisos → 644

### PASO 5: Probar la Aplicación

1. **Acceder al Sistema**
   - Ve a: `https://tokens.tudominio.com`
   - Deberías ver la página de login

2. **Credenciales de Prueba**
   - **Admin:** admin@token.com / admin123
   - **Vendedor:** vendedor@token.com / vend123
   - **Asistente:** asistente@token.com / asist123
   - **Invitado:** invitado@token.com / guest123

### PASO 6: Configuraciones de Seguridad

1. **Archivo .htaccess** (crear en la raíz del proyecto)
   ```apache
   # Seguridad básica
   Options -Indexes
   
   # Proteger archivos sensibles
   <Files "config.php">
       Order allow,deny
       Deny from all
   </Files>
   
   <Files "database.sql">
       Order allow,deny
       Deny from all
   </Files>
   
   # Habilitar compresión
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/plain
       AddOutputFilterByType DEFLATE text/html
       AddOutputFilterByType DEFLATE text/xml
       AddOutputFilterByType DEFLATE text/css
       AddOutputFilterByType DEFLATE application/xml
       AddOutputFilterByType DEFLATE application/xhtml+xml
       AddOutputFilterByType DEFLATE application/rss+xml
       AddOutputFilterByType DEFLATE application/javascript
       AddOutputFilterByType DEFLATE application/x-javascript
   </IfModule>
   
   # Cache de archivos estáticos
   <IfModule mod_expires.c>
       ExpiresActive on
       ExpiresByType text/css "access plus 1 year"
       ExpiresByType application/javascript "access plus 1 year"
       ExpiresByType image/png "access plus 1 year"
       ExpiresByType image/jpg "access plus 1 year"
       ExpiresByType image/jpeg "access plus 1 year"
   </IfModule>
   ```

### PASO 7: Optimizaciones de Hostinger

1. **SSL/HTTPS**
   - Ve a: **Hosting** → **Administrar** → **SSL**
   - Activa el SSL gratuito para tu subdominio
   - Fuerza HTTPS en todas las páginas

2. **Cache**
   - En el panel, busca **LiteSpeed Cache**
   - Actívalo para mejor rendimiento

3. **PHP Version**
   - Ve a **Configuración PHP**
   - Selecciona PHP 8.1 o superior

### PASO 8: Verificaciones Finales

✅ **Checklist de Funcionamiento:**
- [ ] La página de login carga correctamente
- [ ] Las credenciales demo funcionan
- [ ] El dashboard muestra gráficos
- [ ] Se pueden crear/editar modelos
- [ ] Se pueden registrar ingresos
- [ ] Los cálculos de pagos son correctos
- [ ] Los permisos por rol funcionan
- [ ] El diseño se ve bien en móvil

### 🆘 SOLUCIÓN DE PROBLEMAS COMUNES

**Problema:** "Error de conexión a la base de datos"
- ✅ Verifica los datos en config.php
- ✅ Asegúrate que la BD existe
- ✅ Verifica que el usuario tenga permisos

**Problema:** "Página en blanco"
- ✅ Revisa los logs de error en el panel de Hostinger
- ✅ Verifica que todos los archivos se subieron
- ✅ Checa los permisos de archivos

**Problema:** "CSS/JS no cargan"
- ✅ Verifica las rutas de los archivos
- ✅ Asegúrate que las carpetas css/ y js/ existen
- ✅ Revisa que los archivos no estén corruptos

**Problema:** "Funciones no responden"
- ✅ Abre la consola del navegador (F12)
- ✅ Revisa si hay errores de JavaScript
- ✅ Verifica que todos los archivos JS se cargaron

### 📞 CONTACTO PARA SOPORTE

Si encuentras algún problema durante la instalación:

1. **Datos que necesito para ayudarte:**
   - URL de tu subdominio
   - Mensaje de error exacto
   - Captura de pantalla del problema
   - Versión de PHP que estás usando

2. **Logs útiles:**
   - Error log de PHP (disponible en el panel de Hostinger)
   - Consola del navegador (F12 → Console)

### 🎯 PRÓXIMOS PASOS

Una vez que tengas todo funcionando:

1. **Cambiar credenciales por defecto**
2. **Configurar respaldos automáticos**
3. **Personalizar colores y logos**
4. **Configurar notificaciones por email**
5. **Agregar más proveedores/modelos reales**

---

## 💡 CONSEJOS ADICIONALES

- **Backup:** Hostinger hace backups automáticos, pero puedes crear manuales también
- **Monitoreo:** Revisa periódicamente los logs de acceso
- **Actualizaciones:** Mantén el sistema actualizado
- **Seguridad:** Cambia las contraseñas periódicamente

¡Tu sistema de gestión de tokens estará listo para usar! 🚀
