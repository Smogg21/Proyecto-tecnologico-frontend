// src/Views/Login.js
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Button from "@mui/material/Button";
import {
  Alert,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Brightness4, Brightness7, Person, Lock } from "@mui/icons-material";
import { ColorModeContext } from "../contexts/ColorModeContext";

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [Usuario, setUsuario] = useState("");
  const [Contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const colorMode = useContext(ColorModeContext);
  const apiUrl = import.meta.env.VITE_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(`${apiUrl}/api/login`, {
        Usuario,
        Contraseña,
      });

      // Asumiendo que el backend devuelve el token en response.data.token
      login(response.data.token);
      const decodedToken = jwtDecode(response.data.token);
      // Redireccionar al dashboard o a la ruta protegida
      switch (decodedToken.IdRol) {
        case 1:
          navigate("/vistaAdministrador");
          break;
        case 2:
          navigate("/vistaOperador");
          break;
        case 3:
          navigate("/vistaGerente");
          break;
        default:
          setError("Rol de usuario no reconocido.");
      }
    } catch (err) {
      // Manejar el mensaje de error específico del backend
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Credenciales inválidas o error en el servidor.");
      }
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      {/* Botón para alternar el modo */}
      <Box alignSelf="flex-end">
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
          {localStorage.getItem("theme") === "dark" ? (
            <Brightness7 />
          ) : (
            <Brightness4 />
          )}
        </IconButton>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="background.default"
        color="text.primary"
        padding={2}
      >
        <Typography variant="h4" gutterBottom>
          Iniciar Sesión
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 360,
            p: 3,
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                type="text"
                label="Usuario"
                value={Usuario}
                onChange={(e) => setUsuario(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                type="password"
                label="Contraseña"
                value={Contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" type="submit">
                Iniciar Sesión
              </Button>
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
