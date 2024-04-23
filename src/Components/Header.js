import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

function Header() {
  const imageUrl = 'https://www.agenciam9.com.br/propaganda/grandes/Logomarca-Moda-Roupa-Infantil-e-Beb%C3%AA.png'; // Substitua com sua URL de imagem

  return (
    <AppBar position="static" elevation={0} style={{ backgroundColor: '#942a68', color: '#fbf8f9' }}>
      <Toolbar>
        <Avatar alt="Logo" src={imageUrl} sx={{ marginRight: '10px', width: 50, height: 50, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Mania Kids
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
