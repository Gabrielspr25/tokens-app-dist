// Sistema de autenticación simplificado
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.roles = {
            admin: {
                name: 'Administrador',
                permissions: ['dashboard', 'modelos', 'proveedores', 'ingresos', 'pagos', 'reportes', 'admin'],
                modules: ['all']
            },
            vendedor: {
                name: 'Vendedor',
                permissions: ['dashboard', 'modelos', 'pagos', 'reportes'],
                modules: ['modelos', 'pagos', 'reportes']
            },
            asistente: {
                name: 'Asistente',
                permissions: ['dashboard', 'modelos', 'proveedores', 'ingresos'],
                modules: ['view-only']
            },
            invitado: {
                name: 'Invitado',
                permissions: ['dashboard'],
                modules: ['dashboard']
            }
        };

        // Usuarios demo
        this.users = [
            {
                email: 'admin@token.com',
                password: 'admin123',
                role: 'admin',
                name: 'Admin User',
                avatar: 'A'
            },
            {
                email: 'vendedor@token.com',
                password: 'vend123',
                role: 'vendedor',
                name: 'Vendedor User',
                avatar: 'V'
            },
            {
                email: 'asistente@token.com',
                password: 'asist123',
                role: 'asistente',
                name: 'Asistente User',
                avatar: 'AS'
            },
            {
                email: 'invitado@token.com',
                password: 'guest123',
                role: 'invitado',
                name: 'Invitado User',
                avatar: 'I'
            }
        ];

        this.init();
    }

    init() {
        // Verificar si hay usuario logueado
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                this.redirectToDashboard();
            }
        } else {
            if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
                this.redirectToLogin();
            }
        }

        // Setup login form if exists
        this.setupLoginForm();
        
        // Setup user info if logged in
        if (this.currentUser) {
            this.updateUserInterface();
        }
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error-message');

        // Limpiar errores previos
        errorDiv.style.display = 'none';

        // Buscar usuario
        const user = this.users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Simular delay de autenticación
            await this.showLoadingState();
            
            this.redirectToDashboard();
        } else {
            this.showError('Email o contraseña incorrectos');
        }
    }

    showLoadingState() {
        const button = document.querySelector('.btn-login');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        button.disabled = true;

        return new Promise(resolve => {
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                resolve();
            }, 1500);
        });
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    updateUserInterface() {
        // Actualizar información del usuario en sidebar
        const userNameEl = document.getElementById('userName');
        const userRoleEl = document.getElementById('userRole');
        const userAvatarEl = document.getElementById('userAvatar');

        if (userNameEl) userNameEl.textContent = this.currentUser.name;
        if (userRoleEl) userRoleEl.textContent = this.roles[this.currentUser.role].name;
        if (userAvatarEl) userAvatarEl.textContent = this.currentUser.avatar;

        // Aplicar permisos a la navegación
        this.applyPermissions();
    }

    applyPermissions() {
        const userRole = this.roles[this.currentUser.role];
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            let hasPermission = false;

            // Verificar permisos por página
            if (href && href.includes('dashboard')) hasPermission = userRole.permissions.includes('dashboard');
            if (href && href.includes('modelos')) hasPermission = userRole.permissions.includes('modelos');
            if (href && href.includes('proveedores')) hasPermission = userRole.permissions.includes('proveedores');
            if (href && href.includes('ingresos')) hasPermission = userRole.permissions.includes('ingresos');
            if (href && href.includes('pagos')) hasPermission = userRole.permissions.includes('pagos');
            if (href && href.includes('reportes')) hasPermission = userRole.permissions.includes('reportes');

            if (!hasPermission && href && !href.includes('#')) {
                link.style.opacity = '0.5';
                link.style.pointerEvents = 'none';
                link.title = 'No tienes permisos para acceder a esta sección';
            }
        });

        // Ocultar botones según permisos
        const addButtons = document.querySelectorAll('[data-permission]');
        addButtons.forEach(button => {
            const permission = button.getAttribute('data-permission');
            if (!userRole.permissions.includes(permission)) {
                button.style.display = 'none';
            }
        });
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.roles[this.currentUser.role].permissions.includes(permission) || 
               this.roles[this.currentUser.role].permissions.includes('admin');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.redirectToLogin();
    }

    redirectToLogin() {
        window.location.href = 'index.html';
    }

    redirectToDashboard() {
        window.location.href = 'dashboard.html';
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getUserRole() {
        return this.currentUser ? this.roles[this.currentUser.role] : null;
    }
}

// Inicializar sistema de autenticación
const auth = new AuthSystem();

// Función global para logout
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        auth.logout();
    }
}

// Función para verificar permisos
function checkPermission(permission) {
    return auth.hasPermission(permission);
}

// Export para uso en otros módulos
window.auth = auth;
window.logout = logout;
window.checkPermission = checkPermission;
