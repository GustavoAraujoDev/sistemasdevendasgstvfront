import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Grid, Typography, Paper } from '@mui/material';

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
        <Grid container justifyContent="center" spacing={3} style={{color: '#fbf8f9', fontFamily: 'Arial, sans-serif' }}>
        <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ backgroundColor: '#942a68', borderRadius: '15px', color: '#fbf8f9' }}>
                <Typography variant="h4" align="center" gutterBottom>Bem-vindo ao Nosso Aplicativo de Gerenciamento de Produtos!</Typography>
                <Typography variant="body1" align="center" style={{ marginBottom: '30px' }}>Aqui você pode gerenciar seus produtos de forma fácil e eficiente.</Typography>
                <Divider style={{ margin: '20px 0' }} />
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant="h5" align="center" gutterBottom>{VendasCount}</Typography>
                        <Typography variant="body1" align="center" gutterBottom>Vendas</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5" align="center" gutterBottom>{ProdutosCount}</Typography>
                        <Typography variant="body1" align="center" gutterBottom>Produtos</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5" align="center" gutterBottom>R$ {VendasTotal.toFixed(2)}</Typography>
                        <Typography variant="body1" align="center" gutterBottom>Total de Vendas</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5" align="center" gutterBottom>{ClientesTotal}</Typography>
                        <Typography variant="body1" align="center" gutterBottom>Clientes</Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    </Grid>
    );
}

export default Home;
