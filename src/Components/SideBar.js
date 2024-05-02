import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import Divider from "@mui/material/Divider";
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';

function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Verifica se é uma tela móvel (menor que 'sm')
  const [open, setOpen] = useState(!isMobile); // Define o estado inicial do Drawer com base na tela

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      {isMobile && (
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"} // Define o tipo de Drawer com base na tela
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          width: '220px',
          flexShrink: 0,
          ...(isMobile && { '& .MuiDrawer-paper': { width: '220px', backgroundColor: '#c7c7c6', color: '#0a2e18'} }), // Ajusta a largura do Drawer para dispositivos móveis
          ...(isMobile ? {} : { '& .MuiDrawer-paper': { width: '220px', marginTop: '87px', backgroundColor: '#c7c7c6', color: '#0a2e18'} }), // Ajusta a margem esquerda para dispositivos maiores
        }}

      >
        <Divider />
        <List>
          <ListItem button component={Link} to="/home" onClick={handleDrawerToggle}>
            <ListItemIcon>
              <HomeIcon style={{ color: '#c0844a' }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/ProductPage" onClick={handleDrawerToggle}>
            <ListItemIcon>
              <StorefrontIcon style={{ color: '#c0844a' }} />
            </ListItemIcon>
            <ListItemText primary="Produtos" />
          </ListItem>
          <ListItem button component={Link} to="/CaixaPage" onClick={handleDrawerToggle}>
            <ListItemIcon>
              <ReceiptIcon style={{ color: '#c0844a' }} />
            </ListItemIcon>
            <ListItemText primary="Caixa" />
          </ListItem>
          <ListItem button component={Link} to="/Vendas" onClick={handleDrawerToggle}>
            <ListItemIcon>
              <ReceiptIcon style={{ color: '#c0844a' }} />
            </ListItemIcon>
            <ListItemText primary="Vendas" />
          </ListItem>
          <ListItem button component={Link} to="/Clientes" onClick={handleDrawerToggle}>
            <ListItemIcon>
              <PeopleIcon style={{ color: '#c0844a' }} />
            </ListItemIcon>
            <ListItemText primary="Clientes" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
    </>
  );
}

export default Sidebar;
