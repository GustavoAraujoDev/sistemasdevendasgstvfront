import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/SideBar';
import Header from './Components/Header';
import ProductsPage from './Components/ProductPage';
import Home from './Components/Home';
import CaixaPage from '../src/Components/ProductListCaixa';
import Vendas from '../src/Components/Vendas';
import Clientes from '../src/Components/Clientes';
import Login from '../src/Components/Login';
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
    localStorage.setItem('isLoggedIn', true);
  };

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    // Remove o estado de login do LocalStorage ao fazer logout
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="*"
          element={
            isLoggedIn ? (
              <div style={{ display: 'flex', flexGrow: 1 }}>
                <Sidebar onLogout={handleLogoutSuccess}/>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/ProductPage" element={<ProductsPage />} />
                  <Route path="/CaixaPage" element={<CaixaPage />} />
                  <Route path="/Vendas" element={<Vendas />} />
                  <Route path="/Clientes" element={<Clientes />} />
                  <ToastContainer />
                </Routes>
              </div>
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
