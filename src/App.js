import React, { useState } from 'react';
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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route 
          path="*"
          element={
            isLoggedIn ? (
                <div style={{ display: 'flex', flexGrow: 1 }}>
                  <Sidebar />
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/ProductPage" element={<ProductsPage />} />
                    <Route path="/CaixaPage" element={<CaixaPage />} />
                    <Route path="/Vendas" element={<Vendas />} />
                    <Route path="/Clientes" element={<Clientes />} />
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
