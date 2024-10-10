import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Components/SideBar';
import ProductsPage from './Components/ProductPage';
import Home from './Components/Home';
import CaixaPage from './Components/ProductListCaixa';
import Vendas from './Components/Vendas';
import Clientes from './Components/Clientes';
import Login from './Components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      <ToastContainer />
      {isLoggedIn && <Sidebar onLogout={handleLogoutSuccess} />}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        {/* Comente as rotas a seguir para testar apenas o login */}
        {/* <Route path="/ProductPage" element={<ProductsPage />} />
        <Route path="/CaixaPage" element={<CaixaPage />} />
        <Route path="/Vendas" element={<Vendas />} />
        <Route path="/Clientes" element={<Clientes />} /> */}
      </Routes>
    </Router>
  );
}

export default App;