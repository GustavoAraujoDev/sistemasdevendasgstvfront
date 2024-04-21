import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

function Home() {
    const [VendasCount, setVendasCount] = useState(0);
    const [ProdutosCount, setProdutosCount] = useState(0);
    const [VendasTotal, setVendasTotal] = useState(0);
    const [ClientesTotal, setClientesTotal] = useState(0);

    useEffect(() => {
        fetchProdutosCount();
        fetchVendasCount();
        fetchVendasTotal();
        fetchClientesCount();
    }, []);

    const fetchClientesCount = async () => {
        try {
            const response = await fetch("http://localhost:6060/Clientes");
            if (!response.ok) {
                throw new Error("Erro ao buscar número de Clientes: " + response.statusText);
            }
            const data = await response.json();
            const totalCountdentista = data.length;
            setClientesTotal(totalCountdentista);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchVendasCount = async () => {
        try {
            const response = await fetch("http://localhost:6060/Vendas");
            if (!response.ok) {
                throw new Error("Erro ao buscar número de Vendas: " + response.statusText);
            }
            const data = await response.json();
            const totalCountdentista = data.length;
            setVendasCount(totalCountdentista);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchVendasTotal = async () => {
        try {
            const response = await fetch("http://localhost:6060/Vendas");
            if (!response.ok) {
                throw new Error("Erro ao buscar o total de Vendas: " + response.statusText);
            }
            const data = await response.json();
            const vendasComPreco = data.filter(venda => venda.total_price !== null);
            const totalVendas = vendasComPreco.reduce((total, venda) => total + venda.total_price, 0);
            setVendasTotal(totalVendas);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProdutosCount = async () => {
        try {
            const response = await fetch("http://localhost:6060/Produtos");
            if (!response.ok) {
                throw new Error("Erro ao buscar número de Produtos: " + response.statusText);
            }
            const data = await response.json();
            const totalCountdentista = data.length;
            setProdutosCount(totalCountdentista);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '20px', color: '#333', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: '#555', marginBottom: '20px', textAlign: 'center' }}>Bem-vindo ao Nosso Aplicativo de Gerenciamento de Produtos!</h1>
        <p style={{ fontSize: '16px', marginBottom: '30px', textAlign: 'center' }}>Aqui você pode gerenciar seus produtos de forma fácil e eficiente.</p>
        <div className="overview" style={{ display: 'flex', flexDirection: 'column', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '20px', backgroundColor: '#f9f9f9', transition: 'box-shadow 0.3s ease-in-out' }}>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '24px', marginBottom: '10px', fontWeight: 'bold' }}>{VendasCount}</p>
                <p style={{ fontSize: '16px', margin: 0 }}>Vendas</p>
            </div>
            <Divider style={{ margin: '10px' }} />
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '24px', marginBottom: '10px', fontWeight: 'bold' }}>{ProdutosCount}</p>
                <p style={{ fontSize: '16px', margin: 0 }}>Produtos</p>
            </div>
            <Divider style={{ margin: '10px' }} />
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '24px', marginBottom: '10px', fontWeight: 'bold' }}>R$ {VendasTotal.toFixed(2)}</p>
                <p style={{ fontSize: '16px', margin: 0 }}>Total de Vendas</p>
            </div>
            <Divider style={{ margin: '10px' }} />
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '24px', marginBottom: '10px', fontWeight: 'bold' }}> {ClientesTotal}</p>
                <p style={{ fontSize: '16px', margin: 0 }}>Clientes</p>
            </div>
        </div>
    </div>
    );
}

export default Home;
