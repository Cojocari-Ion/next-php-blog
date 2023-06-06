import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {},
        },
      },

      MuiInputBase: {
        styleOverrides: {},
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
