import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";
import Menu from "./components/Menu";
import AgregarAsiento from "./components/AgregarAsiento";
import BalanceDeResultado from "./components/BalanceDeResultado";
import BalanceGeneral from "./components/BalanceGeneral";
import BalanceSumaYS from "./components/BalanceSumaYS";
import Inicio from "./components/Inicio";
import LibroDiario from "./components/LibroDiario";
import LibroMayor from "./components/LibroMayor";

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
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
