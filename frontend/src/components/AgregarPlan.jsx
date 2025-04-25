import { useState } from 'react';

const AgregarPlan = () => {
  const [periodo, setPeriodo] = useState('');
  const [search, setSearch] = useState('');

  // Datos simulados
  const datos = [
    { id: 1, codigo: '1234', descripcion: 'Activos', total: 100000 },
    { id: 2, codigo: '3456', descripcion: 'Bancos', total: 50000 },
    { id: 3, codigo: '5678', descripcion: 'Pasivos', total: 80000 },
  ];

  // Filtrar por número de cuenta (codigo)
  const filtrado = datos.filter((item) =>
    item.codigo.includes(search)
  );

  // Evita recarga del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Periodo confirmado: ${periodo}`);
  };

  return (
    <>
      <h1>Agregar Plan de Cuenta</h1>

      {/* Formulario de periodo */}
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-auto">
          <label className="visually-hidden">Periodo</label>
          <input
            className="form-control"
            placeholder="Periodo"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary mb-3">
            Confirmar periodo
          </button>
        </div>
      </form>

      {/* Buscar por número de cuenta */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por número de cuenta (ej: 1234)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabla de resultados */}
      <table className="table table-hover">
        <thead>
          <tr className="table-active">
            <th scope="col">#</th>
            <th scope="col">Código</th>
            <th scope="col">Descripción</th>
            <th scope="col">Total</th>
            <th scope="col">Opciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrado.map((item) => (
            <tr key={item.id}>
              <th scope="row">{item.id}</th>
              <td>{item.codigo}</td>
              <td>{item.descripcion}</td>
              <td>{item.total.toLocaleString()} ₲</td>
              <td>
                <button className="btn btn-sm btn-outline-info">Ver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AgregarPlan;
