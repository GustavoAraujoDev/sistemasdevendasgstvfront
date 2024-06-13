import React, { useState } from 'react';
import { Grid, Typography, Button, TextField, Avatar } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../Auth/firebase';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const imageUrl = 'https://th.bing.com/th/id/R.5bbe9716682bf2d26bebe24f0e949744?rik=OOjRbE5jics8RA&riu=http%3a%2f%2fjuniordesignufpr.com.br%2fwp-content%2fuploads%2f2016%2f01%2fcarmelis.png&ehk=7%2bJu6ynJ4gfjCalKyNjw3t50YMElLaNwz1AFjFrm1UI%3d&risl=&pid=ImgRaw&r=0'; // Substitua com sua URL de imagem

    const handleLogin = async () => {
        try {
            await auth.signInWithEmailAndPassword(username, password);
            toast.success("Login bem-sucedido!");
            onLoginSuccess();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', backgroundColor: '#c7c7c6' }}>
                <Grid item xs={10} style={{ width: '80%', height: '80%' }}>
                    <Grid container justifyContent="center" alignItems="center" style={{ backgroundColor: 'white', minHeight: '80vh', borderRadius: '16px 0 0 16px' }}>
                        <Grid item xs={5} style={{minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#c0844a', backgroundColor: '#0a2e18', borderRadius: '16px', minHeight: '80vh' }}>
                            <Typography fontFamily="serif" fontSize="24px">Carmelis</Typography>
                            <Typography fontFamily="serif">Seja Bem Vindo de Volta</Typography>
                            <Avatar alt="Logo" src={imageUrl} sx={{ bgcolor: '#c0844a', width: '150px', height: '150px', marginBottom: '20px', borderRadius: '16px 0 0 15px' }} />
                        </Grid>
                        <Grid item xs={7} style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#c0844a', alignItems: 'center' }}>
                            <Typography fontFamily="serif" fontSize="24px">Bem Vindo</Typography>
                            <Typography fontFamily="serif">Carmelis</Typography>
                            <TextField label="UserName" value={username} onChange={(e) => setUsername(e.target.value)} style={{ marginTop: '20px' }} />
                            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginTop: '20px' }} />
                            <Button variant="contained" onClick={handleLogin} style={{ backgroundColor: '#c0844a', borderColor: '#c0844a', borderWidth: '4px', borderRadius: '16px', marginTop: '20px' }} fontFamily="serif">Entrar</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <ToastContainer />
        </>
    );
}

export default Login;
