import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/Navbar'; // Ajusta la ruta según donde tengas el Navbar

const AgregarLibro = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    id: "",
    tipo: "",
    fecha: today,
    descripcion: "",
    total: "",
    asiento: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAsientoChange = (index, field, value) => {
    const nuevosAsientos = [...formData.asiento];
    nuevosAsientos[index][field] = value;
    setFormData((prev) => ({ ...prev, asiento: nuevosAsientos }));
  };

  const agregarFilaAsiento = () => {
    const nuevo = {
      id: formData.asiento.length + 1,
      cod: "",
      cuenta: "",
      debe: "",
      haber: "",
    };
    setFormData((prev) => ({ ...prev, asiento: [...prev.asiento, nuevo] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoRegistro = {
      ...formData,
      id: Math.floor(Math.random() * 10000),
    };
    const registros = JSON.parse(localStorage.getItem("libroDiario")) || [];
    registros.push(nuevoRegistro);
    localStorage.setItem("libroDiario", JSON.stringify(registros));
    alert("Registro agregado correctamente");
    navigate("/libro-diario");
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container py-3">
        <h4 className="mb-3">Agregar nuevo registro al Libro Diario</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <div className="col-md-3">
              <label className="form-label">Descripción</label>
              <input
                type="text"
                className="form-control"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="col-md-3">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                className="form-control"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="col-md-3">
              <label className="form-label">Total</label>
              <input
                type="text"
                className="form-control"
                name="total"
                value={formData.total}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h5 className="mt-4">Asiento Contable</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Código</th>
                <th>Cuenta</th>
                <th>Debe</th>
                <th>Haber</th>
              </tr>
            </thead>
            <tbody>
              {formData.asiento.map((item, index) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={item.cod}
                      onChange={(e) =>
                        handleAsientoChange(index, "cod", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={item.cuenta}
                      onChange={(e) =>
                        handleAsientoChange(index, "cuenta", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={item.debe}
                      onChange={(e) =>
                        handleAsientoChange(index, "debe", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={item.haber}
                      onChange={(e) =>
                        handleAsientoChange(index, "haber", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            className="btn btn-outline-success mb-3"
            onClick={agregarFilaAsiento}
          >
            Agregar cuenta
          </button>

          <br />
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgregarLibro;
