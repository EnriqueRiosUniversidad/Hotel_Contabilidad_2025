import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AgregarLibro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tipo: "",
    fecha: "",
    descripcion: "",
    total: "",
    asiento: [
      { id: 1, cod: "", cuenta: "", debe: "", haber: "" },
      { id: 2, cod: "", cuenta: "", debe: "", haber: "" },
    ],
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nuevo registro agregado:", formData);
    alert("Registro agregado exitosamente!");
    navigate("/libro-diario");
  };

  return (
    <div className="container py-3">
      <h4 className="mb-3">Agregar Nuevo Registro</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
        <div class="col-md-3">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-control"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
          />
        </div>
        </div>
        <div className="mb-3">
        <div class="col-md-3">
          <label className="form-label">Descripción</label>
          <input
            type="text"
            className="form-control"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </div>
        </div>

        <div className="mb-3">
        <div class="col-md-3">
          <label className="form-label">Total</label>
          <input
            type="text"
            className="form-control"
            name="total"
            value={formData.total}
            onChange={handleChange}
          />
        </div>
        </div>

        <h5 className="mt-4">Asiento Contable</h5>
        <table className="table table-bordered">
          <thead className="table-light">
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
                    onChange={(e) => handleAsientoChange(index, "cod", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={item.cuenta}
                    onChange={(e) => handleAsientoChange(index, "cuenta", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={item.debe}
                    onChange={(e) => handleAsientoChange(index, "debe", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={item.haber}
                    onChange={(e) => handleAsientoChange(index, "haber", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" className="btn btn-success">Guardar</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default AgregarLibro;
