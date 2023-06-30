import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Provider } from "react-redux";
import store from "../store";

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
        <Provider store={store}>
          <Navbar />
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </>
  );
}
