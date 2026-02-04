// Gestión de Modelos
class ModelosManager {
    constructor() {
        this.modelos = [
            { id: 1, nickname: 'Luna_Star', nombre: 'Luna', apellido: 'García', porcentaje: 60, cedula: '12345678', direccion: 'Calle 123, Ciudad', activo: true },
            { id: 2, nickname: 'Sofia_Dream', nombre: 'Sofia', apellido: 'Martínez', porcentaje: 65, cedula: '87654321', direccion: 'Av. Principal 456', activo: true },
            { id: 3, nickname: 'Mia_Angel', nombre: 'Mia', apellido: 'López', porcentaje: 70, cedula: '11223344', direccion: 'Plaza Central 789', activo: true },
            { id: 4, nickname: 'Ana_Bella', nombre: 'Ana', apellido: 'Rodríguez', porcentaje: 55, cedula: '44332211', direccion: 'Sector Norte 321', activo: false }
        ];
        
        this.pagos = [
            { modelo_id: 1, monto_enviado: 1200 },
            { modelo_id: 1, monto_enviado: 800 },
            { modelo_id: 2, monto_enviado: 1500 },
            { modelo_id: 2, monto_enviado: 900 },
            { modelo_id: 3, monto_enviado: 2000 },
            { modelo_id: 4, monto_enviado: 500 }
        ];
        
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadModelos();
    }

    setupEventListeners() {
        // Formulario de modelo
        const form = document.getElementById('modelFormElement');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveModelo();
            });
        }

        // Búsqueda
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterModelos(e.target.value);
            });
        }
    }

    loadModelos() {
        const tbody = document.getElementById('modelosTable');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.modelos.forEach(modelo => {
            const totalGanado = this.calculateTotalGanado(modelo.id);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>
                    <div class="model-info">
                        <strong>${modelo.nickname}</strong>
                        ${!modelo.activo ? '<span class="badge bg-secondary ml-2">Inactivo</span>' : ''}
                    </div>
                </td>
                <td>${modelo.nombre} ${modelo.apellido || ''}</td>
                <td>${modelo.porcentaje}%</td>
                <td>${modelo.cedula || 'N/A'}</td>
                <td>$${totalGanado.toFixed(2)}</td>
                <td>
                    <span class="badge ${modelo.activo ? 'bg-success' : 'bg-secondary'}">
                        ${modelo.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-sm" onclick="editModelo(${modelo.id})" data-permission="modelos">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-info btn-sm" onclick="viewModelDetails(${modelo.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn ${modelo.activo ? 'btn-warning' : 'btn-success'} btn-sm" 
                                onclick="toggleModelStatus(${modelo.id})" data-permission="modelos">
                            <i class="fas ${modelo.activo ? 'fa-pause' : 'fa-play'}"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });

        // Aplicar permisos
        this.applyPermissions();
    }

    calculateTotalGanado(modeloId) {
        return this.pagos
            .filter(pago => pago.modelo_id === modeloId)
            .reduce((total, pago) => total + pago.monto_enviado, 0);
    }

    openModelModal(id = null) {
        this.currentEditId = id;
        const form = document.getElementById('modelForm');
        const title = document.getElementById('formTitle');
        
        if (id) {
            // Modo edición
            const modelo = this.modelos.find(m => m.id === id);
            if (modelo) {
                title.textContent = 'Editar Modelo';
                this.fillForm(modelo);
            }
        } else {
            // Modo creación
            title.textContent = 'Nuevo Modelo';
            this.clearForm();
        }
        
        form.classList.remove('hidden');
        form.scrollIntoView({ behavior: 'smooth' });
    }

    fillForm(modelo) {
        document.getElementById('modelId').value = modelo.id;
        document.getElementById('nickname').value = modelo.nickname;
        document.getElementById('nombre').value = modelo.nombre;
        document.getElementById('apellido').value = modelo.apellido || '';
        document.getElementById('porcentaje').value = modelo.porcentaje;
        document.getElementById('cedula').value = modelo.cedula || '';
        document.getElementById('direccion').value = modelo.direccion || '';
    }

    clearForm() {
        document.getElementById('modelFormElement').reset();
        document.getElementById('modelId').value = '';
        this.currentEditId = null;
    }

    saveModelo() {
        if (!this.validateForm()) return;

        const formData = {
            nickname: document.getElementById('nickname').value.trim(),
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            porcentaje: parseFloat(document.getElementById('porcentaje').value),
            cedula: document.getElementById('cedula').value.trim(),
            direccion: document.getElementById('direccion').value.trim(),
            activo: true
        };

        if (this.currentEditId) {
            // Actualizar modelo existente
            const index = this.modelos.findIndex(m => m.id === this.currentEditId);
            if (index !== -1) {
                this.modelos[index] = { ...this.modelos[index], ...formData };
                this.showNotification('Modelo actualizado correctamente', 'success');
            }
        } else {
            // Crear nuevo modelo
            const newId = Math.max(...this.modelos.map(m => m.id), 0) + 1;
            this.modelos.push({ id: newId, ...formData });
            this.showNotification('Modelo creado correctamente', 'success');
        }

        this.loadModelos();
        this.cancelModelForm();
    }

    validateForm() {
        const nickname = document.getElementById('nickname').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const porcentaje = parseFloat(document.getElementById('porcentaje').value);

        if (!nickname) {
            this.showNotification('El nickname es obligatorio', 'error');
            return false;
        }

        if (!nombre) {
            this.showNotification('El nombre es obligatorio', 'error');
            return false;
        }

        if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
            this.showNotification('El porcentaje debe ser un número entre 0 y 100', 'error');
            return false;
        }

        // Verificar nickname único
        const existingModel = this.modelos.find(m => 
            m.nickname.toLowerCase() === nickname.toLowerCase() && 
            m.id !== this.currentEditId
        );
        
        if (existingModel) {
            this.showNotification('Ya existe un modelo con ese nickname', 'error');
            return false;
        }

        return true;
    }

    cancelModelForm() {
        const form = document.getElementById('modelForm');
        form.classList.add('hidden');
        this.clearForm();
    }

    editModelo(id) {
        this.openModelModal(id);
    }

    toggleModelStatus(id) {
        const modelo = this.modelos.find(m => m.id === id);
        if (modelo) {
            modelo.activo = !modelo.activo;
            this.loadModelos();
            this.showNotification(
                `Modelo ${modelo.activo ? 'activado' : 'desactivado'} correctamente`, 
                'success'
            );
        }
    }

    viewModelDetails(id) {
        const modelo = this.modelos.find(m => m.id === id);
        if (modelo) {
            const totalGanado = this.calculateTotalGanado(id);
            const pagosCount = this.pagos.filter(p => p.modelo_id === id).length;
            
            const details = `
                <strong>Información del Modelo</strong><br><br>
                <strong>Nickname:</strong> ${modelo.nickname}<br>
                <strong>Nombre:</strong> ${modelo.nombre} ${modelo.apellido || ''}<br>
                <strong>% Ganancia:</strong> ${modelo.porcentaje}%<br>
                <strong>Cédula:</strong> ${modelo.cedula || 'N/A'}<br>
                <strong>Dirección:</strong> ${modelo.direccion || 'N/A'}<br>
                <strong>Estado:</strong> ${modelo.activo ? 'Activo' : 'Inactivo'}<br><br>
                <strong>Estadísticas:</strong><br>
                <strong>Total Ganado:</strong> $${totalGanado.toFixed(2)}<br>
                <strong>Número de Pagos:</strong> ${pagosCount}
            `;
            
            this.showModal('Detalles del Modelo', details);
        }
    }

    filterModelos(searchTerm) {
        const rows = document.querySelectorAll('#modelosTable tr');
        const term = searchTerm.toLowerCase();

        rows.forEach(row => {
            const nickname = row.querySelector('td:first-child strong')?.textContent.toLowerCase() || '';
            const nombre = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
            const cedula = row.querySelector('td:nth-child(4)')?.textContent.toLowerCase() || '';

            const matches = nickname.includes(term) || 
                          nombre.includes(term) || 
                          cedula.includes(term);

            row.style.display = matches ? '' : 'none';
        });
    }

    applyPermissions() {
        const userRole = window.auth?.getUserRole();
        if (!userRole) return;

        // Ocultar botones según permisos
        const actionButtons = document.querySelectorAll('[data-permission="modelos"]');
        actionButtons.forEach(button => {
            if (!userRole.permissions.includes('modelos') && !userRole.permissions.includes('admin')) {
                button.style.display = 'none';
            }
        });

        // Solo lectura para asistentes
        if (userRole.permissions.includes('asistente') && !userRole.permissions.includes('admin')) {
            const form = document.getElementById('modelForm');
            if (form) {
                form.style.display = 'none';
            }
        }
    }

    showNotification(message, type = 'info') {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Colores según tipo
        const colors = {
            success: '#238636',
            error: '#da3633',
            warning: '#fb8500',
            info: '#0969da'
        };

        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remover después de 4 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    showModal(title, content) {
        // Crear modal simple
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                color: var(--text-primary);
            ">
                <h3 style="margin-bottom: 1rem; color: var(--text-primary);">${title}</h3>
                <div style="line-height: 1.6; margin-bottom: 1.5rem;">${content}</div>
                <button onclick="this.closest('div').parentElement.remove()" 
                        class="btn btn-primary">
                    Cerrar
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Funciones globales
function openModelModal(id = null) {
    window.modelosManager.openModelModal(id);
}

function editModelo(id) {
    window.modelosManager.editModelo(id);
}

function toggleModelStatus(id) {
    window.modelosManager.toggleModelStatus(id);
}

function viewModelDetails(id) {
    window.modelosManager.viewModelDetails(id);
}

function cancelModelForm() {
    window.modelosManager.cancelModelForm();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.modelosManager = new ModelosManager();
});
