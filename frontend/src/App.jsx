import './index.css'
import "./App.css";
import Login from "./pages/login/Login"
import Signup from './pages/signup/Signup'
import Home from './pages/home/Home'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContext';

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className="h-screen w-screen bg-gray-900 text-white overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <Signup />} />
      </Routes>
    </div>
  );
}

export default App;
