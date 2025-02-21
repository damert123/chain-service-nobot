import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#676CF6",
    },
    error: {
      main: "#FF4D49",
    },
    info: {
      main: "#26C6F9",
      contrastText: "white",
    },
  },
});
