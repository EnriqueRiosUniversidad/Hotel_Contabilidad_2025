import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";
import Menu from "./components/Menu";
import AgregarAsiento from "./components/AgregarAsiento";
import AgregarPlan from "./components/AgregarPlan";
import BalanceDeResultado from "./components/BalanceDeResultado";
import BalanceGeneral from "./components/BalanceGeneral";
import BalanceSumaYS from "./components/BalanceSumaYS";
import Inicio from "./components/Inicio";
import LibroDiario from "./components/LibroDiario";
import LibroMayor from "./components/LibroMayor";
import DetalleLibro from './components/DetalleLibro';
import EditarLibro from './components/EditarLibro';
import AgregarLibro from './components/AgregarLibro';


import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <ThemeProvider>
      <div className="container-fluid p-3 d-flex flex-row fondo-panel">
        <Menu />
        <div className="container">
          <Routes>
            <Route path="/" element={<Inicio />} /> {/* Ruta para raíz */}
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/asiento" element={<AgregarAsiento />} />
            <Route path="/balanceR" element={<BalanceDeResultado />} />
            <Route path="/blanceG" element={<BalanceGeneral />} />
            <Route path="/balanceSYS" element={<BalanceSumaYS />} />
            <Route path="/libroD" element={<LibroDiario />} />
            <Route path="/libroM" element={<LibroMayor />} />
            <Route path="/PlanD" element={<AgregarPlan />} />
            <Route path="/detalle-libro" element={<DetalleLibro />} />
            <Route path="/editar-libro" element={<EditarLibro />} />
            <Route path="/agregar-libro" element={<AgregarLibro />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
