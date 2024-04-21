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
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { Grid } from '@mui/material';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [dataToInsert, setDataToInsert] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
  });
  
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  useEffect(() => {
    fetch("http://localhost:6060/Clientes")
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  console.log(clients)

 const handleDelete = (e) => {
    console.log(e.target.name);
    // Pergunta se temos certeza de que desejamos excluir as informaçõe.
    /* eslint-disable no-restricted-globals */
    if (confirm("Tem certeza que deseja excluir estas informações?")) {
      // Se confirmar a pergunta anterior, envia as informações para o backend.
      console.log("Informação excluída");
      fetch("http://localhost:6060/Clientes", {
        method: "DELETE",
        body: JSON.stringify({
          id: e.target.name,
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
  

  const handleAddClient = (e) => {
    fetch("http://localhost:6060/Clientes", {
      method: "POST",
      body: JSON.stringify(dataToInsert),
      headers: { "Content-Type": "application/json" },
    })
    .then(() => {
      toast.success('Cliente cadastrado com sucesso');
      setClients([...clients, dataToInsert]);
      clearForm(); // Limpar campos após o envio
      handleCloseAddDialog();
    })
    .catch((error) => console.error("Error:", error));
    
    e.preventDefault(); // Evitar recarregar a página
  };

  const clearForm = () => {
    setDataToInsert({
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
    });
  };

  const handleChange = (e) => {
    setDataToInsert({
      ...dataToInsert,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        <div style={{ marginTop: '20px' }}>
          <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Lista de Clientes</h1>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
            Adicionar Cliente
          </Button>
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table aria-label="clientes">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.nome}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.cpf}</TableCell>
                    <TableCell>{client.telefone}</TableCell>
                    <TableCell>
                      <IconButton aria-label="editar" component={Link} to={`/clients/edit/${client.id}`} style={{ marginRight: '5px' }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="excluir" onClick={() => handleDelete(client.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            <DialogContent>
              <TextField
                name="nome"
                label="Nome"
                value={dataToInsert.nome}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="email"
                label="Email"
                value={dataToInsert.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="cpf"
                label="CPF"
                value={dataToInsert.cpf}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="telefone"
                label="Telefone"
                value={dataToInsert.telefone}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddDialog} color="secondary">
                Cancelar
              </Button>
              <Button onClick={handleAddClient} color="primary">
                Adicionar
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Grid>
    </Grid>
  );
}

export default ClientsPage;
