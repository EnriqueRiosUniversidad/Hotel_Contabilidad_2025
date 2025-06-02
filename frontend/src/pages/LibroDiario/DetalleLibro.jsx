import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";

function DetalleLibro() {
  const { asientoId } = useParams();
  const [asiento, setAsiento] = useState(null);
  const token = localStorage.getItem("auth_token");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/librodiario/detalle/${asientoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setAsiento(res.data))
      .catch(err => console.error("Error al cargar detalle:", err));
  }, [asientoId]);

  if (!asiento) {
    return <div className="container mt-4">Cargando...</div>;
  }

  return (
    <div className="d-flex">
      <Navbar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>
        <h2 className="text-center text-success fw-bold" style={{ fontFamily: "Georgia, serif" }}>Detalle del Asiento</h2>
        <p><strong>Fecha:</strong> {asiento.fecha}</p>
        <p><strong>Descripción:</strong> {asiento.descripcion}</p>
        <p><strong>Tipo:</strong> {asiento.tipoAsiento}</p>

        <h5>Movimientos contables:</h5>
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Código Cuenta</th>
              <th>Debe</th>
              <th>Haber</th>
            </tr>
          </thead>
          <tbody>
            {asiento.detalles.map((d, index) => (
              <tr key={index}>
                <td>{d.cuentaCodigo}</td>
                <td>{d.debe.toFixed(2)}</td>
                <td>{d.haber.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="btn btn-secondary" onClick={() => navigate("/libro-diario")}>
          Volver
        </button>
      </div>
    </div>
  );
}

export default DetalleLibro;
