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
import { Button, Grid, Typography } from '@mui/material';


function SalesPage() {
  const [sales, setSales] = useState([]);
  const [ItensSales, setItensSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetch("http://localhost:6060/Vendas")
      .then((res) => res.json())
      .then((data) => {
        setSales(data);
      })
      .catch((err) => {
        console.error(err);
      });
      fetchSales();
  }, [startDate, endDate]);

  const fetchSales = async () => {
    try {
      let url = "http://localhost:6060/Vendas";
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
  

  const handleDelete = (id) => {
    console.log(id);
    // Pergunta se temos certeza de que desejamos excluir as informaçõe.
    /* eslint-disable no-restricted-globals */
    if (confirm("Tem certeza que deseja excluir estas informações?")) {
      // Se confirmar a pergunta anterior, envia as informações para o backend.
      console.log("Informação excluída");
      fetch("http://localhost:6060/Vendas", {
        method: "DELETE",
        body: JSON.stringify({
          id: id,
        }),
        headers: { "Content-Type": "application/json" },
      });
      toast.info('Venda Excluida Com Sucesso!')
      // Atualiza a página para atualizar os dados do bd.
      window.location.reload();
      /* eslint-disable no-restricted-globals */
    } else {
      console.log("Pedido de exclusão cancelado.");
    }
  };

  const fetchSaleItems = async (id) => {
    try {
      const response = await fetch(`http://localhost:6060/Vendas/${id}`);
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
        console.log(saleItems)
        setItensSales(saleItems); // Adiciona os itens à venda selecionada
        setSelectedSale(sale);
      } catch (error) {
        // Tratar erro
        console.error("Erro ao buscar itens da venda:", error);
        toast.error("Erro ao buscar itens da venda.");
      }
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  console.log(startDate);

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
 console.log(endDate);

  return (
    <div style={{ marginLeft: 20, marginRight: 20 }}>
    <h1>Lista de Vendas</h1>
    <Grid container spacing={2} alignItems="center">
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
                  <IconButton aria-label="excluir" name={sale.id} onClick={() => handleDelete(sale.id)}>
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
                          <p>Preço Unitário: R$ {item.preco}</p>
                          <p>Quantidade: {item.quantidade}</p>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  );
}

export default SalesPage;
