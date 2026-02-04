<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getConnection();
    
    switch ($method) {
        case 'GET':
            // Obtener todos los modelos
            $stmt = $pdo->query("
                SELECT m.*, 
                       COALESCE(SUM(p.monto_enviado), 0) as total_ganado,
                       COUNT(p.id) as total_pagos
                FROM modelos m 
                LEFT JOIN pagos p ON m.id = p.modelo_id 
                GROUP BY m.id 
                ORDER BY m.nickname ASC
            ");
            $modelos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true, 
                'data' => $modelos
            ]);
            break;
            
        case 'POST':
            // Crear nuevo modelo
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Validaciones
            if (empty($input['nickname']) || empty($input['nombre']) || !isset($input['porcentaje'])) {
                echo json_encode([
                    'success' => false, 
                    'message' => 'Nickname, nombre y porcentaje son obligatorios'
                ]);
                break;
            }
            
            // Verificar nickname único
            $stmt = $pdo->prepare("SELECT id FROM modelos WHERE nickname = ?");
            $stmt->execute([$input['nickname']]);
            if ($stmt->fetch()) {
                echo json_encode([
                    'success' => false, 
                    'message' => 'El nickname ya existe'
                ]);
                break;
            }
            
            // Insertar modelo
            $stmt = $pdo->prepare("
                INSERT INTO modelos (nickname, nombre, apellido, porcentaje, cedula, direccion, activo, fecha_creacion) 
                VALUES (?, ?, ?, ?, ?, ?, 1, NOW())
            ");
            
            $result = $stmt->execute([
                $input['nickname'],
                $input['nombre'],
                $input['apellido'] ?? null,
                $input['porcentaje'],
                $input['cedula'] ?? null,
                $input['direccion'] ?? null
            ]);
            
            if ($result) {
                $newId = $pdo->lastInsertId();
                echo json_encode([
                    'success' => true, 
                    'message' => 'Modelo creado exitosamente',
                    'id' => $newId
                ]);
            } else {
                echo json_encode([
                    'success' => false, 
                    'message' => 'Error al crear modelo'
                ]);
            }
            break;
            
        case 'PUT':
            // Actualizar modelo
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['id'])) {
                echo json_encode([
                    'success' => false, 
                    'message' => 'ID del modelo requerido'
                ]);
                break;
            }
            
            // Verificar nickname único (excluyendo el actual)
            $stmt = $pdo->prepare("SELECT id FROM modelos WHERE nickname = ? AND id != ?");
            $stmt->execute([$input['nickname'], $input['id']]);
            if ($stmt->fetch()) {
                echo json_encode([
                    'success' => false, 
                    'message' => 'El nickname ya existe'
                ]);
                break;
            }
            
            // Actualizar modelo
            $stmt = $pdo->prepare("
                UPDATE modelos 
                SET nickname = ?, nombre = ?, apellido = ?, porcentaje = ?, cedula = ?, direccion = ?
                WHERE id = ?
            ");
            
            $result = $stmt->execute([
                $input['nickname'],
                $input['nombre'],
                $input['apellido'] ?? null,
                $input['porcentaje'],
                $input['cedula'] ?? null,
                $input['direccion'] ?? null,
                $input['id']
            ]);
            
            if ($result) {
                echo json_encode([
                    'success' => true, 
                    'message' => 'Modelo actualizado exitosamente'
                ]);
            } else {
                echo json_encode([
                    'success' => false, 
                    'message' => 'Error al actualizar modelo'
                ]);
            }
            break;
            
        case 'DELETE':
            // Cambiar estado activo (soft delete)
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['id'])) {
                echo json_encode([
                    'success' => false, 
                    'message' => 'ID del modelo requerido'
                ]);
                break;
            }
            
            // Toggle estado activo
            $stmt = $pdo->prepare("UPDATE modelos SET activo = NOT activo WHERE id = ?");
            $result = $stmt->execute([$input['id']]);
            
            if ($result) {
                echo json_encode([
                    'success' => true, 
                    'message' => 'Estado del modelo actualizado'
                ]);
            } else {
                echo json_encode([
                    'success' => false, 
                    'message' => 'Error al actualizar estado'
                ]);
            }
            break;
            
        default:
            echo json_encode([
                'success' => false, 
                'message' => 'Método no permitido'
            ]);
            break;
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
