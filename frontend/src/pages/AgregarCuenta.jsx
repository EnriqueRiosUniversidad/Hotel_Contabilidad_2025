// src/pages/AgregarCuenta.jsx

import { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import PlanCuentasTree from '../components/PlanCuentasTree';
import Navbar from '../components/Navbar';
import config from '../config';
import '../styles/variables.css';

function AgregarCuenta() {
  const [cuentas, setCuentas] = useState([]);
  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    tipo: 'ACTIVO',
    nivel: 0,
    cuentaPadreId: null,
    cuentaPadrePeriodoId: 1,
    periodoContableId: 1,
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [cuentaAEliminar, setCuentaAEliminar] = useState(null);

  const tipos = ['ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'EGRESO'];

  useEffect(() => {
    fetchCuentas();
  }, []);

  const fetchCuentas = async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/plancuentas/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setCuentas(data);
    } catch (err) {
      console.error('Error al obtener cuentas', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'codigo') {
      let cuentaPadre = null;
      let nivelCalculado = 0;
      const partes = value.split('.');
      if (partes.length > 1) {
        cuentaPadre = partes.slice(0, -1).join('.');
      }
      nivelCalculado = partes.length - 1;

      setForm((prev) => ({
        ...prev,
        codigo: value,
        cuentaPadreId: cuentaPadre,
        nivel: nivelCalculado,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${config.apiBaseUrl}/plancuentas/cuenta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          codigo: form.codigo,
          nombre: form.nombre,
          tipo: form.tipo,
          nivel: form.nivel,
          cuentaPadreId: form.cuentaPadreId || null,
          cuentaPadrePeriodoId: form.cuentaPadreId ? parseInt(form.periodoContableId) : null,
          periodoContableId: parseInt(form.periodoContableId),
        }),
      });

      if (!res.ok) throw new Error('Error al crear cuenta');

      const nuevaCuenta = await res.json();
      setCuentas((prev) => [...prev, nuevaCuenta]);
      setForm({
        codigo: '',
        nombre: '',
        tipo: 'ACTIVO',
        nivel: 0,
        cuentaPadreId: null,
        cuentaPadrePeriodoId: 1,
        periodoContableId: 1,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const eliminarCuenta = async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/plancuentas/?codigo=${cuentaAEliminar.codigo}&periodoId=${cuentaAEliminar.periodoContableId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) throw new Error('No se puede eliminar la cuenta.');
      setCuentas((prev) => prev.filter(c => c.codigo !== cuentaAEliminar.codigo));
      setShowConfirm(false);
      setCuentaAEliminar(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="d-flex">
      <Navbar />
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
                {tipos.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label>Nivel (calculado)</label>
              <input
                type="number"
                className="form-control"
                name="nivel"
                value={form.nivel}
                disabled
              />
            </div>
            <div className="col">
              <label>ID Cuenta Padre (calculado)</label>
              <input
                className="form-control"
                name="cuentaPadreId"
                value={form.cuentaPadreId || ''}
                disabled
              />
            </div>
            <div className="col">
              <label>ID Periodo Contable</label>
              <input
                className="form-control"
                name="periodoContableId"
                value={form.periodoContableId}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button className="btn btn-success" type="submit">Agregar Cuenta</button>
        </form>

        <h4 className="mb-3 texto-principal">Cuentas Existentes</h4>
        <div className="bg-white shadow-sm rounded">
          <PlanCuentasTree cuentas={cuentas} onDelete={(cuenta) => {
            setCuentaAEliminar(cuenta);
            setShowConfirm(true);
          }} />
        </div>

        {showConfirm && (
          <div className="modal show fade d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar Eliminación</h5>
                </div>
                <div className="modal-body">
                  ¿Estás seguro que deseas eliminar la cuenta <strong>{cuentaAEliminar.codigo}</strong>?
                </div>
                <div className="modal-footer">
                  <button className="btn btn-warning" onClick={() => setShowConfirm(false)}>Cancelar</button>
                  <button className="btn btn-danger" onClick={eliminarCuenta}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgregarCuenta;
