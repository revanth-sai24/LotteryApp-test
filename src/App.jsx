// import "./App.css";
import WagmiWrapper from "./Configurations/Wagmi/WagmiConfiguration";
import ThemeWrapper from "./Theme/ThemeWrapper";
import ContextWrapper from "./Componenets/context/ContextAPI";
import Header from "./Componenets/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes-config/AppRoutes";

function App() {
  return (
    <WagmiWrapper>
      <ThemeWrapper>
        <ContextWrapper>
          <Header />
          {/* <ProgressBar />
          
           */}
          <AppRoutes />
          <ToastContainer />
        </ContextWrapper>
      </ThemeWrapper>
    </WagmiWrapper>
  );
}

export default App;
