import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/SideBar';
import ProductsPage from './Components/ProductPage';
import Home from './Components/Home';
import CaixaPage from './Components/ProductListCaixa';
import Vendas from './Components/Vendas';
import Clientes from './Components/Clientes';
import Login from './Components/Login';

function App() {
  return (
    <Router>
      <Sidebar /> {/* Exiba o Sidebar sem condições de login */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ProductPage" element={<ProductsPage />} />
        <Route path="/CaixaPage" element={<CaixaPage />} />
        <Route path="/Vendas" element={<Vendas />} />
        <Route path="/Clientes" element={<Clientes />} />
      </Routes>
    </Router>
  );
}

export default App;