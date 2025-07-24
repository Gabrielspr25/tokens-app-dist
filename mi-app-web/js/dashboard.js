// Dashboard JavaScript
class DashboardManager {
    constructor() {
        this.tokenRate = 0.05; // $0.05 por token
        this.charts = {};
        this.data = {
            ingresos: [],
            pagos: [],
            modelos: [],
            proveedores: []
        };
        
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.renderDashboard();
    }

    loadSampleData() {
        // Datos de ejemplo para el dashboard
        this.data = {
            proveedores: [
                { id: 1, nombre: 'OnlyFans' },
                { id: 2, nombre: 'Chaturbate' },
                { id: 3, nombre: 'StripChat' },
                { id: 4, nombre: 'MyFreeCams' }
            ],
            modelos: [
                { id: 1, nickname: 'Luna_Star', nombre: 'Luna', apellido: 'García', porcentaje: 60 },
                { id: 2, nickname: 'Sofia_Dream', nombre: 'Sofia', apellido: 'Martínez', porcentaje: 65 },
                { id: 3, nickname: 'Mia_Angel', nombre: 'Mia', apellido: 'López', porcentaje: 70 },
                { id: 4, nickname: 'Ana_Bella', nombre: 'Ana', apellido: 'Rodríguez', porcentaje: 55 }
            ],
            ingresos: [
                { id: 1, proveedor_id: 1, tokens: 25000, fecha: '2024-01-15', monto: 1250 },
                { id: 2, proveedor_id: 2, tokens: 18000, fecha: '2024-01-14', monto: 900 },
                { id: 3, proveedor_id: 3, tokens: 32000, fecha: '2024-01-13', monto: 1600 },
                { id: 4, proveedor_id: 1, tokens: 28000, fecha: '2024-01-12', monto: 1400 },
                { id: 5, proveedor_id: 4, tokens: 15000, fecha: '2024-01-11', monto: 750 }
            ],
            pagos: [
                { id: 1, modelo_id: 1, proveedor_id: 1, tokens: 15000, fecha: '2024-01-15', monto_generado: 450, monto_enviado: 450, diferencia: 0 },
                { id: 2, modelo_id: 2, proveedor_id: 2, tokens: 12000, fecha: '2024-01-14', monto_generado: 390, monto_enviado: 380, diferencia: 10 },
                { id: 3, modelo_id: 3, proveedor_id: 3, tokens: 20000, fecha: '2024-01-13', monto_generado: 700, monto_enviado: 700, diferencia: 0 },
                { id: 4, modelo_id: 4, proveedor_id: 1, tokens: 10000, fecha: '2024-01-12', monto_generado: 275, monto_enviado: 270, diferencia: 5 }
            ]
        };
    }

    setupEventListeners() {
        // Filtro de fecha
        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.updateDashboard());
        }

        // Botón de actualizar
        const refreshBtn = document.querySelector('[onclick="refreshDashboard()"]');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshDashboard());
        }
    }

    renderDashboard() {
        this.updateStats();
        this.renderCharts();
        this.loadRecentTransactions();
        this.loadTopModels();
    }

    updateStats() {
        // Calcular estadísticas
        const totalTokens = this.data.ingresos.reduce((sum, ingreso) => sum + ingreso.tokens, 0);
        const totalRevenue = totalTokens * this.tokenRate;
        const totalPaid = this.data.pagos.reduce((sum, pago) => sum + pago.monto_enviado, 0);
        const netProfit = totalRevenue - totalPaid;

        // Actualizar elementos del DOM
        document.getElementById('totalTokens').textContent = totalTokens.toLocaleString();
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('totalPaid').textContent = `$${totalPaid.toFixed(2)}`;
        document.getElementById('netProfit').textContent = `$${netProfit.toFixed(2)}`;

        // Cambiar color según ganancia/pérdida
        const profitElement = document.getElementById('netProfit');
        if (netProfit >= 0) {
            profitElement.className = 'stat-value text-success';
        } else {
            profitElement.className = 'stat-value text-danger';
        }
    }

    renderCharts() {
        this.renderProviderChart();
        this.renderTrendChart();
    }

    renderProviderChart() {
        const ctx = document.getElementById('providerChart').getContext('2d');
        
        // Agrupar ingresos por proveedor
        const providerData = {};
        this.data.ingresos.forEach(ingreso => {
            const proveedor = this.data.proveedores.find(p => p.id === ingreso.proveedor_id);
            if (proveedor) {
                if (!providerData[proveedor.nombre]) {
                    providerData[proveedor.nombre] = 0;
                }
                providerData[proveedor.nombre] += ingreso.monto;
            }
        });

        this.charts.providerChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(providerData),
                datasets: [{
                    data: Object.values(providerData),
                    backgroundColor: [
                        '#238636',
                        '#2ea043',
                        '#56d364',
                        '#7dd3fc',
                        '#fb8500'
                    ],
                    borderColor: '#21262d',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#f0f6fc',
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    renderTrendChart() {
        const ctx = document.getElementById('trendChart').getContext('2d');
        
        // Datos de tendencia mensual (últimos 6 meses)
        const months = ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene'];
        const ingresos = [3200, 3800, 4100, 3900, 4500, 5900];
        const pagos = [1800, 2100, 2300, 2200, 2600, 3400];

        this.charts.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Ingresos',
                        data: ingresos,
                        borderColor: '#238636',
                        backgroundColor: 'rgba(35, 134, 54, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Pagos',
                        data: pagos,
                        borderColor: '#fb8500',
                        backgroundColor: 'rgba(251, 133, 0, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#8b949e',
                            callback: function(value) {
                                return '$' + value;
                            }
                        },
                        grid: {
                            color: '#30363d'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#8b949e'
                        },
                        grid: {
                            color: '#30363d'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#f0f6fc'
                        }
                    }
                }
            }
        });
    }

    loadRecentTransactions() {
        const tbody = document.getElementById('transactionsTable');
        if (!tbody) return;

        tbody.innerHTML = '';

        // Combinar ingresos y pagos para mostrar transacciones recientes
        const transactions = [];

        // Agregar ingresos
        this.data.ingresos.forEach(ingreso => {
            const proveedor = this.data.proveedores.find(p => p.id === ingreso.proveedor_id);
            transactions.push({
                fecha: ingreso.fecha,
                tipo: 'Ingreso',
                entidad: proveedor?.nombre || 'Desconocido',
                tokens: ingreso.tokens,
                monto: ingreso.monto,
                estado: 'Completado'
            });
        });

        // Agregar pagos
        this.data.pagos.forEach(pago => {
            const modelo = this.data.modelos.find(m => m.id === pago.modelo_id);
            transactions.push({
                fecha: pago.fecha,
                tipo: 'Pago',
                entidad: modelo?.nickname || 'Desconocido',
                tokens: pago.tokens,
                monto: pago.monto_enviado,
                estado: pago.diferencia === 0 ? 'Pagado' : 'Pendiente'
            });
        });

        // Ordenar por fecha (más recientes primero)
        transactions.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // Mostrar solo las 10 más recientes
        transactions.slice(0, 10).forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.formatDate(transaction.fecha)}</td>
                <td>
                    <span class="badge ${transaction.tipo === 'Ingreso' ? 'bg-success' : 'bg-warning'}">
                        ${transaction.tipo}
                    </span>
                </td>
                <td>${transaction.entidad}</td>
                <td>${transaction.tokens.toLocaleString()}</td>
                <td>$${transaction.monto.toFixed(2)}</td>
                <td>
                    <span class="badge ${this.getStatusBadgeClass(transaction.estado)}">
                        ${transaction.estado}
                    </span>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    loadTopModels() {
        const tbody = document.getElementById('topModelsTable');
        if (!tbody) return;

        tbody.innerHTML = '';

        // Calcular estadísticas por modelo
        const modelStats = this.data.modelos.map(modelo => {
            const pagosModelo = this.data.pagos.filter(p => p.modelo_id === modelo.id);
            const totalTokens = pagosModelo.reduce((sum, pago) => sum + pago.tokens, 0);
            const totalGanado = pagosModelo.reduce((sum, pago) => sum + pago.monto_enviado, 0);
            const ultimoPago = pagosModelo.length > 0 ? 
                Math.max(...pagosModelo.map(p => new Date(p.fecha))) : null;

            return {
                ...modelo,
                totalTokens,
                totalGanado,
                ultimoPago: ultimoPago ? new Date(ultimoPago) : null
            };
        });

        // Ordenar por tokens generados
        modelStats.sort((a, b) => b.totalTokens - a.totalTokens);

        // Calcular porcentaje de participación
        const totalAllTokens = modelStats.reduce((sum, model) => sum + model.totalTokens, 0);

        modelStats.forEach(modelo => {
            const participacion = totalAllTokens > 0 ? (modelo.totalTokens / totalAllTokens * 100) : 0;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="model-info">
                        <strong>${modelo.nickname}</strong>
                        <br>
                        <small class="text-muted">${modelo.nombre} ${modelo.apellido}</small>
                    </div>
                </td>
                <td>${modelo.totalTokens.toLocaleString()}</td>
                <td>$${modelo.totalGanado.toFixed(2)}</td>
                <td>${participacion.toFixed(1)}%</td>
                <td>${modelo.ultimoPago ? this.formatDate(modelo.ultimoPago) : 'N/A'}</td>
            `;
            tbody.appendChild(row);
        });
    }

    formatDate(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    getStatusBadgeClass(status) {
        switch (status) {
            case 'Completado':
            case 'Pagado':
                return 'bg-success';
            case 'Pendiente':
                return 'bg-warning';
            case 'Error':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    }

    updateDashboard() {
        // Actualizar dashboard según filtros
        this.renderDashboard();
    }

    refreshDashboard() {
        // Simular carga de datos
        const button = event.target.closest('button');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
        button.disabled = true;

        setTimeout(() => {
            this.renderDashboard();
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }
}

// Agregar estilos para badges
const badgeStyles = `
    .badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 0.375rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .bg-success { background-color: #238636; color: white; }
    .bg-warning { background-color: #fb8500; color: white; }
    .bg-danger { background-color: #da3633; color: white; }
    .bg-secondary { background-color: #6e7681; color: white; }
    
    .model-info strong {
        color: var(--text-primary);
    }
    .text-muted {
        color: var(--text-muted) !important;
    }
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = badgeStyles;
document.head.appendChild(styleSheet);

// Inicializar dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DashboardManager();
    window.dashboard = dashboard;
});

// Función global para refresh
function refreshDashboard() {
    if (window.dashboard) {
        window.dashboard.refreshDashboard();
    }
}
