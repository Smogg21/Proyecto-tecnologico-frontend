// import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Login } from "./Views/Login";
import { VistaOperador } from "./Views/VistaOperador";
import { NuevoLote } from "./Views/NuevoLote";
import { VistaInventario } from "./Views/VistaInventario";
import { NuevoProducto } from "./Views/NuevoProducto";
import { RegistrarMovimiento } from "./Views/RegistrarMovimiento";
import { VistaMovimientos } from "./Views/VistaMovimientos";
import { PublicRoute } from "./Components/PublicRoute";
import { PrivateRoute } from "./Components/PrivateRoute";
import { VistaGerente } from "./Views/VistaGerente";
import { Unauthorized } from "./Views/Unauthorized";
import { VistaAdministrador } from "./Views/VistaAdministrador";
import { NuevaContraseña } from "./Views/NuevaContraseña";
import { VistaGestionSistema } from "./Views/VistaGestionSistema";

import { NuevoUsuario } from "./Views/NuevoUsuario";
import { EditarUsuario } from "./Views/EditarUsuario";
import { NuevaCategoria } from "./Views/NuevaCategoria";
import { EditarCategoria } from "./Views/EditarCategoria";
import {  CssBaseline } from "@mui/material";


function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        {/*Notificaciones*/}
        <ToastContainer />
        <Routes>
          {/* Ruta Pública para Login */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login  />
              </PublicRoute>
            }
          />

          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Rutas Protegidas */}
          <Route
            path="/vistaOperador"
            element={
              <PrivateRoute roles={[1, 2]}>
                <VistaOperador/>
              </PrivateRoute>
            }
          />
          <Route
            path="/inventario"
            element={
              <PrivateRoute roles={[1, 2]}>
                <VistaInventario />
              </PrivateRoute>
            }
          />
          <Route
            path="/nuevoLote"
            element={
              <PrivateRoute roles={[1, 2]}>
                <NuevoLote />
              </PrivateRoute>
            }
          />
          <Route
            path="/nuevoProducto"
            element={
              <PrivateRoute roles={[1, 2]}>
                <NuevoProducto />
              </PrivateRoute>
            }
          />
          <Route
            path="/registrarMovimiento"
            element={
              <PrivateRoute roles={[1, 2]}>
                <RegistrarMovimiento />
              </PrivateRoute>
            }
          />
          <Route
            path="/verMovimientos"
            element={
              <PrivateRoute roles={[1, 2]}>
                <VistaMovimientos />
              </PrivateRoute>
            }
          />
          <Route
            path="/vistaGerente"
            element={
              <PrivateRoute roles={[1, 3]}>
                <VistaGerente  />
              </PrivateRoute>
            }
          />
          <Route
            path="/vistaAdministrador"
            element={
              <PrivateRoute roles={[1]}>
                <VistaAdministrador  />
              </PrivateRoute>
            }
          />
          <Route
            path="/vistaGestionSistema"
            element={
              <PrivateRoute roles={[1]}>
                <VistaGestionSistema />
              </PrivateRoute>
            }
          />
          <Route
            path="/nuevaCategoria"
            element={
              <PrivateRoute roles={[1]}>
                <NuevaCategoria />
              </PrivateRoute>
            }
          />
          <Route
            path="/editarCategoria"
            element={
              <PrivateRoute roles={[1]}>
                <EditarCategoria />
              </PrivateRoute>
            }
          />
          <Route
            path="/nuevoUsuario"
            element={
              <PrivateRoute roles={[1]}>
                <NuevoUsuario />
              </PrivateRoute>
            }
          />
          <Route
            path="/editarUsuario"
            element={
              <PrivateRoute roles={[1]}>
                <EditarUsuario />
              </PrivateRoute>
            }
          />
          <Route
            path="/nuevaContraseña"
            element={
              <PrivateRoute roles={[1]}>
                <NuevaContraseña />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
