import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./components/ui/theme-provider.tsx";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./firebase/AuthContext.tsx";

const api = import.meta.env.VITE_API_KEY;
console.log(api);


createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AuthProvider>
      <App />
      <ToastContainer />
    </AuthProvider>
  </ThemeProvider>
);
