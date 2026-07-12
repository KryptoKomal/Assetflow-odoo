import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <AppRoutes />
                    <ToastContainer position="top-right" autoClose={3000} theme="colored" />
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;