import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptIcon from '@mui/icons-material/Receipt'; // Substituí o ícone para representar vendas
import PeopleIcon from '@mui/icons-material/People';
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import Divider from "@mui/material/Divider";

function Sidebar() {

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  return (
    <Drawer
    variant="permanent"
    sx={{
      width: '100%',
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: '220px',
      },
    }}
    open={open}
  >
    <Toolbar>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{ mr: 2, ...(open && { display: 'none' }) }}
      >
        <MenuIcon />
      </IconButton>
    </Toolbar>
    <Divider />
    <List>
      <ListItem button component={Link} to="/Home" onClick={handleDrawerClose}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to="/ProductPage" onClick={handleDrawerClose}>
        <ListItemIcon>
          <StorefrontIcon />
        </ListItemIcon>
        <ListItemText primary="Produtos" />
      </ListItem>
      <ListItem button component={Link} to="/CaixaPage" onClick={handleDrawerClose}>
        <ListItemIcon>
          <ReceiptIcon />
        </ListItemIcon>
        <ListItemText primary="Caixa" />
      </ListItem>
      <ListItem button component={Link} to="/Vendas" onClick={handleDrawerClose}>
        <ListItemIcon>
          <ReceiptIcon />
        </ListItemIcon>
        <ListItemText primary="Vendas" />
      </ListItem>
      <ListItem button component={Link} to="/Clientes" onClick={handleDrawerClose}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Clientes" />
      </ListItem>
    </List>
    <Divider />
  </Drawer>
  );
}

export default Sidebar;
