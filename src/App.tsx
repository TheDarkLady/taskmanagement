import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/taskmanagement' element={<Login/>} />
      <Route path='/taskmanagement/dashboard' element={<Dashboard/>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
