<?php
// ====================================
// CONFIGURACIÓN PARA HOSTINGER
// ====================================

// REEMPLAZA ESTOS VALORES CON TUS DATOS REALES DE HOSTINGER:
define('DB_HOST', 'localhost');
define('DB_NAME', 'TU_USUARIO_tokens_db');  // ← Cambia esto
define('DB_USER', 'TU_USUARIO_db_user');    // ← Cambia esto  
define('DB_PASS', 'TU_CONTRASEÑA_AQUI');    // ← Cambia esto

// Configuración de la aplicación
define('APP_NAME', 'Token Manager');
define('TOKEN_RATE', 0.05); // $0.05 por token

// Zona horaria
date_default_timezone_set('America/Lima');

// Configuración de errores (cambiar a 0 en producción)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers de seguridad
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Función de conexión a la base de datos
function getConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        die("Error de conexión: " . $e->getMessage());
    }
}
?>
