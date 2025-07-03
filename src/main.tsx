import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from "./components/ui/theme-provider.tsx"
import { ToastContainer } from "react-toastify";


createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <App />
    <ToastContainer
      /> 
  </ThemeProvider>,
)
