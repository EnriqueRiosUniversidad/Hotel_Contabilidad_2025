import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportDropdown = ({ data }) => {
  const exportToExcel = () => {
    const allRows = [];
    data.forEach((cuenta) => {
      cuenta.movimientos.forEach((m) => {
        allRows.push({
          Cuenta: `${cuenta.codigo} - ${cuenta.nombre}`,
          Fecha: m.fecha,
          Concepto: m.concepto,
          Debe: m.debe,
          Haber: m.haber,
          Saldo: m.saldo,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(allRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'LibroMayor');
    XLSX.writeFile(workbook, 'libro_mayor.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Libro Mayor', 14, 15);
    let y = 25;

    data.forEach((cuenta) => {
      doc.setFontSize(12);
      doc.text(`Cuenta: ${cuenta.codigo} - ${cuenta.nombre}`, 14, y);
      y += 5;

      const rows = cuenta.movimientos.map((m) => [
        m.fecha,
        m.concepto,
        m.debe.toFixed(2),
        m.haber.toFixed(2),
        m.saldo.toFixed(2),
      ]);

      doc.autoTable({
        head: [['Fecha', 'Concepto', 'Debe', 'Haber', 'Saldo']],
        body: rows,
        startY: y,
        theme: 'grid',
        styles: { fontSize: 8 },
      });

      y = doc.lastAutoTable.finalY + 10;
    });

    doc.save('libro_mayor.pdf');
  };

  const exportToXML = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<LibroMayor>\n';
    data.forEach((cuenta) => {
      xml += `  <Cuenta codigo="${cuenta.codigo}" nombre="${cuenta.nombre}">\n`;
      cuenta.movimientos.forEach((m) => {
        xml += `    <Movimiento>\n`;
        xml += `      <Fecha>${m.fecha}</Fecha>\n`;
        xml += `      <Concepto>${m.concepto}</Concepto>\n`;
        xml += `      <Debe>${m.debe}</Debe>\n`;
        xml += `      <Haber>${m.haber}</Haber>\n`;
        xml += `      <Saldo>${m.saldo}</Saldo>\n`;
        xml += `    </Movimiento>\n`;
      });
      xml += `  </Cuenta>\n`;
    });
    xml += '</LibroMayor>';

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'libro_mayor.xml';
    link.click();
  };

  return (
    <select
      className="form-select form-select-sm w-auto"
      onChange={(e) => {
        if (e.target.value === 'excel') exportToExcel();
        if (e.target.value === 'pdf') exportToPDF();
        if (e.target.value === 'xml') exportToXML();
        e.target.selectedIndex = 0;
      }}
    >
      <option disabled selected>Exportar como...</option>
      <option value="pdf">PDF</option>
      <option value="excel">Excel</option>
      <option value="xml">XML</option>
    </select>
  );
};

export default ExportDropdown;