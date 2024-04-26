import React, { useState, useEffect } from 'react';
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dataToInsert, setDataToInsert] = useState({
    Nome: "",
    Descricao: "",
    Preco: "",
    Quantidade: "",
    PrecoVenda: "",
  });
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    fetch("https://sistemasdevendasgstvback.onrender.com/Produtos")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleDelete = (id) => {
    setProductIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirmed = () => {
    setOpenDeleteDialog(false);

    fetch("https://sistemasdevendasgstvback.onrender.com/Produtos", {
      method: "DELETE",
      body: JSON.stringify({
        ProductID: productIdToDelete
      }),
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      toast.success('Produto excluído com sucesso');
      setProducts(products.filter(product => product.ProductID !== productIdToDelete));
    }).catch((error) => {
      console.error("Error:", error);
    });
  };

  const handleAddProduct = (e) => {
    fetch("https://sistemasdevendasgstvback.onrender.com/Produtos", {
      method: "POST",
      body: JSON.stringify(dataToInsert),
      headers: { "Content-Type": "application/json" },
    })
    .then(() => {
      toast.success('Produto cadastrado com sucesso');
      setProducts([...products, dataToInsert]);
      clearForm();
      handleCloseAddDialog();
    })
    .catch((error) => console.error("Error:", error));
    
    e.preventDefault();
  };

  const clearForm = () => {
    setDataToInsert({
      Nome: "",
      Descricao: "",
      Preco: "",
      Quantidade: "",
      PrecoVenda: "",
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
                  <TableCell>PreçoVenda</TableCell>
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
                    <TableCell>R$ {product.PrecoVenda}</TableCell>
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
                name="PrecoVenda"
                label="Preço de Venda"
                value={dataToInsert.PrecoVenda}
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

          <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogContent>
              Tem certeza que deseja excluir este produto?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog} color="secondary">
                Cancelar
              </Button>
              <Button onClick={handleDeleteConfirmed} color="primary">
                Excluir
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Grid>
    </Grid>
  );
}

export default ProductsPage;
