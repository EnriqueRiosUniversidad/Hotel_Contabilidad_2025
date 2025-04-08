import { FaHome, FaBook, FaPlusCircle, FaBalanceScale, FaChartLine, FaFileAlt } from "react-icons/fa";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#A3F7B5] flex flex-col items-center py-6 shadow-md">
      <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-4" />

      <hr className="w-32 border border-gray-400 mb-6" />

      <ul className="w-full px-4 space-y-2">
        <li className="flex items-center gap-2 text-black font-medium p-2 hover:bg-green-200 rounded">
          <FaHome /> Inicio
        </li>
        <li className="flex items-center gap-2 text-white font-medium p-2 bg-green-600 rounded">
          <FaBook /> Libro diario
        </li>
        <li className="flex items-center gap-2 text-black font-medium p-2 hover:bg-green-200 rounded">
          <FaFileAlt /> Libro Mayor
        </li>
        <li className="flex items-center gap-2 text-black font-medium p-2 hover:bg-green-200 rounded">
          <FaPlusCircle /> Agregar Asiento
        </li>
        <li className="flex items-center gap-2 text-black font-medium p-2 hover:bg-green-200 rounded">
          <FaBalanceScale /> Balance General
        </li>
        <li className="flex items-center gap-2 text-black font-medium p-2 hover:bg-green-200 rounded text-sm">
          <FaChartLine /> Balance de<br /> Sumas y Saldos
        </li>
        <li className="flex items-center gap-2 text-black font-medium p-2 hover:bg-green-200 rounded text-sm">
          <FaFileAlt /> Balance de Resultados
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
