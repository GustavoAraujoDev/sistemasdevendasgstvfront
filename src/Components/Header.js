import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

function Header() {
  const imageUrl = 'https://th.bing.com/th/id/R.5bbe9716682bf2d26bebe24f0e949744?rik=OOjRbE5jics8RA&riu=http%3a%2f%2fjuniordesignufpr.com.br%2fwp-content%2fuploads%2f2016%2f01%2fcarmelis.png&ehk=7%2bJu6ynJ4gfjCalKyNjw3t50YMElLaNwz1AFjFrm1UI%3d&risl=&pid=ImgRaw&r=0'; // Substitua com sua URL de imagem

  return (
    <AppBar position="static" elevation={1} style={{ backgroundColor: '#0a2e18', color: '#c0844a', height: '87px', justifyContent: 'center' }}>
      <Toolbar>
        <Avatar alt="Logo" src={imageUrl} sx={{ marginRight: '10px', width: 58, height: 58, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Cermelis
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
