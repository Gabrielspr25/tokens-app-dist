// Gestión de Pagos - JavaScript Mejorado
class PagosManager {
    constructor() {
        this.pagos = [];
        this.modelos = [];
        this.proveedores = [];
        this.filtros = {
            modelo: '',
            estado: '',
            fechaInicio: '',
            fechaFin: ''
        };
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.loadModelos();
    }

    // Cargar datos desde localStorage o API
    async loadData() {
        try {
            // Simular carga desde API
            this.pagos = [
                {
                    id: 1,
                    modelo_id: 2,
                    proveedor_id: 1,
                    tokens: 1000,
                    monto_generado: 37.50,
                    monto_enviado: 37.50,
                    diferencia: 0,
                    fecha: '2024-01-15',
                    notas: 'Pago completo'
                },
                {
                    id: 2,
                    modelo_id: 3,
                    proveedor_id: 2,
                    tokens: 800,
                    monto_generado: 30.00,
                    monto_enviado: 30.00,
                    diferencia: 0,
                    fecha: '2024-01-14',
                    notas: 'Pago via PayPal'
                }
            ];
            
            this.modelos = [
                { id: 1, nickname: 'Luna_Star', porcentaje: 50.00 },
                { id: 2, nickname: 'Venus_Love', porcentaje: 75.00 },
                { id: 3, nickname: 'Diana sanchez', porcentaje: 75.00 }
            ];
            
            this.proveedores = [
                { id: 1, nombre: 'OnlyFans' },
                { id: 2, nombre: 'Chaturbate' },
                { id: 3, nombre: 'StripChat' }
            ];
            
            this.renderPagos();
            this.updateStats();
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    }

    // Cargar modelos en la calculadora
    loadModelos() {
        const select = document.getElementById('calcModelo');
        if (select) {
            select.innerHTML = '<option value="">Seleccionar modelo...</option>';
            this.modelos.forEach(modelo => {
                const option = document.createElement('option');
                option.value = modelo.id;
                option.textContent = `${modelo.nickname} (${modelo.porcentaje}%)`;
                option.dataset.porcentaje = modelo.porcentaje;
                select.appendChild(option);
            });
        }
    }

    setupEventListeners() {
        // Filtros
        const filterModelo = document.getElementById('filterModelo');
        const filterEstado = document.getElementById('filterEstado');
        
        if (filterModelo) {
            filterModelo.addEventListener('change', () => {
                this.filtros.modelo = filterModelo.value;
                this.aplicarFiltros();
            });
        }
        
        if (filterEstado) {
            filterEstado.addEventListener('change', () => {
                this.filtros.estado = filterEstado.value;
                this.aplicarFiltros();
            });
        }

        // Cargar opciones de filtro de modelos
        this.loadFilterModelos();
    }

    loadFilterModelos() {
        const filterModelo = document.getElementById('filterModelo');
        if (filterModelo && this.modelos.length > 0) {
            filterModelo.innerHTML = '<option value="">Todos los modelos</option>';
            this.modelos.forEach(modelo => {
                const option = document.createElement('option');
                option.value = modelo.id;
                option.textContent = modelo.nickname;
                filterModelo.appendChild(option);
            });
        }
    }

    // Aplicar filtros
    aplicarFiltros() {
        const fechaInicio = document.getElementById('filterFechaInicio')?.value;
        const fechaFin = document.getElementById('filterFechaFin')?.value;
        
        this.filtros.fechaInicio = fechaInicio;
        this.filtros.fechaFin = fechaFin;

        let pagosFiltrados = [...this.pagos];

        // Filtro por modelo
        if (this.filtros.modelo) {
            pagosFiltrados = pagosFiltrados.filter(pago => 
                pago.modelo_id == this.filtros.modelo
            );
        }

        // Filtro por estado
        if (this.filtros.estado) {
            if (this.filtros.estado === 'completo') {
                pagosFiltrados = pagosFiltrados.filter(pago => pago.diferencia === 0);
            } else if (this.filtros.estado === 'diferencia') {
                pagosFiltrados = pagosFiltrados.filter(pago => pago.diferencia !== 0);
            }
        }

        // Filtro por fecha
        if (this.filtros.fechaInicio) {
            pagosFiltrados = pagosFiltrados.filter(pago => 
                pago.fecha >= this.filtros.fechaInicio
            );
        }

        if (this.filtros.fechaFin) {
            pagosFiltrados = pagosFiltrados.filter(pago => 
                pago.fecha <= this.filtros.fechaFin
            );
        }

        this.renderPagos(pagosFiltrados);
        this.updateTotalizador(pagosFiltrados);
        this.showTotalizador();
    }

    // Limpiar filtros
    limpiarFiltros() {
        this.filtros = {
            modelo: '',
            estado: '',
            fechaInicio: '',
            fechaFin: ''
        };

        // Limpiar inputs
        document.getElementById('filterModelo').value = '';
        document.getElementById('filterEstado').value = '';
        document.getElementById('filterFechaInicio').value = '';
        document.getElementById('filterFechaFin').value = '';

        this.renderPagos();
        this.hideTotalizador();
    }

    // Mostrar/ocultar totalizador
    showTotalizador() {
        const totalizador = document.getElementById('totalizadorFiltros');
        if (totalizador) {
            totalizador.style.display = 'block';
            totalizador.classList.add('show');
        }
    }

    hideTotalizador() {
        const totalizador = document.getElementById('totalizadorFiltros');
        if (totalizador) {
            totalizador.style.display = 'none';
            totalizador.classList.remove('show');
        }
    }

    // Actualizar totalizador con datos filtrados
    updateTotalizador(pagosFiltrados = null) {
        const pagos = pagosFiltrados || this.pagos;
        
        const totalRegistros = pagos.length;
        const totalTokens = pagos.reduce((sum, pago) => sum + pago.tokens, 0);
        const totalGenerado = pagos.reduce((sum, pago) => sum + pago.monto_generado, 0);
        const totalEnviado = pagos.reduce((sum, pago) => sum + pago.monto_enviado, 0);
        const totalDiferencia = pagos.reduce((sum, pago) => sum + pago.diferencia, 0);

        // Actualizar elementos
        this.updateElement('totalRegistrosFiltro', totalRegistros.toLocaleString());
        this.updateElement('totalTokensFiltro', totalTokens.toLocaleString());
        this.updateElement('totalGeneradoFiltro', `$${totalGenerado.toFixed(2)}`);
        this.updateElement('totalEnviadoFiltro', `$${totalEnviado.toFixed(2)}`);
        this.updateElement('totalDiferenciaFiltro', `$${totalDiferencia.toFixed(2)}`);
    }

    // Renderizar tabla de pagos
    renderPagos(pagosFiltrados = null) {
        const tbody = document.getElementById('pagosTable');
        if (!tbody) return;

        const pagos = pagosFiltrados || this.pagos;
        
        tbody.innerHTML = pagos.map(pago => {
            const modelo = this.modelos.find(m => m.id === pago.modelo_id);
            const proveedor = this.proveedores.find(p => p.id === pago.proveedor_id);
            
            const estado = pago.diferencia === 0 ? 
                '<span class="badge badge-success">Completo</span>' :
                '<span class="badge badge-warning">Con Diferencia</span>';

            return `
                <tr>
                    <td>${this.formatDate(pago.fecha)}</td>
                    <td>${modelo?.nickname || 'N/A'}</td>
                    <td>${proveedor?.nombre || 'N/A'}</td>
                    <td>${pago.tokens.toLocaleString()}</td>
                    <td>${modelo?.porcentaje || 0}%</td>
                    <td>$${pago.monto_generado.toFixed(2)}</td>
                    <td>$${pago.monto_enviado.toFixed(2)}</td>
                    <td class="${pago.diferencia > 0 ? 'text-warning' : pago.diferencia < 0 ? 'text-danger' : 'text-success'}">
                        $${pago.diferencia.toFixed(2)}
                    </td>
                    <td>${estado}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary" onclick="editarPago(${pago.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarPago(${pago.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Actualizar estadísticas generales
    updateStats() {
        const totalPagadoMes = this.pagos
            .filter(pago => this.isCurrentMonth(pago.fecha))
            .reduce((sum, pago) => sum + pago.monto_enviado, 0);

        const pagosPendientes = this.pagos
            .filter(pago => pago.diferencia > 0)
            .reduce((sum, pago) => sum + pago.diferencia, 0);

        const totalDiferencias = this.pagos
            .reduce((sum, pago) => sum + Math.abs(pago.diferencia), 0);

        const modelosPagados = new Set(this.pagos.map(pago => pago.modelo_id)).size;

        this.updateElement('totalPagadoMes', `$${totalPagadoMes.toFixed(2)}`);
        this.updateElement('pagosPendientes', `$${pagosPendientes.toFixed(2)}`);
        this.updateElement('totalDiferencias', `$${totalDiferencias.toFixed(2)}`);
        this.updateElement('modelosPagados', modelosPagados);
    }

    // Calculadora de pagos
    calcularPago() {
        const tokens = parseFloat(document.getElementById('calcTokens')?.value) || 0;
        const modeloSelect = document.getElementById('calcModelo');
        const porcentajeManual = parseFloat(document.getElementById('calcPorcentajeManual')?.value);
        const precioToken = parseFloat(document.getElementById('calcPrecioToken')?.value) || 0.05;

        let porcentaje = 0;
        
        // Usar porcentaje manual o del modelo seleccionado
        if (porcentajeManual) {
            porcentaje = porcentajeManual;
        } else if (modeloSelect?.value) {
            const selectedOption = modeloSelect.options[modeloSelect.selectedIndex];
            porcentaje = parseFloat(selectedOption.dataset.porcentaje) || 0;
        }

        // Cálculos
        const valorBase = tokens * precioToken;
        const gananciaModelo = valorBase * (porcentaje / 100);

        // Actualizar displays
        this.updateElement('calcTokensDisplay', tokens.toLocaleString());
        this.updateElement('calcPrecioDisplay', `$${precioToken.toFixed(3)}`);
        this.updateElement('calcPorcentajeDisplay', `${porcentaje}%`);
        this.updateElement('calcValorBase', `$${valorBase.toFixed(2)}`);
        this.updateElement('calcGanancia', `$${gananciaModelo.toFixed(2)}`);
        this.updateElement('calcFormula', `${tokens} × $${precioToken} × ${porcentaje}% = $${gananciaModelo.toFixed(2)}`);
    }

    // Limpiar calculadora
    limpiarCalculadora() {
        document.getElementById('calcTokens').value = '';
        document.getElementById('calcModelo').value = '';
        document.getElementById('calcPorcentajeManual').value = '';
        document.getElementById('calcPrecioToken').value = '0.05';
        this.calcularPago();
    }

    // Copiar resultado de calculadora
    copiarResultado() {
        const ganancia = document.getElementById('calcGanancia')?.textContent || '$0.00';
        const formula = document.getElementById('calcFormula')?.textContent || '';
        
        const texto = `Ganancia del Modelo: ${ganancia}\nFórmula: ${formula}`;
        
        navigator.clipboard.writeText(texto).then(() => {
            this.showNotification('Resultado copiado al portapapeles', 'success');
        }).catch(() => {
            this.showNotification('Error al copiar al portapapeles', 'error');
        });
    }

    // Exportar pagos
    exportarPagos() {
        const pagosFiltrados = this.getPagosFiltrados();
        
        // Preparar datos para CSV
        const headers = ['Fecha', 'Modelo', 'Proveedor', 'Tokens', '% Modelo', 'Generado', 'Enviado', 'Diferencia', 'Estado', 'Notas'];
        
        const csvData = pagosFiltrados.map(pago => {
            const modelo = this.modelos.find(m => m.id === pago.modelo_id);
            const proveedor = this.proveedores.find(p => p.id === pago.proveedor_id);
            const estado = pago.diferencia === 0 ? 'Completo' : 'Con Diferencia';
            
            return [
                pago.fecha,
                modelo?.nickname || 'N/A',
                proveedor?.nombre || 'N/A',
                pago.tokens,
                `${modelo?.porcentaje || 0}%`,
                `$${pago.monto_generado.toFixed(2)}`,
                `$${pago.monto_enviado.toFixed(2)}`,
                `$${pago.diferencia.toFixed(2)}`,
                estado,
                pago.notas || ''
            ];
        });

        // Crear CSV
        const csvContent = [headers, ...csvData]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        // Descargar archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `pagos_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('Archivo exportado exitosamente', 'success');
    }

    // Obtener pagos filtrados actuales
    getPagosFiltrados() {
        let pagosFiltrados = [...this.pagos];

        if (this.filtros.modelo) {
            pagosFiltrados = pagosFiltrados.filter(pago => pago.modelo_id == this.filtros.modelo);
        }

        if (this.filtros.estado) {
            if (this.filtros.estado === 'completo') {
                pagosFiltrados = pagosFiltrados.filter(pago => pago.diferencia === 0);
            } else if (this.filtros.estado === 'diferencia') {
                pagosFiltrados = pagosFiltrados.filter(pago => pago.diferencia !== 0);
            }
        }

        if (this.filtros.fechaInicio) {
            pagosFiltrados = pagosFiltrados.filter(pago => pago.fecha >= this.filtros.fechaInicio);
        }

        if (this.filtros.fechaFin) {
            pagosFiltrados = pagosFiltrados.filter(pago => pago.fecha <= this.filtros.fechaFin);
        }

        return pagosFiltrados;
    }

    // Utilidades
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }

    isCurrentMonth(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }

    showNotification(message, type = 'info') {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Funciones globales
function openCalculadoraPagos() {
    document.getElementById('calculadoraModal').classList.remove('hidden');
}

function closeCalculadora() {
    document.getElementById('calculadoraModal').classList.add('hidden');
}

function aplicarFiltros() {
    if (window.pagosManager) {
        window.pagosManager.aplicarFiltros();
    }
}

function limpiarFiltros() {
    if (window.pagosManager) {
        window.pagosManager.limpiarFiltros();
    }
}

function exportarPagos() {
    if (window.pagosManager) {
        window.pagosManager.exportarPagos();
    }
}

function calcularPago() {
    if (window.pagosManager) {
        window.pagosManager.calcularPago();
    }
}

function limpiarCalculadora() {
    if (window.pagosManager) {
        window.pagosManager.limpiarCalculadora();
    }
}

function copiarResultado() {
    if (window.pagosManager) {
        window.pagosManager.copiarResultado();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.pagosManager = new PagosManager();
});