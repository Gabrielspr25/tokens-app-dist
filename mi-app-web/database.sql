-- Base de datos para Token Manager
-- Compatible con MySQL/MariaDB en Hostinger

CREATE DATABASE IF NOT EXISTS token_manager;
USE token_manager;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol ENUM('admin', 'vendedor', 'asistente', 'invitado') NOT NULL DEFAULT 'invitado',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL
);

-- Tabla de proveedores
CREATE TABLE proveedores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de modelos
CREATE TABLE modelos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nickname VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    porcentaje DECIMAL(5,2) NOT NULL, -- 0.00 a 100.00
    cedula VARCHAR(50),
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ingresos (tokens recibidos de proveedores)
CREATE TABLE ingresos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    proveedor_id INT NOT NULL,
    tokens INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL, -- Tokens * 0.05
    fecha DATE NOT NULL,
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

-- Tabla de pagos a modelos
CREATE TABLE pagos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    modelo_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    tokens INT NOT NULL,
    monto_generado DECIMAL(10,2) NOT NULL, -- Tokens * 0.05 * porcentaje_modelo
    monto_enviado DECIMAL(10,2) NOT NULL, -- Lo que realmente se envió
    diferencia DECIMAL(10,2) GENERATED ALWAYS AS (monto_generado - monto_enviado) STORED,
    fecha DATE NOT NULL,
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (modelo_id) REFERENCES modelos(id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

-- Tabla de sesiones (opcional)
CREATE TABLE sesiones (
    id VARCHAR(128) PRIMARY KEY,
    usuario_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Insertar usuarios demo
INSERT INTO usuarios (email, password, nombre, rol) VALUES
('admin@token.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin'),
('vendedor@token.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vendedor User', 'vendedor'),
('asistente@token.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Asistente User', 'asistente'),
('invitado@token.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Invitado User', 'invitado');

-- Insertar proveedores demo
INSERT INTO proveedores (nombre, descripcion) VALUES
('OnlyFans', 'Plataforma de contenido premium'),
('Chaturbate', 'Plataforma de streaming en vivo'),
('StripChat', 'Plataforma de chat en vivo'),
('MyFreeCams', 'Plataforma de cámaras web');

-- Insertar modelos demo
INSERT INTO modelos (nickname, nombre, apellido, porcentaje, cedula, direccion) VALUES
('Luna_Star', 'Luna', 'García', 60.00, '12345678', 'Calle 123, Ciudad'),
('Sofia_Dream', 'Sofia', 'Martínez', 65.00, '87654321', 'Av. Principal 456'),
('Mia_Angel', 'Mia', 'López', 70.00, '11223344', 'Plaza Central 789'),
('Ana_Bella', 'Ana', 'Rodríguez', 55.00, '44332211', 'Sector Norte 321');

-- Insertar ingresos demo
INSERT INTO ingresos (proveedor_id, tokens, monto, fecha, notas) VALUES
(1, 25000, 1250.00, '2024-01-15', 'Ingreso mensual OnlyFans'),
(2, 18000, 900.00, '2024-01-14', 'Tokens Chaturbate'),
(3, 32000, 1600.00, '2024-01-13', 'StripChat - semana 1'),
(4, 15000, 750.00, '2024-01-12', 'MyFreeCams enero');

-- Insertar pagos demo
INSERT INTO pagos (modelo_id, proveedor_id, tokens, monto_generado, monto_enviado, fecha, notas) VALUES
(1, 1, 15000, 450.00, 450.00, '2024-01-15', 'Pago completo Luna'),
(2, 2, 12000, 390.00, 380.00, '2024-01-14', 'Pago Sofia - descuento comisión'),
(3, 3, 20000, 700.00, 700.00, '2024-01-13', 'Pago completo Mia'),
(4, 4, 10000, 275.00, 270.00, '2024-01-12', 'Pago Ana - ajuste');

-- Crear índices para optimización
CREATE INDEX idx_ingresos_fecha ON ingresos(fecha);
CREATE INDEX idx_ingresos_proveedor ON ingresos(proveedor_id);
CREATE INDEX idx_pagos_fecha ON pagos(fecha);
CREATE INDEX idx_pagos_modelo ON pagos(modelo_id);
CREATE INDEX idx_pagos_proveedor ON pagos(proveedor_id);

-- Vistas útiles para reportes
CREATE VIEW vista_resumen_mensual AS
SELECT 
    DATE_FORMAT(fecha, '%Y-%m') as mes,
    SUM(tokens) as total_tokens,
    SUM(monto) as total_ingresos
FROM ingresos 
GROUP BY DATE_FORMAT(fecha, '%Y-%m')
ORDER BY mes DESC;

CREATE VIEW vista_modelo_estadisticas AS
SELECT 
    m.id,
    m.nickname,
    m.nombre,
    m.apellido,
    m.porcentaje,
    COUNT(p.id) as total_pagos,
    SUM(p.tokens) as total_tokens,
    SUM(p.monto_enviado) as total_ganado,
    AVG(p.monto_enviado) as promedio_pago,
    MAX(p.fecha) as ultimo_pago
FROM modelos m
LEFT JOIN pagos p ON m.id = p.modelo_id
WHERE m.activo = TRUE
GROUP BY m.id;

CREATE VIEW vista_proveedor_estadisticas AS
SELECT 
    p.id,
    p.nombre,
    COUNT(i.id) as total_ingresos,
    SUM(i.tokens) as total_tokens,
    SUM(i.monto) as total_monto,
    AVG(i.tokens) as promedio_tokens,
    MAX(i.fecha) as ultimo_ingreso
FROM proveedores p
LEFT JOIN ingresos i ON p.id = i.proveedor_id
WHERE p.activo = TRUE
GROUP BY p.id;

-- Procedimientos almacenados útiles
DELIMITER //

CREATE PROCEDURE sp_resumen_dashboard(IN fecha_inicio DATE, IN fecha_fin DATE)
BEGIN
    SELECT 
        'ingresos' as tipo,
        SUM(tokens) as total_tokens,
        SUM(monto) as total_monto
    FROM ingresos 
    WHERE fecha BETWEEN fecha_inicio AND fecha_fin
    
    UNION ALL
    
    SELECT 
        'pagos' as tipo,
        SUM(tokens) as total_tokens,
        SUM(monto_enviado) as total_monto
    FROM pagos 
    WHERE fecha BETWEEN fecha_inicio AND fecha_fin;
END //

CREATE PROCEDURE sp_calcular_pago_modelo(
    IN p_tokens INT,
    IN p_modelo_id INT,
    OUT p_porcentaje DECIMAL(5,2),
    OUT p_monto_generado DECIMAL(10,2)
)
BEGIN
    SELECT porcentaje INTO p_porcentaje 
    FROM modelos 
    WHERE id = p_modelo_id AND activo = TRUE;
    
    SET p_monto_generado = (p_tokens * 0.05 * p_porcentaje / 100);
END //

DELIMITER ;

-- Triggers para auditoría
CREATE TABLE auditoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tabla VARCHAR(50) NOT NULL,
    operacion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    registro_id INT NOT NULL,
    datos_anteriores JSON,
    datos_nuevos JSON,
    usuario VARCHAR(255),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comentarios para documentación
ALTER TABLE usuarios COMMENT = 'Tabla de usuarios del sistema con roles y permisos';
ALTER TABLE proveedores COMMENT = 'Empresas/plataformas que envían tokens';
ALTER TABLE modelos COMMENT = 'Modelos que reciben pagos con sus porcentajes';
ALTER TABLE ingresos COMMENT = 'Registro de tokens recibidos de proveedores';
ALTER TABLE pagos COMMENT = 'Pagos realizados a modelos con cálculos automáticos';
