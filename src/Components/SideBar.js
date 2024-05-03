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
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function Sidebar({onLogout}) {
  const imageUrl = 'https://th.bing.com/th/id/R.5bbe9716682bf2d26bebe24f0e949744?rik=OOjRbE5jics8RA&riu=http%3a%2f%2fjuniordesignufpr.com.br%2fwp-content%2fuploads%2f2016%2f01%2fcarmelis.png&ehk=7%2bJu6ynJ4gfjCalKyNjw3t50YMElLaNwz1AFjFrm1UI%3d&risl=&pid=ImgRaw&r=0'; // Substitua com sua URL de imagem
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Verifica se é uma tela móvel (menor que 'sm')
  const [open, setOpen] = useState(!isMobile); // Define o estado inicial do Drawer com base na tela

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      {isMobile && (
        <Toolbar style={{backgroundColor: '#c7c7c6'}}>
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
          ...(isMobile ? {} : { '& .MuiDrawer-paper': { width: '220px', backgroundColor: '#c7c7c6', color: '#0a2e18'} }), // Ajusta a margem esquerda para dispositivos maiores
        }}

      >
        <Divider />
        <List>
        <Avatar alt="Logo" src={imageUrl} sx={{ width: 58, height: 58, margin: 'auto', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }} />
        <Typography variant="h6" component="div" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#c0844a', alignItems: 'center', flexGrow: 1, fontWeight: 'bold' }}>
          Cermelis
        </Typography>
        <Divider />
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
          <ListItem button component={Link} to='/' onClick={onLogout}>
            <ListItemIcon>
              <ExitToAppIcon style={{ color: '#c0844a' }} />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
    </>
  );
}

export default Sidebar;
