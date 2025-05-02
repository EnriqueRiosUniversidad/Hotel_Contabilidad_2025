// src/pages/DetalleLibro.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";

const DetalleLibro = () => {
  const { asientoId } = useParams();
  const navigate = useNavigate();
  const [asiento, setAsiento] = useState(null);
  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    api.get(`/librodiario/detalle/${asientoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setAsiento(res.data))
      .catch((err) => console.error("Error al cargar detalle:", err));
  }, [asientoId]);

  if (!asiento) {
    return <div className="container mt-4">Cargando...</div>;
  }

  const totalDebe = asiento.detalles?.reduce((sum, item) => sum + (parseFloat(item.debe) || 0), 0);
  const totalHaber = asiento.detalles?.reduce((sum, item) => sum + (parseFloat(item.haber) || 0), 0);

  const exportToExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(asiento.detalles);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "AsientoContable");
    const buffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Detalle_Registro_${asiento.id}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Detalle del Registro #${asiento.id}`, 14, 15);
    doc.autoTable({
      startY: 25,
      head: [["#", "Código", "Cuenta", "Debe", "Haber"]],
      body: asiento.detalles.map((item, index) => [
        index + 1,
        item.cuentaCodigo,
        item.cuentaNombre,
        item.debe.toFixed(2),
        item.haber.toFixed(2),
      ]),
      theme: "striped",
      styles: { fontSize: 10 },
    });
    doc.save(`Detalle_Registro_${asiento.id}.pdf`);
  };

  const exportToXML = () => {
    let xml = "<?xml version='1.0' encoding='UTF-8'?>\n<AsientoContable>\n";
    asiento.detalles.forEach((item) => {
      xml += "  <Item>\n";
      Object.entries(item).forEach(([key, value]) => {
        xml += `    <${key}>${value}</${key}>\n`;
      });
      xml += "  </Item>\n";
    });
    xml += "</AsientoContable>";
    const blob = new Blob([xml], { type: "application/xml" });
    saveAs(blob, `Detalle_Registro_${asiento.id}.xml`);
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container py-3" style={{ marginLeft: "270px" }}>
        <h4 className="mb-3">Detalle del Registro #{asiento.id}</h4>

        <div className="row mb-4">
          <div className="col-md-12 d-flex justify-content-between">
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

            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => navigate("/editar-libro", { state: { registro: asiento } })}
            >
              ✏️ Editar
            </button>
          </div>
        </div>

        <ul className="list-group mb-4">
          <li className="list-group-item"><strong>Tipo:</strong> {asiento.tipoAsiento}</li>
          <li className="list-group-item"><strong>Fecha:</strong> {asiento.fecha}</li>
          <li className="list-group-item"><strong>Descripción:</strong> {asiento.descripcion}</li>
        </ul>

        <h5 className="mt-4">Movimientos contables</h5>
        <table className="table table-bordered mt-3">
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
            {asiento.detalles.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.cuentaCodigo}</td>
                <td>{item.cuentaNombre}</td>
                <td>{item.debe.toFixed(2)}</td>
                <td>{item.haber.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="3"><strong>Totales</strong></td>
              <td><strong>{totalDebe.toFixed(2)}</strong></td>
              <td><strong>{totalHaber.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>

        <button className="btn btn-secondary" onClick={() => navigate("/libro-diario")}>
          Volver
        </button>
      </div>
    </div>
  );
};

export default DetalleLibro;
