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
INSERT INTO cuentas_contables (codigo, nombre, tipo, nivel, cuenta_padre_codigo, cuenta_padre_periodo_contable_id, periodo_contable_id, imputable, subtipo)
VALUES
    ('1', 'ACTIVOS', 'ACTIVO', 0, NULL, NULL, 1, FALSE, 'NO_CLASIFICADO'),
    ('1.1', 'Activos Corrientes', 'ACTIVO', 1, '1', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('1.1.1', 'Caja y Bancos', 'ACTIVO', 2, '1.1', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('1.1.1.1', 'Caja', 'ACTIVO', 3, '1.1.1', 1, 1, TRUE, 'CIRCULANTE'),
    ('1.1.1.2', 'Bancos', 'ACTIVO', 3, '1.1.1', 1, 1, TRUE, 'CIRCULANTE'),
    ('1.1.2', 'Cuentas por Cobrar', 'ACTIVO', 2, '1.1', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('1.1.2.1', 'Clientes', 'ACTIVO', 3, '1.1.2', 1, 1, TRUE, 'CIRCULANTE'),
    ('1.1.2.2', 'Documentos por Cobrar', 'ACTIVO', 3, '1.1.2', 1, 1, TRUE, 'CIRCULANTE'),
    ('1.1.3', 'Inventarios', 'ACTIVO', 2, '1.1', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('1.1.3.1', 'Mercaderías', 'ACTIVO', 3, '1.1.3', 1, 1, TRUE, 'CIRCULANTE'),
    ('1.1.3.2', 'Materias Primas', 'ACTIVO', 3, '1.1.3', 1, 1, TRUE, 'CIRCULANTE'),
    ('1.1.3.3', 'Productos Terminados', 'ACTIVO', 3, '1.1.3', 1, 1, TRUE, 'CIRCULANTE'),
    ('1.2', 'Activos No Corrientes', 'ACTIVO', 1, '1', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('1.2.1', 'Propiedades, Planta y Equipo', 'ACTIVO', 2, '1.2', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('1.2.1.1', 'Terrenos', 'ACTIVO', 3, '1.2.1', 1, 1, TRUE, 'NO_CIRCULANTE'),
    ('1.2.1.2', 'Edificios', 'ACTIVO', 3, '1.2.1', 1, 1, TRUE, 'NO_CIRCULANTE'),
    ('1.2.1.3', 'Maquinaria y Equipos', 'ACTIVO', 3, '1.2.1', 1, 1, TRUE, 'NO_CIRCULANTE'),
    ('1.2.1.4', 'Vehículos', 'ACTIVO', 3, '1.2.1', 1, 1, TRUE, 'NO_CIRCULANTE'),
    ('1.2.2', 'Activos Intangibles', 'ACTIVO', 2, '1.2', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('1.2.2.1', 'Patentes y Marcas', 'ACTIVO', 3, '1.2.2', 1, 1, TRUE, 'NO_CIRCULANTE'),
    ('1.2.2.2', 'Licencias', 'ACTIVO', 3, '1.2.2', 1, 1, TRUE, 'NO_CIRCULANTE'),
    ('2', 'Pasivos', 'PASIVO', 0, NULL, NULL, 1, FALSE, 'NO_CLASIFICADO'),
    ('2.1', 'Pasivos Corrientes', 'PASIVO', 1, '2', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('2.1.1', 'Cuentas por Pagar', 'PASIVO', 2, '2.1', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('2.1.1.1', 'Proveedores', 'PASIVO', 3, '2.1.1', 1, 1, TRUE, 'CIRCULANTE'),
    ('2.1.1.2', 'Documentos por Pagar', 'PASIVO', 3, '2.1.1', 1, 1, TRUE, 'CIRCULANTE'),
    ('2.1.2', 'Obligaciones Bancarias', 'PASIVO', 2, '2.1', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('2.1.2.1', 'Préstamos Bancarios a Corto Plazo', 'PASIVO', 3, '2.1.2', 1, 1, TRUE, 'CIRCULANTE'),
    ('2.2', 'Pasivos No Corrientes', 'PASIVO', 1, '2', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('2.2.1', 'Obligaciones Bancarias a Largo Plazo', 'PASIVO', 2, '2.2', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('2.2.1.1', 'Préstamos Bancarios a Largo Plazo', 'PASIVO', 3, '2.2.1', 1, 1, TRUE, 'NO_CIRCULANTE'),
    ('3', 'Patrimonio Neto', 'PATRIMONIO', 0, NULL, NULL, 1, FALSE, 'NO_CLASIFICADO'),
    ('3.1', 'Capital Social', 'PATRIMONIO', 1, '3', 1, 1, TRUE, 'NO_CLASIFICADO'),
    ('3.2', 'Reservas', 'PATRIMONIO', 1, '3', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('3.2.1', 'Reservas Legales', 'PATRIMONIO', 2, '3.2', 1, 1, TRUE, 'NO_CLASIFICADO'),
    ('3.2.2', 'Reservas Voluntarias', 'PATRIMONIO', 2, '3.2', 1, 1, TRUE, 'NO_CLASIFICADO'),
    ('3.3', 'Resultados Acumulados', 'PATRIMONIO', 1, '3', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('3.3.1', 'Resultados de Ejercicios Anteriores', 'PATRIMONIO', 2, '3.3', 1, 1, TRUE, 'NO_CLASIFICADO'),
    ('3.3.2', 'Resultado del Ejercicio', 'PATRIMONIO', 2, '3.3', 1, 1, TRUE, 'NO_CLASIFICADO'),
    ('4', 'Ingresos', 'INGRESO', 0, NULL, NULL, 1, FALSE, 'NO_CLASIFICADO'),
    ('4.1', 'Ventas', 'INGRESO', 1, '4', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('4.1.1', 'Ventas de Productos', 'INGRESO', 2, '4.1', 1, 1, TRUE, 'NO_CLASIFICADO'),
    ('4.1.2', 'Ventas de Servicios', 'INGRESO', 2, '4.1', 1, 1, TRUE, 'NO_CLASIFICADO'),
    ('4.2', 'Ingresos Financieros', 'INGRESO', 1, '4', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('4.2.1', 'Intereses Ganados', 'INGRESO', 2, '4.2', 1, 1, TRUE, 'NO_CLASIFICADO'),
    ('5', 'Costos y Gastos', 'EGRESO', 0, NULL, NULL, 1, FALSE, 'NO_CLASIFICADO'),
    ('5.1', 'Costo de Ventas', 'EGRESO', 1, '5', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('5.1.1', 'Costo de Productos Vendidos', 'EGRESO', 2, '5.1', 1, 1, TRUE, 'NO_CLASIFICADO'),
    ('5.1.2', 'Costo de Servicios Prestados', 'EGRESO', 2, '5.1', 1, 1, TRUE, 'NO_CLASIFICADO'),
    ('5.2', 'Gastos de Operación', 'EGRESO', 1, '5', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('5.2.1', 'Gastos de Administración', 'EGRESO', 2, '5.2', 1, 1, TRUE, 'NO_CLASIFICADO'),
    ('5.2.2', 'Gastos de Ventas', 'EGRESO', 2, '5.2', 1, 1, TRUE, 'NO_CLASIFICADO'),
    ('5.3', 'Gastos Financieros', 'EGRESO', 1, '5', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('5.3.1', 'Intereses Pagados', 'EGRESO', 2, '5.3', 1, 1, TRUE, 'NO_CLASIFICADO'),
    ('6', 'Otros Ingresos y Egresos', 'EGRESO', 0, NULL, NULL, 1, FALSE, 'NO_CLASIFICADO'),
    ('6.1', 'Otros Ingresos', 'INGRESO', 1, '6', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('6.1.1', 'Ingresos por Arrendamientos', 'INGRESO', 2, '6.1', 1, 1, TRUE, 'NO_CLASIFICADO'),
    ('6.2', 'Otros Egresos', 'EGRESO', 1, '6', 1, 1, FALSE, 'NO_CLASIFICADO'),
    ('6.2.1', 'Pérdidas por Venta de Activos', 'EGRESO', 2, '6.2', 1, 1, TRUE, 'NO_CLASIFICADO');


-- Asientos contables realistas del 1 al 20
INSERT INTO asientos_contables (id, periodo_id, descripcion, fecha, tipo_asiento)
VALUES
    (1, 1, 'Aporte inicial de capital', '2025-01-01', 'AJUSTE'),
    (2, 1, 'Compra de mercaderías', '2025-01-02', 'REGULAR'),
    (3, 1, 'Venta de productos', '2025-01-03', 'REGULAR'),
    (4, 1, 'Cobro a clientes', '2025-01-04', 'REGULAR'),
    (5, 1, 'Pago a proveedores', '2025-01-05', 'REGULAR'),
    (6, 1, 'Compra de mobiliario', '2025-01-06', 'AJUSTE'),
    (7, 1, 'Gasto de administración', '2025-01-07', 'REGULAR'),
    (8, 1, 'Intereses pagados', '2025-01-08', 'REGULAR'),
    (9, 1, 'Reserva legal', '2025-01-09', 'AJUSTE'),
    (10, 1, 'Amortización de intangibles', '2025-01-10', 'AJUSTE'),
    (11, 1, 'Ingresos financieros', '2025-01-11', 'REGULAR'),
    (12, 1, 'Venta de servicios', '2025-01-12', 'REGULAR'),
    (13, 1, 'Pago de sueldos', '2025-01-13', 'REGULAR'),
    (14, 1, 'Pago de impuestos', '2025-01-14', 'REGULAR'),
    (15, 1, 'Compra de licencias', '2025-01-15', 'REGULAR'),
    (16, 1, 'Donación recibida', '2025-01-16', 'AJUSTE'),
    (17, 1, 'Corrección contable', '2025-01-17', 'AJUSTE'),
    (18, 1, 'Pérdida por venta de activos', '2025-01-18', 'REGULAR'),
    (19, 1, 'Ingreso por alquileres', '2025-01-19', 'REGULAR'),
    (20, 1, 'Pago de préstamo bancario', '2025-01-20', 'REGULAR');

-- Detalles de asientos contables realistas
INSERT INTO detalles_asientos (asiento_id, cuenta_codigo, cuenta_periodo_contable_id, debe, haber)
VALUES
    (1, '1.1.1.1', 1, 10000000.00, 0.00),(1, '3.1', 1, 0.00, 10000000.00),
    (2, '1.1.3.1', 1, 5000000.00, 0.00),(2, '2.1.1.1', 1, 0.00, 5000000.00),
    (3, '1.1.1.1', 1, 7000000.00, 0.00),(3, '4.1.1', 1, 0.00, 7000000.00),
    (4, '1.1.1.1', 1, 2000000.00, 0.00),(4, '1.1.2.1', 1, 0.00, 2000000.00),
    (5, '2.1.1.1', 1, 3000000.00, 0.00),(5, '1.1.1.1', 1, 0.00, 3000000.00),
    (6, '1.2.1.3', 1, 2500000.00, 0.00),(6, '2.1.2.1', 1, 0.00, 2500000.00),
    (7, '5.2.1', 1, 1000000.00, 0.00),(7, '1.1.1.1', 1, 0.00, 1000000.00),
    (8, '5.3.1', 1, 500000.00, 0.00),(8, '1.1.1.1', 1, 0.00, 500000.00),
    (9, '3.2.1', 1, 1500000.00, 0.00),(9, '3.3.2', 1, 0.00, 1500000.00),
    (10, '5.1.2', 1, 800000.00, 0.00),(10, '1.2.2.2', 1, 0.00, 800000.00),
    (11, '1.1.1.1', 1, 300000.00, 0.00),(11, '4.2.1', 1, 0.00, 300000.00),
    (12, '1.1.1.1', 1, 1200000.00, 0.00),(12, '4.1.2', 1, 0.00, 1200000.00),
    (13, '5.2.1', 1, 1300000.00, 0.00),(13, '1.1.1.1', 1, 0.00, 1300000.00),
    (14, '5.2.2', 1, 900000.00, 0.00),(14, '1.1.1.1', 1, 0.00, 900000.00),
    (15, '1.2.2.2', 1, 400000.00, 0.00),(15, '2.1.2.1', 1, 0.00, 400000.00),
    (16, '1.1.1.1', 1, 1000000.00, 0.00),(16, '3.3.2', 1, 0.00, 1000000.00),
    (17, '3.3.1', 1, 1100000.00, 0.00),(17, '3.3.2', 1, 0.00, 1100000.00),
    (18, '6.2.1', 1, 500000.00, 0.00),(18, '1.2.1.4', 1, 0.00, 500000.00),
    (19, '1.1.1.1', 1, 600000.00, 0.00),(19, '6.1.1', 1, 0.00, 600000.00),
    (20, '2.2.1.1', 1, 2000000.00, 0.00),(20, '1.1.1.1', 1, 0.00, 2000000.00);




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


