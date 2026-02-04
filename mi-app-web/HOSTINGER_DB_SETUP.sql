-- ====================================
-- COMANDOS SQL PARA HOSTINGER
-- ====================================

-- 1. CREAR TABLAS (Ejecutar en phpMyAdmin)

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol ENUM('admin', 'vendedor', 'asistente', 'invitado') NOT NULL DEFAULT 'invitado',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    porcentaje DECIMAL(5,2) NOT NULL,
    cedula VARCHAR(50),
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ingresos
CREATE TABLE ingresos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    proveedor_id INT NOT NULL,
    tokens INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha DATE NOT NULL,
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

-- Tabla de pagos
CREATE TABLE pagos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    modelo_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    tokens INT NOT NULL,
    monto_generado DECIMAL(10,2) NOT NULL,
    monto_enviado DECIMAL(10,2) NOT NULL,
    diferencia DECIMAL(10,2) AS (monto_generado - monto_enviado) STORED,
    fecha DATE NOT NULL,
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (modelo_id) REFERENCES modelos(id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

-- ====================================
-- 2. INSERTAR DATOS DE EJEMPLO
-- ====================================

-- Usuarios demo (contraseña: password)
INSERT INTO usuarios (email, password, nombre, rol) VALUES
('admin@token.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin'),
('vendedor@token.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vendedor User', 'vendedor'),
('asistente@token.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Asistente User', 'asistente'),
('invitado@token.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Invitado User', 'invitado');

-- Proveedores demo
INSERT INTO proveedores (nombre, descripcion) VALUES
('OnlyFans', 'Plataforma de contenido premium'),
('Chaturbate', 'Plataforma de streaming en vivo'),
('StripChat', 'Plataforma de chat en vivo'),
('MyFreeCams', 'Plataforma de cámaras web');

-- Modelos demo
INSERT INTO modelos (nickname, nombre, apellido, porcentaje, cedula, direccion) VALUES
('Luna_Star', 'Luna', 'García', 60.00, '12345678', 'Calle 123, Ciudad'),
('Sofia_Dream', 'Sofia', 'Martínez', 65.00, '87654321', 'Av. Principal 456'),
('Mia_Angel', 'Mia', 'López', 70.00, '11223344', 'Plaza Central 789'),
('Ana_Bella', 'Ana', 'Rodríguez', 55.00, '44332211', 'Sector Norte 321');

-- Ingresos demo
INSERT INTO ingresos (proveedor_id, tokens, monto, fecha, notas) VALUES
(1, 25000, 1250.00, '2024-01-15', 'Ingreso mensual OnlyFans'),
(2, 18000, 900.00, '2024-01-14', 'Tokens Chaturbate'),
(3, 32000, 1600.00, '2024-01-13', 'StripChat - semana 1'),
(4, 15000, 750.00, '2024-01-12', 'MyFreeCams enero');

-- Pagos demo
INSERT INTO pagos (modelo_id, proveedor_id, tokens, monto_generado, monto_enviado, fecha, notas) VALUES
(1, 1, 15000, 450.00, 450.00, '2024-01-15', 'Pago completo Luna'),
(2, 2, 12000, 390.00, 380.00, '2024-01-14', 'Pago Sofia'),
(3, 3, 20000, 700.00, 700.00, '2024-01-13', 'Pago completo Mia'),
(4, 4, 10000, 275.00, 270.00, '2024-01-12', 'Pago Ana');
