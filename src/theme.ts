import { createTheme } from "@mui/material";
import { Theme } from "@mui/material/styles";

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme { }
}
export default createTheme({
  palette: {
    primary: {
      main: "#0E78D5",
    },
    secondary: {
      main: "#9C27B0",
    },
    error: {
      main: "#D32F2F",
    },
    success: {
      main: "#4CAF50",
    },
    warning: {
      main: "#FFC107",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          root: { color: "#D32F2F", },
        },
      }
    },
  },
});
