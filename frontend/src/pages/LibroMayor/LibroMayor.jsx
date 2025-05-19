import { useState, useEffect } from "react";
import CuentaMayorCard from "./CuentaMayorCard";
import ExportDropdown from "./ExportDropdown";
import Navbar from "../../components/Navbar";


const LibroMayor = () => {
  const [cuentas, setCuentas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 6;

  useEffect(() => {
    const datos = [
      {
        codigo: "32",
        nombre: "Proveedores",
        movimientos: [
          { fecha: "15/09/2025", concepto: "Compra de Toallas", debe: 72.6, haber: 0, saldo: 72.6 },
          { fecha: "30/10/2025", concepto: "Pago al proveedor", debe: 0, haber: 72.6, saldo: 0 },
        ],
      },
      {
        codigo: "321",
        nombre: "Bancos",
        movimientos: [
          { fecha: "15/09/2025", concepto: "Cobro al cliente", debe: 96.8, haber: 0, saldo: 96.8 },
          { fecha: "16/09/2025", concepto: "Pago transporte", debe: 0, haber: 6.05, saldo: 90.75 },
          { fecha: "30/10/2025", concepto: "Pago al proveedor", debe: 0, haber: 72.6, saldo: 18.15 },
        ],
      },
      {
        codigo: "20",
        nombre: "Compras de Mercadería",
        movimientos: [
          { fecha: "15/09/2025", concepto: "Compra de Almohadas", debe: 72.6, haber: 0, saldo: 72.6 },
          { fecha: "30/10/2025", concepto: "Pago al proveedor", debe: 0, haber: 72.6, saldo: 0 },
        ],
      },
      {
        codigo: "32",
        nombre: "Proveedores",
        movimientos: [
          { fecha: "15/09/2025", concepto: "Compra de Sabanas y edredones", debe: 72.6, haber: 0, saldo: 72.6 },
          { fecha: "30/10/2025", concepto: "Pago al proveedor", debe: 0, haber: 72.6, saldo: 0 },
        ],
      },
      {
        codigo: "32",
        nombre: "Proveedores",
        movimientos: [
          { fecha: "15/09/2025", concepto: "Compra de Productos De Limpieza", debe: 72.6, haber: 0, saldo: 72.6 },
          { fecha: "30/10/2025", concepto: "Pago al proveedor", debe: 0, haber: 72.6, saldo: 0 },
        ],
      },
      {
        codigo: "32",
        nombre: "Proveedores",
        movimientos: [
          { fecha: "15/09/2025", concepto: "Compra de Electrodomesticos", debe: 72.6, haber: 0, saldo: 72.6 },
          { fecha: "30/10/2025", concepto: "Pago al proveedor", debe: 0, haber: 72.6, saldo: 0 },
        ],
      },
    ];
    setCuentas(datos);
  }, []);

  const cuentasFiltradas = cuentas.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.codigo.includes(busqueda)
  );

  const totalPaginas = Math.ceil(cuentasFiltradas.length / porPagina);
  const cuentasPaginadas = cuentasFiltradas.slice((pagina - 1) * porPagina, pagina * porPagina);

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container mt-4" style={{ marginLeft: "270px" }}>
        <h2 className="text-center mb-3">Libro Mayor</h2>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Cuenta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <ExportDropdown data={cuentasFiltradas} />
        </div>

        <div className="row">
          {cuentasPaginadas.map((cuenta, idx) => (
            <div key={idx} className="col-md-6 mb-4">
              <CuentaMayorCard cuenta={cuenta} />
            </div>
          ))}
        </div>

        {totalPaginas > 1 && (
          <div className="text-center my-3">
            <nav>
              <ul className="pagination justify-content-center">
                {Array.from({ length: totalPaginas }, (_, i) => (
                  <li key={i} className={`page-item ${pagina === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPagina(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibroMayor;