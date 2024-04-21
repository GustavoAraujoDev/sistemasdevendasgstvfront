import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

function Header() {
  const imageUrl = 'https://th.bing.com/th/id/OIP.20bkTgCDmaM6MwxUec1ojgHaE8?rs=1&pid=ImgDetMain'; // Substitua com sua URL de imagem

  return (
    <AppBar position="static" elevation={0} style={{ backgroundColor: '#fff', color: '#333' }}>
      <Toolbar>
        <Avatar alt="Logo" src={imageUrl} sx={{ marginRight: '10px', width: 50, height: 50, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          BaBy USA
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
