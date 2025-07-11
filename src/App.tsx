import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Navigate } from "react-router-dom";
import { auth } from "./firebase/firebase";
function App() {
  function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const user = auth.currentUser;

    if (!user) {
      return <Navigate to="/" />;
    }

    return children;
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
