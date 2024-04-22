import React, { useState, useEffect} from 'react';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Grid, Typography } from '@mui/material';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [dataToInsert, setDataToInsert] = useState({
    Nome: "",
    Descricao: "",
    Preco: "",
    Quantidade: "",
  });

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true); 
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  useEffect(() => {
    fetch("http://localhost:6060/Produtos")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  console.log(products)

  const handleDelete = (id) => {
    console.log(id);
    // Pergunta se temos certeza de que desejamos excluir as informaçõe.
    /* eslint-disable no-restricted-globals */
    if (confirm("Tem certeza que deseja excluir estas informações?")) {
      // Se confirmar a pergunta anterior, envia as informações para o backend.
      console.log("Informação excluída");
      fetch("http://localhost:6060/Produtos", {
        method: "DELETE",
        body: JSON.stringify({
          ProductID: id
        }),
        headers: { "Content-Type": "application/json" },
      });
      // Atualiza a página para atualizar os dados do bd.
      window.location.reload();
      /* eslint-disable no-restricted-globals */
    } else {
      console.log("Pedido de exclusão cancelado.");
    }
  };

  const handleAddProduct = (e) => {
    fetch("http://localhost:6060/Produtos", {
      method: "POST",
      body: JSON.stringify(dataToInsert),
      headers: { "Content-Type": "application/json" },
    })
    .then(() => {
      toast.success('Produto cadastrado com sucesso');
      setProducts([...products, dataToInsert]);
      clearForm(); // Limpar campos após o envio
      handleCloseAddDialog();
    })
    .catch((error) => console.error("Error:", error));
    
    e.preventDefault(); // Evitar recarregar a página
  };

  const clearForm = () => {
    setDataToInsert({
        Nome: "",
        Descricao: "",
        Preco: "",
        Quantidade: "",
    });
  };

  const handleChange = (e) => {
    setDataToInsert({
      ...dataToInsert,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid container justifyContent="center" style={{ marginTop: '0px' }}>
    <Grid item xs={12} md={10} lg={8}>
      <div style={{ marginTop: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>Lista de Produtos</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
          Adicionar Produto
        </Button>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.ProductID}>
                  <TableCell>{product.Nome}</TableCell>
                  <TableCell>{product.Descricao}</TableCell>
                  <TableCell>R$ {product.Preco}</TableCell>
                  <TableCell>{product.Quantidade}</TableCell>
                  <TableCell>
                    <IconButton aria-label="editar" component={Link} to={`/products/edit/${product.ProductID}`} style={{ marginRight: '5px' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="excluir" onClick={() => handleDelete(product.ProductID)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
          <DialogContent>
            <TextField
              name="Nome"
              label="Nome"
              value={dataToInsert.Nome}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="Descricao"
              label="Descrição"
              value={dataToInsert.Descricao}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="Preco"
              label="Preço"
              value={dataToInsert.Preco}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="Quantidade"
              label="Quantidade"
              value={dataToInsert.Quantidade}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleAddProduct} color="primary">
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Grid>
  </Grid>
  );
}

export default ProductsPage;
