import React, { useState, useEffect } from 'react';
import {RadioGroup, Radio, FormControlLabel, Container, Grid, Typography, List, ListItem, Box, Divider, Paper, ListItemText, Select, MenuItem, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Caixa = () => {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [cliente, setcliente] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState({});
  const [filtroNome, setFiltroNome] = useState('');
  const [Quantidade, setQuantidade] = useState(0)
  const [dataToInsert, setDataToInsert] = useState({
    situacao: "",
    pagamento: ""
  });
  const [selectedClient, setSelectedClient] = useState('');

  const clearForm = () => {
    setDataToInsert({
      situacao: "",
      pagamento: ""
    });
  };

  useEffect(() => {
    fetch("https://carmelisapi.onrender.com/Produtos")
      .then((res) => res.json())
      .then((data) => {
        setProdutos(data);
      })
      .catch((err) => {
        console.error(err);
      });

    fetch("https://carmelisapi.onrender.com/Clientes")
      .then((res) => res.json())
      .then((data) => {
        setcliente(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const finalizarCompra = () => {
      const items = carrinho.map(item => ({
        productid: item.produto.productid,
        nome: item.produto.Nome,
        descricao: item.produto.Descricao,
        preco: item.produto.Preco,
        precovenda: item.produto.PrecoVenda,
        quantidade: item.quantidade
      }));

      const totalPrice = calcularTotal();
      if(carrinho.length === 0){
        toast.error('Selecione um produto antes de finalizar a compra');
        return;
      }
      if (!selectedClient) {
        toast.error('Selecione um cliente antes de finalizar a compra');
        return;
    }
    if (!dataToInsert.pagamento) {
        toast.error('Selecione uma forma de pagamento antes de finalizar a compra');
        return;
    }
    if (!dataToInsert.situacao) {
        toast.error('Selecione uma situação antes de finalizar a compra');
        return;
    }
      
    console.log(items);
    console.log(totalPrice);
    toast.isActive('Compra finalizada com Sucesso')
    fetch("https://carmelisapi.onrender.com/Vendas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: items,
        totalPrice: totalPrice,
        pagamento: dataToInsert.pagamento,
        situacao: dataToInsert.situacao,
        id: selectedClient
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Venda finalizada com sucesso:", data);
      atualizarQuantidadeProdutos();
      toast.isActive('Venda Realizada Com Sucesso!!')
      // Limpar carrinho após finalizar a venda
      setCarrinho([]);
      // Habilitar todos os produtos novamente
      setProdutosSelecionados({});
      clearForm();
      console.log(selectedClient);
    })
    .catch(error => {
      console.error("Erro ao finalizar a venda:", error);
    });
  };
  
  const atualizarQuantidadeProdutos = () => {
    carrinho.forEach((item) => {
      const produtoId = item.produto.productid;
      const quantidadeVendida = item.quantidade;
      const novaQuantidade = item.produto.Quantidade - quantidadeVendida;

      if(novaQuantidade === 0){
        fetch("https://carmelisapi.onrender.com/Produtos", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            productid: produtoId
          })
        })
      } else {
      fetch("https://carmelisapi.onrender.com/Produtos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Nome: item.produto.Nome,
        Descricao: item.produto.Descricao,
        Preco: item.produto.Preco,
        PrecoVenda: item.produto.PrecoVenda,
        Quantidade: novaQuantidade,
        productid: produtoId
      })
    })
   }
 });
}

const handleChange = (e) => {
  setDataToInsert({
    ...dataToInsert,
    [e.target.name]: e.target.value,
  });
};

  const adicionarAoCarrinho = (produto, quantidade) => {
    const itemExistente = carrinho.find((item) => item.produto.productid === produto.productid);
    if (itemExistente) {
      const novoCarrinho = carrinho.map((item) =>
        item.produto.productid === produto.productid ? { ...item, quantidade: item.quantidade + quantidade } : item
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
      novoProdutosSelecionados[produto.productid] = true;
    } else {
      delete novoProdutosSelecionados[produto.productid];
    }
    setProdutosSelecionados(novoProdutosSelecionados);
  };

  const removerDoCarrinho = (produtoId) => {
    const novoCarrinho = carrinho.filter((item) => item.produto.productid !== produtoId);
    setCarrinho(novoCarrinho);
    // Habilitar produto novamente
    const novoProdutosSelecionados = { ...produtosSelecionados };
    delete novoProdutosSelecionados[produtoId];
    setProdutosSelecionados(novoProdutosSelecionados);
    toast.info('excluido com sucesso')
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (parseFloat(item.produto.PrecoVenda) * item.quantidade), 0);
  };

  const filtrarProdutos = () => {
    return produtos.filter(produto =>
      produto.nome.toLowerCase().includes(filtroNome.toLowerCase())
    );
  };

  const handleClientChange = (event) => {
    setSelectedClient(event.target.value);
  };

  return (
    <Container style={{ marginLeft: '5px', backgroundColor: '#c7c7c6', minHeight:'100vh'}}>
    <Grid container spacing={2} justifyContent='center'>
      <Grid item xs={12} sm={6} >
        <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#0a2e18', marginTop: '10px' }}>
          <Typography variant="h5" color={'#c0844a'}>Lista de Produtos</Typography>
          <TextField
            label="Filtrar por nome"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            fullWidth
            margin="normal"
            style={{color:'#c0844a'}}
          />
          <List>
            {filtrarProdutos().map((produto) => (
              <ListItem key={produto.productid}>
                <ListItemText secondaryTypographyProps={{ style: { color: '#c0844a' } }} primaryTypographyProps={{ style: { color: '#c0844a' } }} primary={produto.nome} secondary={`R$ ${produto.precovenda}`} />
                <Select
                  label="Quantidade"
                  value={Quantidade}
                  onChange={(event) => setQuantidade(event.target.value)}
                  disabled={produtosSelecionados[produto.productid]}
                  style={{ color: '#c0844a' }}
                >
                  {[...Array(parseInt(produto.quantidade)).keys()].map((q) => (
                    <MenuItem style={{ color: '#c0844a' }} key={q + 1} value={q + 1}>{q + 1}</MenuItem>
                  ))}
                </Select>
                <IconButton onClick={() => adicionarAoCarrinho(produto, Quantidade)} edge="end" aria-label="Adicionar">
                  <AddIcon style={{color: '#c0844a'}} />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#0a2e18', marginTop: '10px' }}>
          <Typography variant="h5" style={{ color: '#c0844a' }} >Carrinho</Typography>
          <List>
            {carrinho.map((item) => (
              <div key={item.produto.productid}>
                <ListItem>
                  <ListItemText secondaryTypographyProps={{ style: { color: '#c0844a' } }} primaryTypographyProps={{ style: { color: '#c0844a' } }} primary={item.produto.nome} secondary={`Quantidade: ${item.quantidade}`} />
                  <ListItemText primaryTypographyProps={{ style: { color: '#c0844a' } }} primary={`Total: R$ ${parseFloat(item.produto.precovenda) * item.Quantidade}`} />
                  <IconButton onClick={() => removerDoCarrinho(item.produto.productid)} edge="end" aria-label="remover">
                    <DeleteIcon style={{ color: '#c0844a' }}/>
                  </IconButton>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
          <Box mt={2}>
            <Typography style={{ color: '#c0844a' }} variant="subtitle1">Valor Total R$ {calcularTotal().toFixed(2)}</Typography>
            <label style={{ color: '#c0844a' }}>
              Selecione o Cliente
              <Select value={selectedClient} onChange={handleClientChange} style={{ color: '#c0844a' }}>
              <MenuItem value="" style={{ color: '#c0844a' }}>Selecione um cliente...</MenuItem>
              {cliente.map(cliente => (
              <MenuItem style={{ color: '#c0844a' }} key={cliente.id} value={cliente.id}>{cliente.nome}</MenuItem>
                ))}
              </Select>
            </label>
            <RadioGroup 
            name="pagamento" 
            value={dataToInsert.pagamento} 
            onChange={handleChange}
            row
            style={{ color: '#c0844a' }}
            >
              <FormControlLabel value="PIX" control={<Radio />} label="PIX" />
              <FormControlLabel value="DINHEIRO" control={<Radio />} label="DINHEIRO" />
              <FormControlLabel value="CARTAO DE CREDITO" control={<Radio />} label="CARTÃO DE CREDITO" />
            </RadioGroup>
            <RadioGroup 
            name="situacao" 
            value={dataToInsert.situacao} 
            onChange={handleChange}
            row
            style={{ color: '#c0844a' }}
            >
              <FormControlLabel value="Pendente" control={<Radio />} label="Pendente" />
              <FormControlLabel value="Concluída" control={<Radio />} label="Concluída" />
            </RadioGroup>
            <div>
            <Button variant="contained" sx={{ backgroundColor: '#c0844a', color: '$c7c7c6', marginRight: '8px' }} onClick={finalizarCompra} startIcon={<ShoppingCartIcon />}>Finalizar Compra</Button>
            <Button variant="contained" sx={{ backgroundColor: '#616161', color: '#ffffff' }} onClick={() => setCarrinho([])}>Limpar Carrinho</Button>
            </div>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Container>
  );
};

export default Caixa;
