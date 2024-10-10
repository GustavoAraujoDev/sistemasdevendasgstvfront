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
    productid: "",
    nome: "",
    descricao: "",
    preco: "",
    precovenda: "",
    quantidade: "",
  });
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  const handleOpenAddDialog = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => setOpenAddDialog(false);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/Produtos");
        if (!response.ok) throw new Error("Erro ao buscar produtos");
        const data = await response.json();
       // Converte o objeto de produtos em um array
      const productsArray = Object.keys(data).map(key => ({
        productid: key,
        ...data[key]
      }));

      setProducts(productsArray);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        toast.error('Erro ao buscar dados.');
      }
    };
    fetchProducts();
  }, []);

  console.log(products);


  const handleDelete = (id) => {
    setProductIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirmed = async () => {
    setOpenDeleteDialog(false);

    try {
      const response = await fetch( `http://localhost:3000/Produtos/${productIdToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error('Erro ao excluir o produto');

      toast.success('Produto excluído com sucesso');
      setProducts(products.filter(product => product.productid !== productIdToDelete));
    } catch (error) {
      console.error("Error:", error);
      toast.error('Erro ao excluir o produto');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Validação de campos obrigatórios
    if (!dataToInsert.nome || !dataToInsert.preco) {
      toast.error('Por favor, preencha os campos obrigatórios.');
      return;
    }

    // Validação de formato
    if (isNaN(dataToInsert.preco) || (dataToInsert.precovenda && isNaN(dataToInsert.precovenda)) || (dataToInsert.quantidade && isNaN(dataToInsert.quantidade))) {
      toast.error('Por favor, insira valores numéricos válidos.');
      return;
    }

    // Validação de valores
    if (parseFloat(dataToInsert.preco) <= 0 || (dataToInsert.quantidade && parseInt(dataToInsert.quantidade) <= 0) || (dataToInsert.precovenda && parseFloat(dataToInsert.precovenda) <= 0)) {
      toast.error('Por favor, insira valores positivos.');
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/Produtos", {
        method: "POST",
        body: JSON.stringify(dataToInsert),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Produto cadastrado com sucesso');
        setProducts([...products, data]);
        clearForm();
        handleCloseAddDialog();
      } else {
        const errorData = await response.json();
        toast.error(`Erro ao cadastrar produto: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error('Erro ao cadastrar produto.');
    }
  };

  const clearForm = () => {
    setDataToInsert({
      productid: "",
      nome: "",
      descricao: "",
      preco: "",
      precovenda: "",
      quantidade: "",
    });
  };

  const handleChange = (e) => {
    setDataToInsert({
      ...dataToInsert,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid container justifyContent="center" style={{ minHeight: '100vh', marginTop: '0px', backgroundColor: '#c7c7c6', color: '#c0844a' }}>
      <Grid item xs={12} md={10} lg={8}>
        <div style={{ marginTop: '20px', padding: '10px' }}>
          <Typography variant="h4" align="center" gutterBottom>Lista de Produtos</Typography>
          <Button variant="contained" sx={{ backgroundColor: '#0a2e18', color: '#c0844a', marginRight: '8px' }} startIcon={<AddIcon style={{ color: '#c0844a' }} />} onClick={handleOpenAddDialog}>
            Adicionar Produto
          </Button>
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Preço de Venda</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(products) && products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.productid}>
                        <TableCell>{product.productid}</TableCell>
                        <TableCell>{product.nome}</TableCell>
                        <TableCell>{product.descricao}</TableCell>
                        <TableCell>R$ {parseFloat(product.preco).toFixed(2)}</TableCell>
                        <TableCell>R$ {parseFloat(product.precovenda).toFixed(2)}</TableCell>
                        <TableCell>{product.quantidade}</TableCell>
                        <TableCell>
                          <IconButton aria-label="editar" component={Link} to={`/products/edit/${product.productid}`} style={{ marginRight: '5px' }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton aria-label="excluir" onClick={() => handleDelete(product.productid)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Nenhum produto encontrado</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
            <DialogTitle>Adicionar Novo Produto</DialogTitle>
            <DialogContent>
              <TextField
                name="productid"
                label="Productid"
                value={dataToInsert.productid}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="nome"
                label="Nome"
                value={dataToInsert.nome}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="descricao"
                label="Descrição"
                value={dataToInsert.descricao}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="preco"
                label="Preço"
                value={dataToInsert.preco}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="precovenda"
                label="Preço de Venda"
                value={dataToInsert.precovenda}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="quantidade"
                label="Quantidade"
                value={dataToInsert.quantidade}
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