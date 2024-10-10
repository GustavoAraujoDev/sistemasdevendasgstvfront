import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Components/SideBar';
import Header from './Components/Header'; // Se você precisar do Header, não esqueça de adicioná-lo ao layout
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
    // Verifica se o usuário está logado ao carregar a página
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // Armazena o estado de login no LocalStorage ao fazer login
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    // Remove o estado de login do LocalStorage ao fazer logout
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      <ToastContainer />
      {isLoggedIn && <Sidebar onLogout={handleLogoutSuccess} />}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/ProductPage" element={isLoggedIn ? <ProductsPage /> : <Navigate to="/login" />} />
        <Route path="/CaixaPage" element={isLoggedIn ? <CaixaPage /> : <Navigate to="/login" />} />
        <Route path="/Vendas" element={isLoggedIn ? <Vendas /> : <Navigate to="/login" />} />
        <Route path="/Clientes" element={isLoggedIn ? <Clientes /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      </Routes>
    </Router>
  );
}

export default App;
