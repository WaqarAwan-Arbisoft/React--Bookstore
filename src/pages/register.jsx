import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const theme = createTheme();

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('');
    const [age, setAge] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState({ status: false, message: '' })

    const nameChangeHandler = (e) => {
        setName(e.target.value);
    }
    const emailChangeHandler = (e) => {
        setEmail(e.target.value);
    }

    const passwordChangeHandler = (e) => {
        setPassword(e.target.value);
    }

    const countryChangeHandler = (e) => {
        setCountry(e.target.value);
    }

    const ageChangeHandler = (e) => {
        if (!(/^\d+$/.test(e.target.value[e.target.value.length - 1]))) {
            return;
        }
        setAge(e.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(/Images/books.jpg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign up
                            </Typography>
                            {error.status ? (
                                <Alert className='mt-3' variant="filled" severity="error">
                                    {error.message}
                                </Alert>
                            ) : ''}

                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoComplete="name"
                                            name="name"
                                            required
                                            fullWidth
                                            id="name"
                                            label="Full Name"
                                            autoFocus
                                            onChange={nameChangeHandler}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            type='email'
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            onChange={emailChangeHandler}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                            onChange={passwordChangeHandler}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoComplete="country"
                                            name="country"
                                            fullWidth
                                            id="country"
                                            label="Country"
                                            onChange={countryChangeHandler}
                                        />
                                        <small className='text-muted'>*Pakistan will be selected as country if you do not specify.</small>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            type='number'
                                            autoComplete="age"
                                            name="age"
                                            fullWidth
                                            id="age"
                                            label="Age"
                                            onChange={ageChangeHandler}
                                            value={age}
                                        />
                                        <small className='text-muted'>*Age will be considered 18 if you do not specify.</small>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            type='file'
                                            name="image"
                                            fullWidth
                                            id="image"
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign Up
                                </Button>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link to="/login" variant="body2" className='text-primary'>
                                            Already have an account? Sign in
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}