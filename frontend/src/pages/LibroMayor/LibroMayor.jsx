import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";

const LibroMayor = () => {
  const [cuentas, setCuentas] = useState([]);
  const [periodoId, setPeriodoId] = useState(() => localStorage.getItem("periodoId") || "1");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    api.get(`/libro-mayor/${periodoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCuentas(res.data);
      })
      .catch(err => {
        console.error("Error al cargar libro mayor:", err);
        alert("No se pudo cargar el Libro Mayor.");
      });
  }, [periodoId]);

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container py-4" style={{ marginLeft: "270px" }}>
        <h4 className="mb-4">📗 Libro Mayor</h4>

        {cuentas.length === 0 ? (
          <div className="text-muted">No hay datos disponibles para el período seleccionado.</div>
        ) : (
          cuentas.map((cuenta, i) => (
            <div key={i} className="mb-5">
              <h5 className="mb-3 text-success">
                {cuenta.cuentaCodigo.codigo} - {cuenta.cuentaNombre}
              </h5>
              <table className="table table-bordered table-striped text-center align-middle">
                <thead className="table-success">
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Debe</th>
                    <th>Haber</th>
                  </tr>
                </thead>
                <tbody>
                  {cuenta.movimientos.map((r, j) => (
                    <tr key={j}>
                      <td>{r.fecha}</td>
                      <td>{r.descripcion}</td>
                      <td>{r.debe?.toLocaleString() || ''}</td>
                      <td>{r.haber?.toLocaleString() || ''}</td>
                    </tr>
                  ))}
                  <tr className="table-warning fw-bold">
                    <td colSpan="2">Totales</td>
                    <td>{cuenta.totalDebe?.toLocaleString()}</td>
                    <td>{cuenta.totalHaber?.toLocaleString()}</td>
                  </tr>
                  <tr className="table-info fw-bold">
                    <td colSpan="3">Saldo</td>
                    <td>{cuenta.saldo?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LibroMayor;
