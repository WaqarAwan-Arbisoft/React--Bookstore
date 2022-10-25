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
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ErrorAlert from '../components/error-alert';
import Loader from '../components/loader';
import { useDispatch } from 'react-redux';
import { authAction } from '../store/auth-slice';
import Cookies from 'universal-cookie';
import { GoogleLogin } from 'react-google-login';
import { tempActions } from "../store/temp-reducers";


const theme = createTheme();

export default function Login() {
    const cookies = new Cookies();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({ status: false, message: '' });
    const [isLoaded, setIsLoaded] = useState(true);
    const dispatch = useDispatch();

    //* Helper functions for this page
    const emailChangeHandler = (e) => {
        setEmail(e.target.value);
    }
    const passwordChangeHandler = (e) => {
        setPassword(e.target.value);
    }

    // @param:
    //* mail: Email address of the user
    function validateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return true;
        }
        return false;
    }
    const fetchUserData = async (accessToken, refreshToken) => {
        const fetchUserResponse = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/fetch-user/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
        })
        if (fetchUserResponse.ok) {
            let userData = await fetchUserResponse.json();
            cookies.remove('app_auth_token')
            cookies.remove('app_refresh_token')
            cookies.set('app_auth_token', accessToken, { path: "/" })
            cookies.set('app_refresh_token', refreshToken, { path: "/" })
            dispatch(authAction.login({
                token: accessToken,
                id: userData.id,
                email: userData.email,
                username: userData.name,
                image: userData.image,
            }))
            setIsLoaded(true)
        }
        else {
            dispatch(tempActions.addErrorToast({ message: "An Error occurred." }))
            setIsLoaded(true)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoaded(false);
        if (!validateEmail(email)) {
            setError({ status: true, message: "Please enter a correct email." })
            setIsLoaded(true);
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/auth/token`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": email,
                "password": password,
                "grant_type": "password",
                "client_id": process.env.REACT_APP_DRF_CLIENT_ID,
                "client_secret": process.env.REACT_APP_DRF_CLIENT_SECRET,
            })
        })
        if (response.ok) {
            let authToken = await response.json();
            let accessToken = authToken.access_token
            let refreshToken = authToken.refresh_token
            fetchUserData(accessToken, refreshToken)
        }
        else {
            let respData = await response.json()
            setError({ status: true, message: respData.error_description })
            setIsLoaded(true);
        }
    };
    const responseGoogle = async (googleResponse) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/auth/convert-token`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "token": googleResponse.accessToken,
                "backend": "google-oauth2",
                "grant_type": "convert_token",
                "client_id": process.env.REACT_APP_DRF_CLIENT_ID,
                "client_secret": process.env.REACT_APP_DRF_CLIENT_SECRET,
            })
        })
        if (response.ok) {
            let googleAuthTokens = await response.json();
            let accessToken = googleAuthTokens.access_token
            let refreshToken = googleAuthTokens.refresh_token
            fetchUserData(accessToken, refreshToken)
            // const fetchUserResponse = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/fetch-user/`, {
            //     method: "GET",
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': 'Bearer ' + accessToken,
            //     },
            // })
            // if (fetchUserResponse.ok) {
            //     let userData = await fetchUserResponse.json();
            //     cookies.set('app_auth_token', accessToken, { path: "/" })
            //     cookies.set('app_refresh_token', refreshToken, { path: "/" })
            //     dispatch(authAction.login({
            //         token: accessToken,
            //         id: userData.id,
            //         email: userData.email,
            //         username: userData.name,
            //         image: userData.image,
            //     }))
            // }
            // else {
            //     dispatch(tempActions.addErrorToast({ message: "Error Google login." }))
            // }
        }
        else {
            dispatch(tempActions.addErrorToast({ message: "Error Google login." }))
        }
    }
    //* Helper functions for this page

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
                                    <GoogleLogin
                                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                        buttonText="Login with Google"
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle}
                                        className='w-100 mb-3'
                                        cookiePolicy={'single_host_origin'}
                                    />
                                    <Grid container>
                                        <Grid item xs>
                                            <Link to="/forgot-password" variant="body2" className='text-primary'>
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