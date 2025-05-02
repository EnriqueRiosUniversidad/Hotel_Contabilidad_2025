import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function LibroDiario() {
  const [asientos, setAsientos] = useState([]);
  const periodoId = localStorage.getItem("periodoId");
  const token = localStorage.getItem("auth_token");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/librodiario/${periodoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setAsientos(res.data))
      .catch((err) => console.error("Error al obtener asientos:", err));
  }, [periodoId]);

  const verDetalle = (asiento) => {
    navigate("/detalle-libro", { state: asiento });
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>
        <h2>Libro Diario</h2>
        <button className="btn btn-success mb-3" onClick={() => navigate("/agregar-libro")}>
          Agregar Asiento
        </button>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {asientos.map((asiento) => (
              <tr key={asiento.id}>
                <td>{asiento.fecha}</td>
                <td>{asiento.descripcion}</td>
                <td>{asiento.tipoAsiento}</td>
                <td>
                <button className="btn btn-info btn-sm" onClick={() => navigate(`/detalle-libro/${asiento.id}`)}>
  Ver
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LibroDiario;