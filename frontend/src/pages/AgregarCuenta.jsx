// src/pages/AgregarCuenta.jsx

import { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import '../styles/variables.css';

function AgregarCuenta() {
  const [cuentas, setCuentas] = useState([]);
  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    tipo: 'ACTIVO',
    nivel: 1,
    cuentaPadreId: null,
    periodoContableId: 1
  });

  const tipos = ['ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'EGRESO'];

  useEffect(() => {
    fetchCuentas();
  }, []);

  const fetchCuentas = async () => {
    try {
      const res = await fetch('https://hotel-contabilidad-35ebeef89ac8.herokuapp.com/plancuentas/', {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      const data = await res.json();
      setCuentas(data);
    } catch (err) {
      console.error('Error al obtener cuentas', err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('https://hotel-contabilidad-35ebeef89ac8.herokuapp.com/plancuentas/cuenta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ ...form, nivel: parseInt(form.nivel), cuentaPadreId: form.cuentaPadreId || null })
      });

      if (!res.ok) throw new Error('Error al crear cuenta');

      const nuevaCuenta = await res.json();
      setCuentas(prev => [...prev, nuevaCuenta]);
      setForm({ codigo: '', nombre: '', tipo: 'ACTIVO', nivel: 1, cuentaPadreId: null, periodoContableId: 1 });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 texto-principal">Agregar Cuenta Contable</h2>
      <form className="p-4 rounded shadow mb-4 bg-verde-claro" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <label>Código</label>
            <input className="form-control" name="codigo" value={form.codigo} onChange={handleChange} required />
          </div>
          <div className="col">
            <label>Nombre</label>
            <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>
          <div className="col">
            <label>Tipo</label>
            <select className="form-control" name="tipo" value={form.tipo} onChange={handleChange}>
              {tipos.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label>Nivel</label>
            <input type="number" className="form-control" name="nivel" value={form.nivel} onChange={handleChange} min={1} />
          </div>
          <div className="col">
            <label>ID Cuenta Padre (opcional)</label>
            <input className="form-control" name="cuentaPadreId" value={form.cuentaPadreId || ''} onChange={handleChange} />
          </div>
          <div className="col">
            <label>ID Periodo Contable</label>
            <input className="form-control" name="periodoContableId" value={form.periodoContableId} onChange={handleChange} required />
          </div>
        </div>
        <button className="btn btn-success" type="submit">Agregar Cuenta</button>
      </form>

      <h4 className="mb-3 texto-principal">Cuentas Existentes</h4>
      <div className="table-responsive">
        <table className="table table-bordered bg-white shadow-sm">
          <thead className="table-success">
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Nivel</th>
              <th>Cuenta Padre</th>
              <th>Periodo Contable</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map((c, i) => (
              <tr key={i}>
                <td>{c.codigo}</td>
                <td>{c.nombre}</td>
                <td>{c.tipo}</td>
                <td>{c.nivel}</td>
                <td>{c.cuentaPadreId ?? '—'}</td>
                <td>{c.periodoContableId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AgregarCuenta;
