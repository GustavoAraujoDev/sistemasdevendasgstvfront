import React, { useState, useEffect } from 'react';
import { Grid, Typography, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { BarChart, People, ShoppingCart, Money } from '@mui/icons-material';

function Home() {
    const [loading, setLoading] = useState(true);
    const [vendasCount, setVendasCount] = useState(0);
    const [produtosCount, setProdutosCount] = useState(0);
    const [vendasTotal, setVendasTotal] = useState(0);
    const [produtosTotal, setProdutosTotal] = useState(0);
    const [clientesTotal, setClientesTotal] = useState(0);
    const [LucroTotal, setLucroTotal] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [clientesResponse, vendasResponse, produtosResponse] = await Promise.all([
                fetch("https://carmelisapi.onrender.com/Clientes"),
                fetch("https://carmelisapi.onrender.com/Vendas"),
                fetch("https://carmelisapi.onrender.com/Produtos")
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
            
            const idsvendas = vendasData.map(venda => venda.id);
            const promessasItensVendas = idsvendas.map(id => fetch(`https://carmelisapi.onrender.com/Vendas/itens/${id}`));
            const respostasItensVendas = await Promise.all(promessasItensVendas);
            const itensVendas = await Promise.all(respostasItensVendas.map(resposta => resposta.json()));
            const LucroTotal = itensVendas.reduce((total, itensVenda) => {
                const lucroItensVenda = itensVenda.reduce((totalItem, produto) => {
                    return totalItem + (produto.quantidade * (produto.precovenda - produto.preco));
                }, 0);
                return total + lucroItensVenda;
            }, 0);
            setLucroTotal(LucroTotal);
        
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <Grid container justifyContent={'center'} style={{ minHeight: '100vh', position: 'relative', backgroundColor: '#c7c7c6'}}>
            <Grid item xs={12} md={8}>
                <Typography variant="h4" color="#c0844a" gutterBottom style={{ textAlign: 'center', marginTop: '40px' }}>Gerencie seus Produtos com Maestria</Typography>
                <Typography variant="body1" style={{ color: '#666', marginBottom: '30px', textAlign: 'center', maxWidth: '80%', margin: '0 auto' }}>Explore todas as possibilidades do nosso aplicativo de gestão de produtos. Aqui, você tem tudo o que precisa para manter seu negócio organizado e próspero.</Typography>
                {loading ? (
                    <Grid container justifyContent="center">
                        <CircularProgress color="primary" />
                    </Grid>
                ) : (
                    <Grid container spacing={3} alignItems="center" justifyContent="center" style={{ padding: '20px' }}>
                        {[{ icon: Money, label1: `R$ ${LucroTotal.toFixed(2)}`, label2: 'Lucro' }, { icon: People, label1: clientesTotal, label2: 'Clientes' }, { icon: ShoppingCart, label1: produtosCount, label2: 'Produtos' }, { icon: BarChart, label1: vendasCount, label2: 'Vendas' }, { icon: ShoppingCart, label1: `R$ ${produtosTotal.toFixed(2)}`, label2: 'Valor dos Produtos'}, { icon: BarChart, label1: `R$ ${vendasTotal.toFixed(2)}`, label2: 'Total de Vendas' }].map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Tooltip title={item.label2} placement="top">
                                        <IconButton style={{boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', backgroundColor: '#fff', width: '100%', height: '100%', padding: '20px', borderRadius: '8px', border: '2px solid #c0844a' }}>
                                            <Grid container direction="column" alignItems="center">
                                                <Grid item style={{ marginTop: '10px' }}>
                                                    <item.icon style={{ color: '#c0844a', fontSize: '2.5rem' }} />
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="h6" color="textPrimary">{item.label1}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="body2" color="textPrimary">{item.label2}</Typography>
                                                </Grid>
                                            </Grid>
                                        </IconButton>
                                    </Tooltip>
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
