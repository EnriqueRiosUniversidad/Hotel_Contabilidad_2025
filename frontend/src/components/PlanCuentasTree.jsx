import { useState } from 'react';

const CuentaContableItem = ({ cuenta, nivel, children, onSelect, seleccionada }) => {
  const [colapsado, setColapsado] = useState(false);

  return (
    <div
      className={`mb-1 border-start ${seleccionada ? 'bg-success bg-opacity-25 rounded shadow-sm ps-2 py-1 border border-success' : ''}`}
      style={{ marginLeft: `${nivel * 12}px` }}
    >
      <div
        className="cursor-pointer p-1 hover-shadow"
        onClick={() => onSelect(cuenta)}
      >
        <div className="d-flex align-items-center">
          {children?.length > 0 && (
            <span className="me-2 text-sm" onClick={(e) => { e.stopPropagation(); setColapsado(!colapsado); }}>
              {colapsado ? '▶' : '▼'}
            </span>
          )}
          <span className="font-monospace">
            {cuenta.codigo} - {cuenta.nombre} ({cuenta.tipo}) - Nivel {cuenta.nivel + 1}
          </span>
        </div>
      </div>
      {!colapsado && children}
    </div>
  );
};

const construirJerarquia = (cuentas) => {
  const mapa = new Map();
  cuentas.forEach((cuenta) => mapa.set(cuenta.codigo, { ...cuenta, hijos: [] }));
  const raiz = [];
  cuentas.forEach((cuenta) => {
    const partes = cuenta.codigo.split('.');
    if (partes.length === 1) {
      raiz.push(mapa.get(cuenta.codigo));
    } else {
      const padreCodigo = partes.slice(0, -1).join('.');
      const padre = mapa.get(padreCodigo);
      padre ? padre.hijos.push(mapa.get(cuenta.codigo)) : raiz.push(mapa.get(cuenta.codigo));
    }
  });
  return raiz;
};

const renderCuentas = (cuentas, nivel, onSelect, seleccionada) =>
  cuentas.map((cuenta) => (
    <CuentaContableItem
      key={cuenta.codigo}
      cuenta={cuenta}
      nivel={nivel}
      onSelect={onSelect}
      seleccionada={seleccionada?.codigo === cuenta.codigo && seleccionada?.periodoContableId === cuenta.periodoContableId}
    >
      {renderCuentas(cuenta.hijos, nivel + 1, onSelect, seleccionada)}
    </CuentaContableItem>
  ));

export default function PlanCuentasTree({ cuentas, onSelect, seleccionada }) {
  const jerarquia = construirJerarquia(cuentas);
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="fs-4 fw-bold mb-3">Plan de Cuentas</h2>
      <div>{renderCuentas(jerarquia, 0, onSelect, seleccionada)}</div>
    </div>
  );
}