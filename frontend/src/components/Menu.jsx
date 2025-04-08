import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../context/theme-context';
import "../App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BsInboxesFill, BsFillCartFill, BsFillFolderFill, BsClipboard2HeartFill,
  BsUiChecks, BsGraphUpArrow, BsPersonBoundingBox, BsBuildingFillGear
} from "react-icons/bs";

const Menu = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div style={{ boxShadow: '3px 3px 6px rgba(0,0,0,1.5)' }} className={`d-flex flex-column justify-content-start ${theme}`}>
      
      <NavLink to='/inicio' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        <BsGraphUpArrow /> Inicio
      </NavLink>

      <NavLink to='/asiento' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        <BsFillFolderFill /> Agregar Asiento
      </NavLink>
      <NavLink to='/balanceR' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        <BsClipboard2HeartFill /> Balance De Resultado
      </NavLink>
      <NavLink to='/blanceG' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        <BsUiChecks /> Balance General
      </NavLink>
      <NavLink to='/balanceSYS' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        <BsFillCartFill /> Balance de Sumas y Saldos
      </NavLink>
      <NavLink to='/libroD' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        <BsPersonBoundingBox /> Libro Diario
      </NavLink>
      <NavLink to='/libroM' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        <BsBuildingFillGear /> Libro Mayor
      </NavLink>
    </div>
  );
};

export default Menu;
