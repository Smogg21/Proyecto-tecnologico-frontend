import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./Views/Login";
import { VistaOperador } from "./Views/VistaOperador";
import { NuevoLote } from "./Views/NuevoLote";
import { VistaInventario } from "./Views/VistaInventario";
import { NuevoProducto } from "./Views/NuevoProducto";
import { RegistrarMovimiento } from "./Views/RegistrarMovimiento";
import { VistaMovimientos } from "./Views/VistaMovimientos";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/vistaOperador" element={<VistaOperador />} />
        <Route path="/inventario" element={<VistaInventario />} />
        <Route path="/nuevoLote" element={<NuevoLote />} />
        <Route path="/nuevoProducto" element={<NuevoProducto />} />
        <Route path="/registrarMovimiento" element={<RegistrarMovimiento />} />
        <Route path="/verMovimientos" element={<VistaMovimientos />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
