const CuentaMayorCard = ({ cuenta }) => {
  return (
    <div className="card p-3 border-success bg-success bg-opacity-10">
      <h6 className="fw-bold text-success mb-2">Cuenta N: {cuenta.codigo} {cuenta.nombre}</h6>
      <table className="table table-sm table-bordered text-center align-middle">
        <thead className="table-light">
          <tr>
            <th>Fecha</th>
            <th>Concepto</th>
            <th>Debe</th>
            <th>Haber</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {cuenta.movimientos.map((m, idx) => (
            <tr key={idx}>
              <td>{m.fecha}</td>
              <td>{m.concepto}</td>
              <td>{m.debe.toFixed(2)}</td>
              <td>{m.haber.toFixed(2)}</td>
              <td>{m.saldo.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CuentaMayorCard;