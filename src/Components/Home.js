import React, { useState, useEffect } from 'react';
import { Grid, Typography, CircularProgress, IconButton } from '@mui/material';
import { motion } from 'framer-motion';

import { BarChart, Label, People, ShoppingCart } from '@mui/icons-material';

function Home() {
    const [loading, setLoading] = useState(true);
    const [vendasCount, setVendasCount] = useState(0);
    const [produtosCount, setProdutosCount] = useState(0);
    const [vendasTotal, setVendasTotal] = useState(0);
    const [produtosTotal, setProdutosTotal] = useState(0);
    const [clientesTotal, setClientesTotal] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [clientesResponse, vendasResponse, produtosResponse] = await Promise.all([
                fetch("https://sistemasdevendasgstvback.onrender.com/Clientes"),
                fetch("https://sistemasdevendasgstvback.onrender.com/Vendas"),
                fetch("https://sistemasdevendasgstvback.onrender.com/Produtos")
            ]);
            
            if (!clientesResponse.ok || !vendasResponse.ok || !produtosResponse.ok) {
                throw new Error("Erro ao buscar dados.");
            }

            const [clientesData, vendasData, produtosData] = await Promise.all([
                clientesResponse.json(),
                vendasResponse.json(),
                produtosResponse.json()
            ]);

            setClientesTotal(clientesData.length);
            setVendasCount(vendasData.length);
            setProdutosCount(produtosData.length);

            const vendasTotal = vendasData.reduce((total, venda) => total + venda.total_price, 0);
            setVendasTotal(vendasTotal);

            const produtosTotal = produtosData.reduce((total, produto) => total + (produto.Preco * produto.Quantidade), 0);
            setProdutosTotal(produtosTotal);

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', position: 'relative', backgroundColor: '#c7c7c6'}}>
        <Grid item xs={12} md={8}>
            <Typography variant="h4" color="#c0844a" gutterBottom>Gerencie seus Produtos com Maestria</Typography>
            <Typography variant="body1" style={{ color: '#969696', marginBottom: '30px' }}>Explore todas as possibilidades do nosso aplicativo de gestão de produtos. Aqui, você tem tudo o que precisa para manter seu negócio organizado e próspero.</Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3} alignItems="center" justifyContent="center" style={{ padding: '20px' }}> 
                 {[{ icon: People, label1: clientesTotal, label2: 'Clientes' }, { icon: ShoppingCart, label1: produtosCount, label2: 'Produtos' }, { icon: BarChart, label1: vendasCount, label2: 'Vendas' }, { icon: ShoppingCart, label1: `R$ ${produtosTotal.toFixed(2)}`, label2: 'Valor Produtos'}, { icon: BarChart, label1: `R$ ${vendasTotal.toFixed(2)}`, label2: 'Total Vendas' }].map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}  >
                     <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <IconButton style={{boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#0a2e18', width: '200px', height: '120px', marginBottom: '30px', borderRadius: '12px' }}>
                           <Grid container direction="column" alignItems="flex-start">
                            <Grid item>
                             <item.icon style={{ color: '#c0844a' }} fontSize="large" />
                              </Grid>
                            <Grid item>
                            <Typography variant="body1" color={'#c0844a'} gutterBottom>{item.label1}</Typography>
                               </Grid>
                               <Grid item>
                            <Typography variant="body1" color={'#c0844a'} gutterBottom>{item.label2}</Typography>
                               </Grid>
                    </Grid>
                </IconButton>
            </motion.div>
        </Grid>
    ))}
</Grid>
            )}
        </Grid>
    </Grid>    
    );
}

export default Home;
