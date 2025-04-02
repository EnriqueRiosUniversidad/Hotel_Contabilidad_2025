-- Insertar roles
INSERT INTO roles (name) VALUES ('contador'), ('user');

-- Insertar usuarios
INSERT INTO users (username, email, password, role_id) 
VALUES ('admin', 'admin@example.com', 'hashed_password', 1),
       ('user1', 'user1@example.com', 'hashed_password', 2);

-- Insertar cuentas contables
INSERT INTO cuentas_contables (codigo, nombre, tipo, nivel, cuenta_padre_id) 
VALUES ('1001', 'Caja General', 'ACTIVO', 1, NULL),
       ('2001', 'Proveedores', 'PASIVO', 1, NULL),
       ('3001', 'Capital', 'PATRIMONIO', 1, NULL),
       ('4001', 'Ventas', 'INGRESO', 1, NULL),
       ('5001', 'Gastos Generales', 'EGRESO', 1, NULL);

-- Insertar períodos contables
INSERT INTO periodos_contables (anio, mes_inicio, mes_fin, estado) 
VALUES (2025, 1, 12, 'ABIERTO');

-- Insertar asientos contables
INSERT INTO asientos_contables (periodo_id, descripcion, fecha, tipo_asiento) 
VALUES (1, 'Apertura de año', '2025-01-01', 'AJUSTE');

-- Insertar detalles de asientos
INSERT INTO detalles_asientos (asiento_id, cuenta_id, debe, haber) 
VALUES (1, 1, 10000.00, 0.00),
       (1, 3, 0.00, 10000.00);

-- Insertar modelos de asientos
INSERT INTO modelos_asientos (descripcion, tipo_asiento) 
VALUES ('Modelo de ajuste', 'AJUSTE');

-- Insertar asientos generados
INSERT INTO asientos_generados (modelo_id, asiento_id, fecha_generacion, modulo_origen, estado) 
VALUES (1, 1, '2025-01-01', 'VENTAS', 'CONFIRMADO');

-- Insertar asientos provisionales
INSERT INTO asientos_provisionales (asiento_generado_id, descripcion, fecha, tipo_asiento, estado) 
VALUES (1, 'Provisión de ventas', '2025-01-02', 'REGULAR', 'BORRADOR');

-- Insertar detalles de asientos provisionales
INSERT INTO detalles_asientos_provisionales (asiento_prov_id, cuenta_id, debe, haber) 
VALUES (1, 4, 5000.00, 0.00),
       (1, 5, 0.00, 5000.00);
