// Gestor de Proveedores CORREGIDO
class ProveedoresManager {
    constructor() {
        this.proveedores = [
            {
                id: 1,
                nombre: 'OnlyFans',
                descripcion: 'Plataforma de contenido premium',
                activo: true,
                fecha_creacion: '2024-01-01',
                total_tokens: 15000,
                total_ingresos: 750.00,
                ultimo_ingreso: '2024-01-15'
            },
            {
                id: 2,
                nombre: 'Chaturbate',
                descripcion: 'Plataforma de streaming en vivo',
                activo: true,
                fecha_creacion: '2024-01-05',
                total_tokens: 12000,
                total_ingresos: 600.00,
                ultimo_ingreso: '2024-01-14'
            },
            {
                id: 3,
                nombre: 'ManyVids',
                descripcion: 'Marketplace de videos',
                activo: true,
                fecha_creacion: '2024-01-10',
                total_tokens: 8000,
                total_ingresos: 400.00,
                ultimo_ingreso: '2024-01-13'
            }
        ];
        
        this.currentEditId = null;
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAll();
            });
        } else {
            this.setupAll();
        }
    }

    setupAll() {
        this.loadProveedores();
        this.setupEventListeners();
        this.applyPermissions();
        this.updateStats();
    }

    setupEventListeners() {
        const form = document.getElementById('proveedorForm');
        const searchInput = document.getElementById('searchProveedor');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(e);
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterProveedores(e.target.value));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const proveedor = {
            nombre: formData.get('nombre') ? formData.get('nombre').trim() : '',
            descripcion: formData.get('descripcion') ? formData.get('descripcion').trim() : ''
        };

        console.log('Datos del formulario:', proveedor); // Debug

        if (!this.validateProveedor(proveedor)) {
            return;
        }

        if (this.currentEditId) {
            this.updateProveedor(this.currentEditId, proveedor);
        } else {
            this.createProveedor(proveedor);
        }
    }

    validateProveedor(proveedor) {
        if (!proveedor.nombre) {
            this.showNotification('El nombre del proveedor es obligatorio', 'error');
            return false;
        }

        // Verificar nombre único
        const exists = this.proveedores.some(p => 
            p.nombre.toLowerCase() === proveedor.nombre.toLowerCase() && 
            p.id !== this.currentEditId
        );
        
        if (exists) {
            this.showNotification('Ya existe un proveedor con ese nombre', 'error');
            return false;
        }

        return true;
    }

    createProveedor(proveedor) {
        const newProveedor = {
            id: Date.now(),
            nombre: proveedor.nombre,
            descripcion: proveedor.descripcion || '',
            activo: true,
            fecha_creacion: new Date().toISOString().split('T')[0],
            total_tokens: 0,
            total_ingresos: 0.00,
            ultimo_ingreso: null
        };

        this.proveedores.push(newProveedor);
        this.loadProveedores();
        this.updateStats();
        this.resetForm();
        this.showNotification('Proveedor creado exitosamente', 'success');
    }

    updateProveedor(id, proveedorData) {
        const index = this.proveedores.findIndex(p => p.id === id);
        if (index !== -1) {
            this.proveedores[index] = { 
                ...this.proveedores[index], 
                nombre: proveedorData.nombre,
                descripcion: proveedorData.descripcion
            };
            this.loadProveedores();
            this.updateStats();
            this.resetForm();
            this.showNotification('Proveedor actualizado exitosamente', 'success');
        }
    }

    loadProveedores() {
        const tbody = document.querySelector('#proveedoresTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        this.proveedores.forEach(proveedor => {
            const row = this.createProveedorRow(proveedor);
            tbody.appendChild(row);
        });
    }

    createProveedorRow(proveedor) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="proveedor-info">
                    <strong>${proveedor.nombre}</strong>
                    <small>${proveedor.descripcion || 'Sin descripción'}</small>
                </div>
            </td>
            <td>
                <span class="badge ${proveedor.activo ? 'badge-success' : 'badge-danger'}">
                    ${proveedor.activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>${proveedor.total_tokens.toLocaleString()}</td>
            <td>$${proveedor.total_ingresos.toFixed(2)}</td>
            <td>${proveedor.ultimo_ingreso ? this.formatDate(proveedor.ultimo_ingreso) : 'Sin ingresos'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-primary" onclick="window.proveedoresManager.editProveedor(${proveedor.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-info" onclick="window.proveedoresManager.viewProveedor(${proveedor.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon ${proveedor.activo ? 'btn-warning' : 'btn-success'}" 
                            onclick="window.proveedoresManager.toggleStatus(${proveedor.id})" 
                            title="${proveedor.activo ? 'Desactivar' : 'Activar'}">
                        <i class="fas ${proveedor.activo ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                </div>
            </td>
        `;
        return row;
    }

    editProveedor(id) {
        const proveedor = this.proveedores.find(p => p.id === id);
        if (!proveedor) return;

        this.currentEditId = id;
        
        const nombreInput = document.getElementById('nombre');
        const descripcionInput = document.getElementById('descripcion');
        
        if (nombreInput) nombreInput.value = proveedor.nombre;
        if (descripcionInput) descripcionInput.value = proveedor.descripcion || '';
        
        const title = document.querySelector('.form-title');
        if (title) title.textContent = 'Editar Proveedor';
        
        const submitBtn = document.querySelector('.btn-submit');
        if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar';
    }

    viewProveedor(id) {
        const proveedor = this.proveedores.find(p => p.id === id);
        if (!proveedor) return;

        const modalContent = `
            <div class="modal-content">
                <h3>Detalles del Proveedor</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Nombre:</label>
                        <span>${proveedor.nombre}</span>
                    </div>
                    <div class="detail-item">
                        <label>Descripción:</label>
                        <span>${proveedor.descripcion || 'No especificada'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Estado:</label>
                        <span class="badge ${proveedor.activo ? 'badge-success' : 'badge-danger'}">
                            ${proveedor.activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>Total Tokens:</label>
                        <span>${proveedor.total_tokens.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <label>Total Ingresos:</label>
                        <span>$${proveedor.total_ingresos.toFixed(2)}</span>
                    </div>
                    <div class="detail-item">
                        <label>Último Ingreso:</label>
                        <span>${proveedor.ultimo_ingreso ? this.formatDate(proveedor.ultimo_ingreso) : 'Sin ingresos'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Fecha de Creación:</label>
                        <span>${this.formatDate(proveedor.fecha_creacion)}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button onclick="window.closeModal()" class="btn btn-secondary">Cerrar</button>
                </div>
            </div>
        `;

        this.showModal(modalContent);
    }

    toggleStatus(id) {
        const proveedor = this.proveedores.find(p => p.id === id);
        if (!proveedor) return;

        proveedor.activo = !proveedor.activo;
        this.loadProveedores();
        
        const action = proveedor.activo ? 'activado' : 'desactivado';
        this.showNotification(`Proveedor ${action} exitosamente`, 'success');
    }

    filterProveedores(searchTerm) {
        const rows = document.querySelectorAll('#proveedoresTable tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const matches = text.includes(searchTerm.toLowerCase());
            row.style.display = matches ? '' : 'none';
        });
    }

    resetForm() {
        const form = document.getElementById('proveedorForm');
        if (form) {
            form.reset();
        }
        
        this.currentEditId = null;
        
        const title = document.querySelector('.form-title');
        if (title) {
            title.textContent = 'Nuevo Proveedor';
        }
        
        const submitBtn = document.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Crear Proveedor';
        }
    }

    updateStats() {
        const totalProveedores = this.proveedores.length;
        const proveedoresActivos = this.proveedores.filter(p => p.activo).length;
        const totalTokens = this.proveedores.reduce((sum, p) => sum + p.total_tokens, 0);
        const totalIngresos = this.proveedores.reduce((sum, p) => sum + p.total_ingresos, 0);

        const totalProvEl = document.getElementById('totalProveedores');
        const activosEl = document.getElementById('proveedoresActivos');
        const tokensEl = document.getElementById('totalTokensProveedores');
        const ingresosEl = document.getElementById('totalIngresosProveedores');

        if (totalProvEl) totalProvEl.textContent = totalProveedores;
        if (activosEl) activosEl.textContent = proveedoresActivos;
        if (tokensEl) tokensEl.textContent = (totalTokens / 1000).toFixed(0) + 'K';
        if (ingresosEl) ingresosEl.textContent = `$${totalIngresos.toLocaleString()}`;
    }

    applyPermissions() {
        if (typeof window.checkPermission !== 'function') return;

        const canEdit = window.checkPermission('proveedores');
        const buttons = document.querySelectorAll('.btn-primary, .btn-warning, .btn-success');
        
        if (!canEdit) {
            buttons.forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.5';
            });
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }

    showNotification(message, type = 'info') {
        // Remover notificación anterior si existe
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = content;
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
        
        window.closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
                delete window.closeModal;
            }, 300);
        };
    }
}

// Inicializar cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    window.proveedoresManager = new ProveedoresManager();
});

// Función global para logout
function logout() {
    if (window.auth && typeof window.auth.logout === 'function') {
        window.auth.logout();
    }
}