import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import PropTypes from "prop-types";

const defaultTheme = createTheme();

export default function ThemeWrapper(props) {
  //   const theme = useTheme();
  // const colorMode = React.useContext(ColorModeContext);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
}

ThemeWrapper.propTypes = {
  children: PropTypes.any,
};
