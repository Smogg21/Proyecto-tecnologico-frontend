import  { createContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";


export const ColorModeContext = createContext({ toggleColorMode: () => {} });

// eslint-disable-next-line react/prop-types
export const ColorModeProvider = ({ children }) => {


  const [mode, setMode] = useState(
    localStorage.getItem("theme") || "light"
  );

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const nextMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("theme", nextMode);
          return nextMode;
        });
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};