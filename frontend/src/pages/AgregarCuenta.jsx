import { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import PlanCuentasTree from '../components/PlanCuentasTree';
import Navbar from '../components/Navbar';
import config from '../config';
import '../styles/variables.css';

function AgregarCuenta() {
  const [cuentas, setCuentas] = useState([]);
  const [form, setForm] = useState({ codigo: '', nombre: '', tipo: 'ACTIVO', nivel: 0, cuentaPadreId: null, cuentaPadrePeriodoId: 1, periodoContableId: 1 });
  const [seleccionada, setSeleccionada] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const tipos = ['ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'EGRESO'];

  useEffect(() => {
    const periodoId = localStorage.getItem("periodoId");
    const key = "cuentas_" + periodoId;
    const cached = localStorage.getItem(key);
  
    if (cached) {
      setCuentas(JSON.parse(cached));
    } else {
      fetchCuentas(periodoId);
    }
  }, []);
  

  const fetchCuentas = async (periodoId) => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/plancuentas/plan/${periodoId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setCuentas(data);
      localStorage.setItem("cuentas_" + periodoId, JSON.stringify(data));
    } catch (err) {
      alert("Error al obtener cuentas");
    }
  };
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'codigo') {
      const partes = value.split('.');
      const cuentaPadre = partes.length > 1 ? partes.slice(0, -1).join('.') : null;
      const nivelCalculado = partes.length - 1;
      setForm((prev) => ({ ...prev, codigo: value, cuentaPadreId: cuentaPadre, nivel: nivelCalculado }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metodo = seleccionada ? 'PUT' : 'POST';
    try {
      const res = await fetch(`${config.apiBaseUrl}/plancuentas/cuenta`, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al guardar la cuenta');
      fetchCuentas();
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const eliminarCuenta = async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/plancuentas/?codigo=${seleccionada.codigo}&periodoId=${seleccionada.periodoContableId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('No se puede eliminar la cuenta.');
      fetchCuentas();
      resetForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setShowConfirm(false);
    }
  };

  const resetForm = () => {
    setForm({ codigo: '', nombre: '', tipo: 'ACTIVO', nivel: 0, cuentaPadreId: null, cuentaPadrePeriodoId: 1, periodoContableId: 1 });
    setSeleccionada(null);
  };

  const onSeleccionarCuenta = (cuenta) => {
    setSeleccionada(cuenta);
    setForm({
      codigo: cuenta.codigo,
      nombre: cuenta.nombre,
      tipo: cuenta.tipo,
      nivel: cuenta.nivel,
      cuentaPadreId: cuenta.cuentaPadreId,
      cuentaPadrePeriodoId: cuenta.cuentaPadrePeriodoId,
      periodoContableId: cuenta.periodoContableId,
    });
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container mt-4" style={{ marginLeft: '250px' }}>
        <h2 className="mb-3 texto-principal">{seleccionada ? 'Editar Cuenta' : 'Agregar Cuenta Contable'}</h2>
        <form className="p-4 rounded shadow mb-4 bg-success bg-opacity-25" onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label>Código</label>
              <input className="form-control" name="codigo" value={form.codigo} onChange={handleChange} required disabled={!!seleccionada} />
            </div>
            <div className="col">
              <label>Nombre</label>
              <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="col">
              <label>Tipo</label>
              <select className="form-control" name="tipo" value={form.tipo} onChange={handleChange}>
                {tipos.map((t) => (<option key={t}>{t}</option>))}
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label>Nivel (calculado)</label>
              <input type="number" className="form-control" name="nivel" value={form.nivel} disabled />
            </div>
            <div className="col">
              <label>ID Cuenta Padre (calculado)</label>
              <input className="form-control" name="cuentaPadreId" value={form.cuentaPadreId || ''} disabled />
            </div>
            <div className="col">
              <label>ID Periodo Contable</label>
              <input className="form-control" name="periodoContableId" value={form.periodoContableId} onChange={handleChange} required />
            </div>
          </div>

          {!seleccionada ? (
            <button className="btn btn-success" type="submit">Agregar Cuenta</button>
          ) : (
            <>
              <button className="btn btn-warning me-2" type="submit">Actualizar</button>
              <button className="btn btn-danger me-2" type="button" onClick={() => setShowConfirm(true)}>Eliminar</button>
              <button className="btn btn-secondary" type="button" onClick={resetForm}>Cancelar</button>
            </>
          )}
        </form>

        <h4 className="mb-3 texto-principal">Cuentas Existentes</h4>
        <div className="bg-white shadow-sm rounded">
          <PlanCuentasTree cuentas={cuentas} onSelect={onSeleccionarCuenta} seleccionada={seleccionada} />
        </div>

        {showConfirm && (
          <div className="modal show fade d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar Eliminación</h5>
                </div>
                <div className="modal-body">
                  ¿Estás seguro que deseas eliminar la cuenta <strong>{seleccionada.codigo}</strong>?
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancelar</button>
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

export default AgregarCuenta