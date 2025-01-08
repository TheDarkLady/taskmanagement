import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from "./components/ui/theme-provider.tsx"

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <App />
  </ThemeProvider>,
)
