import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
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

  useEffect(() => {
    fetchSales();
  }, [startDate, endDate]);

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const fetchSales = async () => {
    try {
      let url = "https://sistemasdevendasgstvback.onrender.com/Vendas";
      if (startDate && endDate) {
        url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      }
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
    console.log(id);
    sales.forEach((item) => {
      /* eslint-disable no-restricted-globals */
      if (confirm("Tem certeza que deseja marcar essa venda como concluída?")) {
        fetch("https://sistemasdevendasgstvback.onrender.com/Vendas", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            vendaId: item.id,
            situacao: 'Concluída'
          })
        }).then(() => {
          window.location.reload();
        });
      } else {
        toast.clearWaitingQueue('Pedido de atualização cancelado');
      }
      /* eslint-disable no-restricted-globals */
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
        id: saleIdToDelete,
      }),
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      toast.info('Venda excluída com sucesso!');
      setSales(sales.filter(sale => sale.id !== saleIdToDelete))
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
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <div style={{ margin: '20px auto', maxWidth: 1200 }}>
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
          <Button variant="contained" onClick={fetchSales}>Filtrar</Button>
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
                  <TableCell>{sale.data_venda}</TableCell>
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
      {/* Diálogo de exclusão */}
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
    </div>
  );
}

export default SalesPage;
