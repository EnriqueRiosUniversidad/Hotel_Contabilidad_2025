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
    const actualizar = localStorage.getItem("actualizarAsientos") === "true";
    const cacheKey = "asientos_" + periodoId;

    if (!actualizar && localStorage.getItem(cacheKey)) {
      setAsientos(JSON.parse(localStorage.getItem(cacheKey)));
    } else {
      cargarAsientos();
    }
  }, []);

  const cargarAsientos = () => {
    api.get(`/librodiario/${periodoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setAsientos(res.data);
        localStorage.setItem("asientos_" + periodoId, JSON.stringify(res.data));
        localStorage.setItem("actualizarAsientos", "false");
      })
      .catch((err) => console.error("Error al obtener asientos:", err));
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este asiento?")) return;

    api.delete(`/librodiario/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        alert("Asiento eliminado correctamente");
        setAsientos((prev) => prev.filter((a) => a.id !== id));
        localStorage.setItem("actualizarAsientos", "true");
      })
      .catch(() => alert("Error al eliminar el asiento"));
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
                  <button className="btn btn-info btn-sm me-1" onClick={() => navigate(`/detalle-libro/${asiento.id}`)}>Ver</button>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => navigate("/agregar-libro", { state: asiento })}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(asiento.id)}>Eliminar</button>
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