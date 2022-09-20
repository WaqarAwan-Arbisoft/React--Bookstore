import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import ErrorAlert from '../components/error-alert';
import Loader from '../components/loader';
import { useDispatch, useSelector } from 'react-redux';
import { authAction } from '../store/auth-slice';
import Cookies from 'universal-cookie';


const theme = createTheme();

export default function Login() {
    const cookie = new Cookies();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({ status: false, message: '' });
    const [isLoaded, setIsLoaded] = useState(true);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

    const emailChangeHandler = (e) => {
        setEmail(e.target.value);
    }
    const passwordChangeHandler = (e) => {
        setPassword(e.target.value);
    }
    function validateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return true;
        }
        return false;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoaded(false);

        if (!validateEmail(email)) {
            setError({ status: true, message: "Please enter a correct email." })
            setIsLoaded(true);
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/login/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        })
        let respData;
        if (response.ok) {
            respData = await response.json();
            let token = respData.token;
            const userDataResponse = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/fetch-user/`, {
                method: "GET",
                headers: {
                    'Authorization': `Token ${token}`,
                }
            })
            if (userDataResponse.ok) {
                let userData = await userDataResponse.json();
                cookie.set('token', token)

                dispatch(authAction.login({
                    token: token,
                    id: userData.id,
                    email: userData.email,
                    username: userData.name,
                    image: userData.image,
                    admin: userData.is_staff
                }))
            }
        }
        else {
            respData = await response.json()
            setError({ status: true, message: respData.detail })
            setIsLoaded(true);
        }
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
                {isAuthenticated && <Navigate to="/" />}
                {isLoaded ? (
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
                                    Sign in
                                </Typography>
                                {error.status ? (
                                    <ErrorAlert message={error.message} />
                                ) : ''}

                                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        onChange={emailChangeHandler}
                                        value={email}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        onChange={passwordChangeHandler}
                                        value={password}
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Sign In
                                    </Button>
                                    <Grid container>
                                        <Grid item xs>
                                            <Link to="/forget-password" variant="body2" className='text-primary'>
                                                Forgot password?
                                            </Link>
                                        </Grid>
                                        <Grid item>
                                            <Link to="/register" variant="body2" className='text-primary'>
                                                {"Don't have an account? Sign Up"}
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Container>
                    </Grid>
                ) :
                    <div
                        className='text-center mx-auto d-flex align-items-center'
                    >
                        <Loader width={150} height={150} />
                    </div>
                }
            </Grid>
        </ThemeProvider>
    );
}