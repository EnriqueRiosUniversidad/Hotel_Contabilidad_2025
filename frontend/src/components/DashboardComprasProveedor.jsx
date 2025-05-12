import "bootstrap/dist/css/bootstrap.min.css";

const DashboardComprasProveedor = () => {
  const proveedores = [
    { nombre: "Distribuidora El Sol", facturas: 5, monto: 4500000 },
    { nombre: "Comercial Benitez", facturas: 3, monto: 2500000 },
    { nombre: "Insumos del Sur", facturas: 2, monto: 1500000 },
    { nombre: "ProveMax", facturas: 1, monto: 900000 },
  ];

  return (
    <div className="card p-3 shadow-sm border-warning" style={{ width: "300px" }}>
      <h6 className="text-center text-warning mb-3">Compras del Mes</h6>
      <ul className="list-group list-group-flush">
        {proveedores.map((p, i) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
            <div>
              <strong>{p.nombre}</strong>
              <div className="text-muted small">
                {p.facturas} factura{p.facturas > 1 ? "s" : ""}
              </div>
            </div>
            <span className="badge bg-warning text-dark">₲ {p.monto.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardComprasProveedor;
