import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer></ToastContainer>
    </BrowserRouter>
  );
}

export default App;
