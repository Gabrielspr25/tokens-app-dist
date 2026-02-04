# 🚀 Sistema de Gestión de Tokens

## 📋 Descripción
Sistema completo para la gestión de tokens, pagos a modelos y reportes financieros. Incluye autenticación por roles, dashboard con gráficos, y módulos completos de CRUD.

## ✨ Características
- 🔐 **Autenticación por roles** (Admin, Vendedor, Asistente, Invitado)
- 📊 **Dashboard con gráficos** y estadísticas en tiempo real
- 👥 **Gestión de Modelos** con porcentajes personalizados
- 🏢 **Gestión de Proveedores** 
- 💰 **Registro de Ingresos** (tokens → dólares)
- 💸 **Pagos a Modelos** con cálculos automáticos
- 📈 **Reportes** y analytics
- 🌙 **Modo oscuro** por defecto
- 📱 **Diseño responsivo**

## 🔧 Tecnologías
- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Charts:** Chart.js
- **Icons:** Font Awesome
- **Fonts:** Google Fonts (Inter)
- **Base de Datos:** MySQL (compatible con Hostinger)
- **Backend:** PHP (próximamente)

## 🏗️ Estructura del Proyecto
```
mi-app-web/
├── index.html              # Página de login
├── dashboard.html          # Dashboard principal
├── modelos.html           # Gestión de modelos
├── proveedores.html       # Gestión de proveedores
├── ingresos.html          # Registro de ingresos
├── pagos.html            # Pagos a modelos
├── reportes.html         # Reportes y analytics
├── css/
│   └── styles.css        # Estilos principales
├── js/
│   ├── auth.js          # Sistema de autenticación
│   ├── dashboard.js     # Funcionalidad del dashboard
│   ├── modelos.js       # Gestión de modelos
│   └── [otros módulos]
├── php/
│   ├── config/
│   │   └── database.php # Configuración BD
│   ├── api/
│   └── includes/
└── README.md
```

## 🚀 Instalación en Hostinger

### Paso 1: Crear Subdominio
1. Ingresa a tu panel de Hostinger
2. Ve a **Dominios** → **Subdominios**
3. Crea un subdominio (ej: `tokens.tudominio.com`)
4. Selecciona la carpeta de destino

### Paso 2: Subir Archivos
1. Usa el **Administrador de Archivos** de Hostinger
2. Ve a la carpeta del subdominio creado
3. Sube todos los archivos del proyecto
4. Mantén la estructura de carpetas

### Paso 3: Configurar Base de Datos
1. Ve a **Bases de Datos MySQL** en Hostinger
2. Crea una nueva base de datos
3. Anota los datos de conexión:
   - Nombre de la BD
   - Usuario
   - Contraseña  
   - Servidor
4. Importa el archivo `database.sql` (cuando esté listo)

### Paso 4: Configurar PHP
1. Edita `php/config/database.php`
2. Coloca tus datos de conexión a la BD
3. Asegúrate que PHP esté habilitado en Hostinger

### Paso 5: Probar la Aplicación
1. Visita tu subdominio
2. Usa las credenciales de demo para probar
3. Verifica que todos los módulos funcionen

## 👤 Credenciales de Demo
- **Admin:** admin@token.com / admin123
- **Vendedor:** vendedor@token.com / vend123  
- **Asistente:** asistente@token.com / asist123
- **Invitado:** invitado@token.com / guest123

## 💰 Cálculos del Sistema
- **1 Token = $0.05**
- **Ganancia del Modelo = Tokens × $0.05 × % del Modelo**
- **Ganancia Neta = Total Ingresos - Total Pagado**

## 🔒 Permisos por Rol
| Módulo | Admin | Vendedor | Asistente | Invitado |
|--------|-------|----------|-----------|----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Modelos | ✅ | ✅ | 👁️ | ❌ |
| Proveedores | ✅ | ❌ | 👁️ | ❌ |
| Ingresos | ✅ | ❌ | 👁️ | ❌ |
| Pagos | ✅ | ✅ | ❌ | ❌ |
| Reportes | ✅ | ✅ | ❌ | ❌ |

## 📱 Responsividad
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)  
- ✅ Mobile (320px - 767px)

## 🎨 Personalización
Para personalizar colores, edita las variables CSS en `css/styles.css`:

```css
:root {
    --bg-dark: #0f0f23;
    --accent-blue: #238636;
    /* ... más variables */
}
```

## 🐛 Próximas Características
- [ ] Backend PHP completo
- [ ] Base de datos real
- [ ] Exportación a PDF/Excel
- [ ] Notificaciones push
- [ ] API REST
- [ ] Backup automático

## 📞 Soporte
Si necesitas ayuda con la configuración o personalización, no dudes en preguntar.

---
**Desarrollado para gestión profesional de tokens y pagos** 🚀
