import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

function SalesPage() {
  const [sales, setSales] = useState([]);
  const [ItensSales, setItensSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [saleIdToDelete, setSaleIdToDelete] = useState(null);
  const [openUptadeDialog, setOpenUptadeDialog] = useState(false);
  const [saleIdToUptade, setSaleIdToUptade] = useState(null);

  useEffect(() => {
    fetchSales();
  }, [startDate, endDate]);
  console.log(endDate)
  console.log(startDate)
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  
  const handleCloseUptadeDialog = () => {
    setOpenUptadeDialog(false);
  };

  const fetchSales = async () => {
    try {
      let url = "https://sistemasdevendasgstvback.onrender.com/Vendas";
      if (startDate && endDate) {
        url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      }
      console.log("URL da solicitação de busca de vendas:", url); // Log da URL da solicitação
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar vendas');
      }
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      toast.error("Erro ao buscar vendas.");
    }
  };

  const atualizarSituacao = (id) => {
    setSaleIdToUptade(id);
    setOpenUptadeDialog(true);
  };

  const handleUptadeConfirmed = () => {
    setOpenUptadeDialog(false);
    fetch("https://sistemasdevendasgstvback.onrender.com/Vendas", {
      method: "PUT",
      body: JSON.stringify({
        vendaId: saleIdToUptade,
        situacao: 'Concluída'
      }),
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      toast.success('Venda Atualizada com sucesso');
      fetchSales();
    }).catch((error) => {
      console.error("Error:", error);
    });
  };

  const handleDelete = (id) => {
    setSaleIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirmed = () => {
    setOpenDeleteDialog(false);
    
    fetch("https://sistemasdevendasgstvback.onrender.com/Vendas", {
      method: "DELETE",
      body: JSON.stringify({
        id: saleIdToDelete
      }),
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      toast.success('Venda excluída com sucesso');
      fetchSales();
    }).catch((error) => {
      console.error("Error:", error);
    });
  };
  

  const fetchSaleItems = async (id) => {
    try {
      const response = await fetch(`https://sistemasdevendasgstvback.onrender.com/Vendas/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao obter itens da venda:", error);
      throw error;
    }
  };

  const toggleSaleDetails = async (sale) => {
    if (selectedSale === sale) {
      setSelectedSale(null);
    } else {
      try {
        const saleItems = await fetchSaleItems(sale.id);
        setItensSales(saleItems);
        setSelectedSale(sale);
      } catch (error) {
        console.error("Erro ao buscar itens da venda:", error);
        toast.error("Erro ao buscar itens da venda.");
      }
    }
  };

  const handleStartDateChange = (date) => {
    const formattedDate = format(date, 'dd/MM/yyyy');
    setStartDate(formattedDate);
  };

  const handleEndDateChange = (date) => {
    const formattedDate = format(date, 'dd/MM/yyyy');
    setEndDate(formattedDate);
  };

  return (
    <Grid container justifyContent="center" style={{ minHeight: '100vh', marginTop: '0px', backgroundColor: '#c7c7c6', color: '#c0844a' }}>
      <Grid item xs={12} md={10} lg={8}>
      <h1 style={{ textAlign: 'center' }}>Lista de Vendas</h1>
      <Grid container spacing={2} justifyContent="center" sx={{ flexDirection: 'column', textAlign: 'center' }}>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body1">De:</Typography>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="dd/MM/yyyy"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body1">Até:</Typography>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="dd/MM/yyyy"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button variant="contained" style={{ color: '#c0844a', backgroundColor: '#0a2e18'}} onClick={fetchSales}>Filtrar</Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table aria-label="vendas">
          <TableHead>
            <TableRow>
              <TableCell>Venda</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <React.Fragment key={sale.id}>
                <TableRow>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{new Date(sale.data_venda).toLocaleDateString()}</TableCell>
                  <TableCell>R$ {sale.total_price}</TableCell>
                  <TableCell>
                    <IconButton aria-label="ver detalhes" onClick={() => toggleSaleDetails(sale)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton aria-label="editar">
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="excluir" onClick={() => handleDelete(sale.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {selectedSale === sale && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <h3>Detalhes da Venda:</h3>
                      <ul>
                        {ItensSales.map((item) => (
                          <li key={item.id}>
                            <p>Produto: {item.nome}</p>
                            <p>Descrição: {item.descricao}</p>
                            <p>Preço Unitário: R$ {item.precovenda}</p>
                            <p>Quantidade: {item.quantidade}</p>
                          </li>
                        ))}
                        <li>
                          <p>Pagamento: {sale.pagamento}</p>
                          <p>Situação: {sale.situacao}</p>
                          <p>Cliente: {sale.cliente_id}</p>
                          {sale.situacao === 'Pendente' && (
                            <IconButton onClick={() => atualizarSituacao(sale.id)}>
                              <DoneIcon />
                            </IconButton>
                          )}
                        </li>
                      </ul>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Excluir Venda</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir esta venda?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirmed} color="secondary" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUptadeDialog} onClose={handleCloseUptadeDialog}>
        <DialogTitle>Atualizar Venda</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja Atualizar esta venda?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleUptadeConfirmed} color="secondary" autoFocus>
            Atualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
    </Grid>
  );
}

export default SalesPage;
