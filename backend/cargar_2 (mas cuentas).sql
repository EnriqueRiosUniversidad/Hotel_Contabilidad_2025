-- Insertar roles
INSERT INTO roles (name) VALUES ('contador'), ('user');

-- Insertar usuarios
INSERT INTO users (username, email, password, role_id)
VALUES ('contador', 'contador@email.com', '$2a$10$Q9l/KrMbaxHbDUL0.ZBg.eChDT5TAd4GjdBIdIhuch1OkvqHJm392', 1),
       ('user1', 'user1@example.com', '$2a$10$Q9l/KrMbaxHbDUL0.ZBg.eChDT5TAd4GjdBIdIhuch1OkvqHJm392', 2);

-- 1. Insertar períodos contables primero
INSERT INTO periodos_contables ( anio, mes_inicio, mes_fin, estado)
VALUES ( 2025, 1, 12, 'EDITABLE');

-- 2. Insertar cuentas contables (ya puede referenciar periodo_contable_id = 1)
-- 1. Insertar período contable
INSERT INTO periodos_contables (anio, mes_inicio, mes_fin, estado)
VALUES (2025, 1, 12, 'EDITABLE');

-- 2. Insertar cuentas contables (estructura adaptada)
INSERT INTO cuentas_contables (
    codigo, nombre, tipo, nivel,
    cuenta_padre_codigo, cuenta_padre_periodo_contable_id,
    periodo_contable_id, imputable
)
VALUES
    ('1', 'ACTIVOS', 'ACTIVO', 0, NULL, NULL, 1, FALSE),
    ('1.1', 'Activos Corrientes', 'ACTIVO', 1, '1', 1, 1, FALSE),
    ('1.1.1', 'Caja y Bancos', 'ACTIVO', 2, '1.1', 1, 1, FALSE),
    ('1.1.1.1', 'Caja', 'ACTIVO', 3, '1.1.1', 1, 1, TRUE),
    ('1.1.1.2', 'Bancos', 'ACTIVO', 3, '1.1.1', 1, 1, TRUE),
    ('1.1.2', 'Cuentas por Cobrar', 'ACTIVO', 2, '1.1', 1, 1, FALSE),
    ('1.1.2.1', 'Clientes', 'ACTIVO', 3, '1.1.2', 1, 1, TRUE),
    ('1.1.2.2', 'Documentos por Cobrar', 'ACTIVO', 3, '1.1.2', 1, 1, TRUE),
    ('1.1.3', 'Inventarios', 'ACTIVO', 2, '1.1', 1, 1, FALSE),
    ('1.1.3.1', 'Mercaderías', 'ACTIVO', 3, '1.1.3', 1, 1, TRUE),
    ('1.1.3.2', 'Materias Primas', 'ACTIVO', 3, '1.1.3', 1, 1, TRUE),
    ('1.1.3.3', 'Productos Terminados', 'ACTIVO', 3, '1.1.3', 1, 1, TRUE),
    ('1.2', 'Activos No Corrientes', 'ACTIVO', 1, '1', 1, 1, FALSE),
    ('1.2.1', 'Propiedades, Planta y Equipo', 'ACTIVO', 2, '1.2', 1, 1, FALSE),
    ('1.2.1.1', 'Terrenos', 'ACTIVO', 3, '1.2.1', 1, 1, TRUE),
    ('1.2.1.2', 'Edificios', 'ACTIVO', 3, '1.2.1', 1, 1, TRUE),
    ('1.2.1.3', 'Maquinaria y Equipos', 'ACTIVO', 3, '1.2.1', 1, 1, TRUE),
    ('1.2.1.4', 'Vehículos', 'ACTIVO', 3, '1.2.1', 1, 1, TRUE),
    ('1.2.2', 'Activos Intangibles', 'ACTIVO', 2, '1.2', 1, 1, FALSE),
    ('1.2.2.1', 'Patentes y Marcas', 'ACTIVO', 3, '1.2.2', 1, 1, TRUE),
    ('1.2.2.2', 'Licencias', 'ACTIVO', 3, '1.2.2', 1, 1, TRUE),
    ('2', 'Pasivos', 'PASIVO', 0, NULL, NULL, 1, FALSE),
    ('2.1', 'Pasivos Corrientes', 'PASIVO', 1, '2', 1, 1, FALSE),
    ('2.1.1', 'Cuentas por Pagar', 'PASIVO', 2, '2.1', 1, 1, FALSE),
    ('2.1.1.1', 'Proveedores', 'PASIVO', 3, '2.1.1', 1, 1, TRUE),
    ('2.1.1.2', 'Documentos por Pagar', 'PASIVO', 3, '2.1.1', 1, 1, TRUE),
    ('2.1.2', 'Obligaciones Bancarias', 'PASIVO', 2, '2.1', 1, 1, FALSE),
    ('2.1.2.1', 'Préstamos Bancarios a Corto Plazo', 'PASIVO', 3, '2.1.2', 1, 1, TRUE),
    ('2.2', 'Pasivos No Corrientes', 'PASIVO', 1, '2', 1, 1, FALSE),
    ('2.2.1', 'Obligaciones Bancarias a Largo Plazo', 'PASIVO', 2, '2.2', 1, 1, FALSE),
    ('2.2.1.1', 'Préstamos Bancarios a Largo Plazo', 'PASIVO', 3, '2.2.1', 1, 1, TRUE),
    ('3', 'Patrimonio Neto', 'PATRIMONIO', 0, NULL, NULL, 1, FALSE),
    ('3.1', 'Capital Social', 'PATRIMONIO', 1, '3', 1, 1, TRUE),
    ('3.2', 'Reservas', 'PATRIMONIO', 1, '3', 1, 1, FALSE),
    ('3.2.1', 'Reservas Legales', 'PATRIMONIO', 2, '3.2', 1, 1, TRUE),
    ('3.2.2', 'Reservas Voluntarias', 'PATRIMONIO', 2, '3.2', 1, 1, TRUE),
    ('3.3', 'Resultados Acumulados', 'PATRIMONIO', 1, '3', 1, 1, FALSE),
    ('3.3.1', 'Resultados de Ejercicios Anteriores', 'PATRIMONIO', 2, '3.3', 1, 1, TRUE),
    ('3.3.2', 'Resultado del Ejercicio', 'PATRIMONIO', 2, '3.3', 1, 1, TRUE),
    ('4', 'Ingresos', 'INGRESO', 0, NULL, NULL, 1, FALSE),
    ('4.1', 'Ventas', 'INGRESO', 1, '4', 1, 1, FALSE),
    ('4.1.1', 'Ventas de Productos', 'INGRESO', 2, '4.1', 1, 1, TRUE),
    ('4.1.2', 'Ventas de Servicios', 'INGRESO', 2, '4.1', 1, 1, TRUE),
    ('4.2', 'Ingresos Financieros', 'INGRESO', 1, '4', 1, 1, FALSE),
    ('4.2.1', 'Intereses Ganados', 'INGRESO', 2, '4.2', 1, 1, TRUE),
    ('5', 'Costos y Gastos', 'EGRESO', 0, NULL, NULL, 1, FALSE),
    ('5.1', 'Costo de Ventas', 'EGRESO', 1, '5', 1, 1, FALSE),
    ('5.1.1', 'Costo de Productos Vendidos', 'EGRESO', 2, '5.1', 1, 1, TRUE),
    ('5.1.2', 'Costo de Servicios Prestados', 'EGRESO', 2, '5.1', 1, 1, TRUE),
    ('5.2', 'Gastos de Operación', 'EGRESO', 1, '5', 1, 1, FALSE),
    ('5.2.1', 'Gastos de Administración', 'EGRESO', 2, '5.2', 1, 1, TRUE),
    ('5.2.2', 'Gastos de Ventas', 'EGRESO', 2, '5.2', 1, 1, TRUE),
    ('5.3', 'Gastos Financieros', 'EGRESO', 1, '5', 1, 1, FALSE),
    ('5.3.1', 'Intereses Pagados', 'EGRESO', 2, '5.3', 1, 1, TRUE),
    ('6', 'Otros Ingresos y Egresos', 'EGRESO', 0, NULL, NULL, 1, FALSE),
    ('6.1', 'Otros Ingresos', 'INGRESO', 1, '6', 1, 1, FALSE),
    ('6.1.1', 'Ingresos por Arrendamientos', 'INGRESO', 2, '6.1', 1, 1, TRUE),
    ('6.2', 'Otros Egresos', 'EGRESO', 1, '6', 1, 1, FALSE),
    ('6.2.1', 'Pérdidas por Venta de Activos', 'EGRESO', 2, '6.2', 1, 1, TRUE);


-- Insertar los asientos contables (IDs del 1 al 10)
INSERT INTO asientos_contables (id, periodo_id, descripcion, fecha, tipo_asiento)
VALUES
    (1, 1, 'Apertura de año',       '2025-01-01', 'AJUSTE'),
    (2, 1, 'Asiento automático N°2','2025-01-03', 'REGULAR'),
    (3, 1, 'Asiento automático N°3','2025-01-04', 'AJUSTE'),
    (4, 1, 'Asiento automático N°4','2025-01-05', 'REGULAR'),
    (5, 1, 'Asiento automático N°5','2025-01-06', 'AJUSTE'),
    (6, 1, 'Asiento automático N°6','2025-01-07', 'REGULAR'),
    (7, 1, 'Asiento automático N°7','2025-01-08', 'AJUSTE'),
    (8, 1, 'Asiento automático N°8','2025-01-09', 'REGULAR'),
    (9, 1, 'Asiento automático N°9','2025-01-10', 'AJUSTE'),
    (10,1, 'Asiento automático N°10','2025-01-11','REGULAR');

-- Insertar detalles de los asientos (dos movimientos por asiento)
INSERT INTO detalles_asientos (asiento_id, cuenta_codigo, cuenta_periodo_contable_id, debe, haber)
VALUES
    (1,  '1.1.1.1', 1, 10000.00, 0.00), (1,  '3.1', 1, 0.00, 10000.00),
    (2,  '1.1.1.1', 1, 1000.00,  0.00), (2,  '3.1', 1, 0.00, 1000.00),
    (3,  '1.1.1.1', 1, 1000.00,  0.00), (3,  '3.1', 1, 0.00, 1000.00),
    (4,  '1.1.1.1', 1, 1000.00,  0.00), (4,  '3.1', 1, 0.00, 1000.00),
    (5,  '1.1.1.1', 1, 1000.00,  0.00), (5,  '3.1', 1, 0.00, 1000.00),
    (6,  '1.1.1.1', 1, 1000.00,  0.00), (6,  '3.1', 1, 0.00, 1000.00),
    (7,  '1.1.1.1', 1, 1000.00,  0.00), (7,  '3.1', 1, 0.00, 1000.00),
    (8,  '1.1.1.1', 1, 1000.00,  0.00), (8,  '3.1', 1, 0.00, 1000.00),
    (9,  '1.1.1.1', 1, 1000.00,  0.00), (9,  '3.1', 1, 0.00, 1000.00),
    (10, '1.1.1.1', 1, 1000.00,  0.00), (10, '3.1', 1, 0.00, 1000.00);




-- Insertar modelos de asientos
INSERT INTO modelos_asientos (descripcion, tipo_asiento)
VALUES ('Modelo de ajuste', 'AJUSTE');

-- Insertar asientos generados (agregado periodo_id obligatorio)
INSERT INTO asientos_generados (modelo_id, asiento_id, periodo_id, fecha_generacion, modulo_origen, estado)
VALUES (1, 1, 1, '2025-01-01', 'VENTAS', 'CONFIRMADO');

-- Insertar asientos provisionales (agregado periodo_id obligatorio)
INSERT INTO asientos_provisionales (asiento_generado_id, periodo_id, descripcion, fecha, tipo_asiento, estado)
VALUES (1, 1, 'Provisión de ventas', '2025-01-02', 'REGULAR', 'BORRADOR');

-- Insertar detalles de asientos provisionales (usando cuenta_codigo y cuenta_periodo_contable_id)
INSERT INTO detalles_asientos_provisionales (asiento_prov_id, cuenta_codigo, cuenta_periodo_contable_id, debe, haber)
VALUES
    (1, '4.1.1', 1, 5000.00, 0.00),  -- Ingreso (Ventas de Productos)
    (1, '1.1.1.1', 1, 0.00, 5000.00); -- Activo (Caja)


