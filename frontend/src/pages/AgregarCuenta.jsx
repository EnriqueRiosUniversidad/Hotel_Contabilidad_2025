import { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import PlanCuentasTree from '../components/PlanCuentasTree';
import Navbar from '../components/Navbar';
import config from '../config';
import '../styles/variables.css';

function AgregarCuenta() {
  const [cuentas, setCuentas] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(localStorage.getItem("periodoId") || '');
  const [form, setForm] = useState({
    codigo: '', nombre: '', tipo: 'ACTIVO', subtipo: 'NO_CLASIFICADO',
    nivel: 0, cuentaPadreId: null,
    cuentaPadrePeriodoId: '', periodoContableId: '', imputable: false
  });
  const [seleccionada, setSeleccionada] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [nuevoAnio, setNuevoAnio] = useState('');

  const tipos = ['ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'EGRESO'];
  const subtipos = ['NO_CLASIFICADO', 'CIRCULANTE', 'NO_CIRCULANTE'];

  useEffect(() => {
    fetchPeriodos();
  }, []);

  useEffect(() => {
    if (periodoSeleccionado) {
      fetchCuentas(periodoSeleccionado);
    }
  }, [periodoSeleccionado]);

  const fetchPeriodos = async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/plancuentas/periodos`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setPeriodos(data);
      if (!periodoSeleccionado && data.length > 0) {
        setPeriodoSeleccionado(data[0].periodoId);
        localStorage.setItem("periodoId", data[0].periodoId);
      }
    } catch (err) {
      alert("Error al cargar períodos");
    }
  };

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
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    if (name === 'codigo') {
      const partes = value.split('.');
      const cuentaPadre = partes.length > 1 ? partes.slice(0, -1).join('.') : null;
      const nivelCalculado = partes.length - 1;
      setForm((prev) => ({
        ...prev,
        codigo: value,
        cuentaPadreId: cuentaPadre,
        nivel: nivelCalculado
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const handlePeriodoChange = (e) => {
    const id = e.target.value;
    setPeriodoSeleccionado(id);
    setForm(prev => ({ ...prev, periodoContableId: id, cuentaPadrePeriodoId: id }));
    localStorage.setItem("periodoId", id);
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
      fetchCuentas(periodoSeleccionado);
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const eliminarCuenta = async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/plancuentas/cuenta?codigo=${seleccionada.codigo}&periodoId=${seleccionada.periodoContableId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('No se puede eliminar la cuenta.');
      fetchCuentas(periodoSeleccionado);
      resetForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setShowConfirm(false);
    }
  };

  const crearPeriodo = async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/plancuentas/periodos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ anio: parseInt(nuevoAnio) }),
      });
      const data = await res.json();
      setNuevoAnio('');
      await fetchPeriodos();
      setPeriodoSeleccionado(data.periodoId);
      alert('Período creado');
    } catch (err) {
      alert("Error al crear período");
    }
  };

  const copiarCuentas = async () => {
    const origenId = periodoSeleccionado;
    const destino = prompt("¿A qué período deseas copiar las cuentas?");
    if (!destino) return;
    try {
      const res = await fetch(`${config.apiBaseUrl}/plancuentas/copiar-cuentas?origenId=${origenId}&destinoId=${destino}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Error al copiar cuentas');
      alert("Cuentas copiadas correctamente.");
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setForm({ codigo: '', nombre: '', tipo: 'ACTIVO', subtipo: 'NO_CLASIFICADO', nivel: 0, cuentaPadreId: null, cuentaPadrePeriodoId: periodoSeleccionado, periodoContableId: periodoSeleccionado, imputable: false });
    setSeleccionada(null);
  };

  const onSeleccionarCuenta = (cuenta) => {
    setSeleccionada(cuenta);
    setForm({
      codigo: cuenta.codigo,
      nombre: cuenta.nombre,
      tipo: cuenta.tipo,
      subtipo: cuenta.subtipo || 'NO_CLASIFICADO',
      nivel: cuenta.nivel,
      cuentaPadreId: cuenta.cuentaPadreId,
      cuentaPadrePeriodoId: cuenta.cuentaPadrePeriodoId,
      periodoContableId: cuenta.periodoContableId,
      imputable: cuenta.imputable
    });
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container mt-4" style={{ marginLeft: '250px' }}>
        <h2 className="text-center text-success fw-bold" style={{ fontFamily: "Georgia, serif" }}>{seleccionada ? 'Editar Cuenta' : 'Agregar Cuenta Contable'}</h2>

        <div className="mb-4 d-flex align-items-end gap-3">
          <div>
            <label>Seleccionar Período</label>
            <select className="form-control" value={periodoSeleccionado} onChange={handlePeriodoChange}>
              {periodos.map(p => (
                <option key={p.periodoId} value={p.periodoId}>
                  {`#${p.periodoId} - ${p.anio} (${p.mesInicio}/${p.mesFin})`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Año nuevo periodo</label>
            <input className="form-control" value={nuevoAnio} onChange={e => setNuevoAnio(e.target.value)} placeholder="Ej: 2026" />
          </div>
          <button className="btn btn-success" onClick={crearPeriodo}>Crear Período</button>
          <button className="btn btn-warning" onClick={copiarCuentas}>Copiar Cuentas</button>
        </div>

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
            <div className="col">
              <label>Subtipo</label>
              <select className="form-control" name="subtipo" value={form.subtipo} onChange={handleChange}>
                {subtipos.map((s) => (<option key={s}>{s}</option>))}
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
            <div className="col form-check form-switch">
              <label className="form-check-label">¿Imputable?</label>
              <input className="form-check-input" type="checkbox" name="imputable" checked={form.imputable} onChange={handleChange} />
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

export default AgregarCuenta;
