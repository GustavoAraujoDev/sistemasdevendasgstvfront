import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, List, ListItem, Box, Divider, Paper, ListItemText, Select, MenuItem, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Caixa = () => {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState({});
  const [filtroNome, setFiltroNome] = useState('');
  const [Quantidade, setQuantidade] = useState(0)

  useEffect(() => {
    fetch("http://localhost:6060/Produtos")
      .then((res) => res.json())
      .then((data) => {
        setProdutos(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const finalizarCompra = () => {
      const items = carrinho.map(item => ({
        product_id: item.produto.ProductID,
        nome: item.produto.Nome,
        descricao: item.produto.Descricao,
        preco: item.produto.Preco,
        quantidade: item.quantidade
      }));

      const totalPrice = calcularTotal();
      
    console.log(items);
    console.log(totalPrice);
    toast.isActive('Compra finalizada com Sucesso')
    fetch("http://localhost:6060/Vendas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: items,
        totalPrice: totalPrice
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Venda finalizada com sucesso:", data);
      atualizarQuantidadeProdutos();
      // Limpar carrinho após finalizar a venda
      setCarrinho([]);
      // Habilitar todos os produtos novamente
      setProdutosSelecionados({});
    })
    .catch(error => {
      console.error("Erro ao finalizar a venda:", error);
    });
  };

  const atualizarQuantidadeProdutos = () => {
    carrinho.forEach((item) => {
      const produtoId = item.produto.ProductID;
      const quantidadeVendida = item.quantidade;
      const novaQuantidade = item.produto.Quantidade - quantidadeVendida;

      if(novaQuantidade === 0){
        fetch("http://localhost:6060/Produtos", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ProductID: produtoId
          })
        })
      } else {
      fetch("http://localhost:6060/Produtos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Nome: item.produto.Nome,
        Descricao: item.produto.Descricao,
        Preco: item.produto.Preco,
        Quantidade: novaQuantidade,
        ProductID: produtoId
      })
    })
   }
 });
}

  const adicionarAoCarrinho = (produto, quantidade) => {
    const itemExistente = carrinho.find((item) => item.produto.ProductID === produto.ProductID);
    if (itemExistente) {
      const novoCarrinho = carrinho.map((item) =>
        item.produto.ProductID === produto.ProductID ? { ...item, quantidade: item.quantidade + quantidade } : item
      );
      setCarrinho(novoCarrinho);
      toast.success('item atualizado com sucesso')
    } else {
      setCarrinho([...carrinho, { produto, quantidade }]);
      toast.dark('item adicionado com sucesso')
    }
    // Atualizar produtos selecionados
    const novoProdutosSelecionados = { ...produtosSelecionados };
    if (quantidade >= produto.Quantidade) {
      novoProdutosSelecionados[produto.ProductID] = true;
    } else {
      delete novoProdutosSelecionados[produto.ProductID];
    }
    setProdutosSelecionados(novoProdutosSelecionados);
  };

  const removerDoCarrinho = (produtoId) => {
    const novoCarrinho = carrinho.filter((item) => item.produto.ProductID !== produtoId);
    setCarrinho(novoCarrinho);
    // Habilitar produto novamente
    const novoProdutosSelecionados = { ...produtosSelecionados };
    delete novoProdutosSelecionados[produtoId];
    setProdutosSelecionados(novoProdutosSelecionados);
    toast.info('excluido com sucesso')
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (parseFloat(item.produto.Preco) * item.quantidade), 0);
  };

  const filtrarProdutos = () => {
    return produtos.filter(produto =>
      produto.Nome.toLowerCase().includes(filtroNome.toLowerCase())
    );
  };

  return (
    <Container>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5">Lista de Produtos</Typography>
          <TextField
            label="Filtrar por nome"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            fullWidth
            margin="normal"
          />
          <List>
            {filtrarProdutos().map((produto) => (
              <ListItem key={produto.ProductID}>
                <ListItemText primary={produto.Nome} secondary={`R$ ${produto.Preco}`} />
                <Select
                  label="Quantidade"
                  value={Quantidade}
                  onChange={(event) => setQuantidade(event.target.value)}
                  disabled={produtosSelecionados[produto.ProductID]}
                >
                  {[...Array(parseInt(produto.Quantidade)).keys()].map((q) => (
                    <MenuItem key={q + 1} value={q + 1}>{q + 1}</MenuItem>
                  ))}
                </Select>
                <IconButton onClick={() => adicionarAoCarrinho(produto, Quantidade)} edge="end" aria-label="Adicionar">
                  <AddIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5">Carrinho</Typography>
          <List>
            {carrinho.map((item) => (
              <div key={item.produto.ProductID}>
                <ListItem>
                  <ListItemText primary={item.produto.Nome} secondary={`Quantidade: ${item.quantidade}`} />
                  <ListItemText primary={`Total: R$ ${parseFloat(item.produto.Preco) * item.quantidade}`} />
                  <IconButton onClick={() => removerDoCarrinho(item.produto.ProductID)} edge="end" aria-label="remover">
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
          <Box mt={2}>
            <Typography variant="subtitle1">Valor Total do Carrinho: R$ {calcularTotal().toFixed(2)}</Typography>
            <div>
              <Button variant="contained" color="success" onClick={finalizarCompra} startIcon={<ShoppingCartIcon />}>Finalizar Compra</Button>
              <Button variant="contained" color="info" onClick={() => setCarrinho([])}>Limpar Carrinho</Button>
            </div>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Container>
  );
};

export default Caixa;
