import React from 'react';
import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
import Sidebar from './Components/SideBar';
import Header from './Components/Header';
import ProductsPage from './Components/ProductPage';
import Home from './Components/Home';
import CaixaPage from '../src/Components/ProductListCaixa'
import Vendas from '../src/Components/Vendas'
import Clientes from '../src/Components/Clientes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
    <ToastContainer />
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflowX: 'hidden' }}>
        <Sidebar />
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', maxWidth: 'calc(100% - 250px)' }}>
          <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/ProductPage" element={<ProductsPage />} />
            <Route path="/CaixaPage" element={<CaixaPage />} />
            <Route path="/Vendas" element={<Vendas />} />
            <Route path="/Clientes" element={<Clientes />} />
          </Routes>
        </div>
      </div>
    </div>
  </Router>
  );
}

export default App;
