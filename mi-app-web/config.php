<?php
// ====================================
// CONFIGURACIÓN PARA cam.ss-group.cloud
// ====================================

// Datos de conexión de tu Hostinger
define('DB_HOST', 'localhost');
define('DB_NAME', 'u478615095_Cam');
define('DB_USER', 'u478615095_gabriel70049ca');
define('DB_PASS', 'Gaby0824@a');

// Configuración de la aplicación
define('APP_NAME', 'Token Manager');
define('TOKEN_RATE', 0.05); // $0.05 por token

// Zona horaria
date_default_timezone_set('America/Lima');

// Configuración de errores (0 en producción)
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
        die("Error de conexión a la base de datos. Verifica la configuración.");
    }
}
?>
