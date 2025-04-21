import { useState } from 'react';

const CuentaContableItem = ({ cuenta, nivel, children }) => {
  const [colapsado, setColapsado] = useState(false);

  return (
    <div
      className="mb-1 border-l border-gray-300"
      style={{ marginLeft: `${nivel * 12}px` }}
    >
      <div
        onClick={() => setColapsado(!colapsado)}
        className="cursor-pointer p-1 hover:bg-gray-50 flex items-center"
      >
        {children?.length > 0 && (
          <span className="mr-2 text-sm">{colapsado ? '▶' : '▼'}</span>
        )}
        <span className="font-mono text-sm">
          {cuenta.codigo} - {cuenta.nombre} ({cuenta.tipo}) - Nivel {cuenta.nivel}
        </span>
      </div>
      {!colapsado && children}
    </div>
  );
};

const construirJerarquia = (cuentas) => {
  const mapa = new Map();
  cuentas.forEach((cuenta) =>
    mapa.set(cuenta.codigo, { ...cuenta, hijos: [] })
  );

  const raiz = [];
  cuentas.forEach((cuenta) => {
    const partes = cuenta.codigo.split('.');
    if (partes.length === 1) {
      raiz.push(mapa.get(cuenta.codigo));
    } else {
      const padreCodigo = partes.slice(0, -1).join('.');
      const padre = mapa.get(padreCodigo);
      if (padre) padre.hijos.push(mapa.get(cuenta.codigo));
      else raiz.push(mapa.get(cuenta.codigo));
    }
  });

  return raiz;
};

const renderCuentas = (cuentas, nivel = 0) =>
  cuentas.map((cuenta) => (
    <CuentaContableItem key={cuenta.codigo} cuenta={cuenta} nivel={nivel}>
      {renderCuentas(cuenta.hijos, nivel + 1)}
    </CuentaContableItem>
  ));

export default function PlanCuentasTree({ cuentas }) {
  const jerarquia = construirJerarquia(cuentas);

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-xl font-bold mb-4">Plan de Cuentas</h2>
      <div>{renderCuentas(jerarquia)}</div>
    </div>
  );
}
