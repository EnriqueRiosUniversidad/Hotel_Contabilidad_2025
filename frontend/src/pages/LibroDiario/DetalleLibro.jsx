import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Navbar from '../../components/Navbar'; // Ajusta la ruta si tu Navbar.jsx está en otra carpeta

const DetalleLibro = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { registro } = location.state || {};

  if (!registro) return <p>No se encontró información.</p>;

  const asiento = registro.asiento || [];

  // Calcular totales
  const totalDebe = asiento.reduce((sum, item) => {
    const num = parseFloat(item.debe?.replace(/\./g, "").replace(",", ".")) || 0;
    return sum + num;
  }, 0);

  const totalHaber = asiento.reduce((sum, item) => {
    const num = parseFloat(item.haber?.replace(/\./g, "").replace(",", ".")) || 0;
    return sum + num;
  }, 0);

  // Exportar a Excel
  const exportToExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(asiento);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "AsientoContable");
    const buffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Detalle_Registro_${registro.id}.xlsx`);
  };

  // Exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Detalle del Registro #${registro.id}`, 14, 15);
    doc.autoTable({
      startY: 25,
      head: [["#", "Código", "Cuenta", "Debe", "Haber"]],
      body: asiento.map((item) => [
        item.id,
        item.cod,
        item.cuenta,
        item.debe,
        item.haber,
      ]),
      theme: "striped",
      styles: { fontSize: 10 },
    });
    doc.save(`Detalle_Registro_${registro.id}.pdf`);
  };

  // Exportar a XML
  const exportToXML = () => {
    let xml = "<?xml version='1.0' encoding='UTF-8'?>\n<AsientoContable>\n";
    asiento.forEach((item) => {
      xml += "  <Item>\n";
      Object.keys(item).forEach((key) => {
        xml += `    <${key}>${item[key]}</${key}>\n`;
      });
      xml += "  </Item>\n";
    });
    xml += "</AsientoContable>";
    const blob = new Blob([xml], { type: "application/xml" });
    saveAs(blob, `Detalle_Registro_${registro.id}.xml`);
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container py-3">
        <h4 className="mb-3">Detalle del Registro #{registro.id}</h4>

        {/* Botones de exportación y editar */}
        <div className="row mb-4">
          <div className="col-md-12 d-flex justify-content-between">
            <div>
              <select
                className="form-select form-select-sm w-auto d-inline-block"
                onChange={(e) => {
                  const opcion = e.target.value;
                  if (opcion === "excel") exportToExcel();
                  if (opcion === "pdf") exportToPDF();
                  if (opcion === "xml") exportToXML();
                }}
              >
                <option value="">Exportar</option>
                <option value="excel">Exportar a Excel</option>
                <option value="pdf">Exportar a PDF</option>
                <option value="xml">Exportar a XML</option>
              </select>
            </div>
            <div>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate("/editar-libro", { state: { registro } })}
              >
                ✏️ Editar
              </button>
            </div>
          </div>
        </div>

        {/* Datos generales */}
        <ul className="list-group mb-4">
          <li className="list-group-item"><strong>Tipo:</strong> {registro.tipo}</li>
          <li className="list-group-item"><strong>Fecha:</strong> {registro.fecha}</li>
          <li className="list-group-item"><strong>Descripción:</strong> {registro.descripcion}</li>
          <li className="list-group-item"><strong>Total:</strong> {registro.total}</li>
        </ul>

        {/* Tabla asiento */}
        <h5 className="mt-4">Asiento Contable</h5>
        <table className="table table-bordered">
          <thead className="table-success">
            <tr>
              <th>#</th>
              <th>Código</th>
              <th>Cuenta</th>
              <th>Debe</th>
              <th>Haber</th>
            </tr>
          </thead>
          <tbody>
            {asiento.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.cod}</td>
                <td>{item.cuenta}</td>
                <td>{item.debe}</td>
                <td>{item.haber}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="3"><strong>T</strong></td>
              <td><strong>{totalDebe.toLocaleString()}</strong></td>
              <td><strong>{totalHaber.toLocaleString()}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetalleLibro;
