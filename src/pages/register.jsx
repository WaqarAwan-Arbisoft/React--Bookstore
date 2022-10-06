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
import Loader from '../components/loader';
import ErrorAlert from '../components/error-alert';
import Countdown from 'react-countdown';
import { GoogleLogin } from 'react-google-login';

const theme = createTheme();

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('');
    const [age, setAge] = useState('');
    const [image, setImage] = useState('');
    const [error, setError] = useState({ status: false, message: '' })
    const [formStep, setFormStep] = useState(1);
    const [isLoaded, setIsLoaded] = useState(true);
    const [otp, setOtp] = useState('');
    const [countdown, setCountdown] = useState(Date.now() + 180000);

    //* Helper functions for this page
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
    const imageChangeHandler = (e) => {
        setImage(e.target.files[0])
    }
    function validateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return true;
        }
        return false;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoaded(false)
        if (name === '') {
            setError({ status: true, message: "Please enter a correct name." })
            setIsLoaded(true);
            return;
        }
        else if (!validateEmail(email)) {
            setError({ status: true, message: "Please enter a correct email." })
            setIsLoaded(true);
            return;
        }
        else if (password.length <= 5) {
            setError({ status: true, message: "Password should be at least 5 characters long." })
            setIsLoaded(true);
            return;
        }
        setError({ ...error, status: false })
        const formData = new FormData()
        formData.append('email', email);
        formData.append('password', password);
        formData.append('name', name);
        formData.append('image', image);
        formData.append('country', country);
        formData.append('age', age);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/confirm-email/`, {
            method: "POST",
            body: formData
        })
        let respData;
        if (response.ok) {
            respData = await response.json();
            setFormStep(2);
            setCountdown(Date.now() + 180000)
            setIsLoaded(true);
        }
        else {
            respData = await response.json()
            if (typeof respData === 'object') {
                let messageObject = respData[Object.keys(respData)[0]]
                setError({ status: true, message: Array.isArray(respData[Object.keys(respData)[0]]) ? messageObject[0] : messageObject })
                setFormStep(1);
                setIsLoaded(true);
            }
        }
    };
    const otpChangeHandler = (e) => {
        setOtp(e.target.value)
    }
    const registerSubmitHandler = async () => {
        if (otp === '') {
            setError({ status: true, message: "Invalid OTP entered." })
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/register/`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "user_code": otp
            })
        })
        let respData;
        if (response.ok) {
            respData = await response.json();
            setError({ ...error, status: false })
            setFormStep(3);
            setIsLoaded(true);
        }
        else {
            respData = await response.json()

            if (respData.length === 0)
                console.log(respData)
            setError({ status: true, message: respData.detail })
            setFormStep(2);
            setIsLoaded(true);
        }
    }
    const responseGoogle = (response) => {
        console.log(response);
    }

    const tryAgainHandler = () => {
        setError({ ...error, status: false })
        setFormStep(1);
        setIsLoaded(true);
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
                            {!isLoaded && (
                                <Loader width={150} height={150} />
                            )}
                            {isLoaded && formStep === 1 && (
                                <>
                                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                        <LockOutlinedIcon />
                                    </Avatar>
                                    <Typography component="h1" variant="h5">
                                        Sign up
                                    </Typography>
                                    {error.status ? (
                                        <ErrorAlert message={error.message} />
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
                                                    value={name}
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
                                                    value={email}
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
                                                    value={password}
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
                                                    value={country}
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
                                                    onChange={imageChangeHandler}
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
                                        <GoogleLogin
                                            clientId="533792682925-0qr8e909spqng34b65nm49gujeu5un0h.apps.googleusercontent.com"
                                            buttonText="Login with Google"
                                            onSuccess={responseGoogle}
                                            onFailure={responseGoogle}
                                            className='w-100 mb-3'
                                            cookiePolicy={'single_host_origin'}
                                        />
                                        <Grid container justifyContent="flex-end">
                                            <Grid item>
                                                <Link to="/login" variant="body2" className='text-primary'>
                                                    Already have an account? Sign in
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </>
                            )}
                            {isLoaded && formStep === 2 && (
                                <div>
                                    <Typography variant="h5">
                                        An email has been sent to you with OTP for verification. Please write down the OTP here:
                                    </Typography>
                                    {error.status ? (
                                        <ErrorAlert message={error.message} />
                                    ) : ''}
                                    <Grid item xs={12} className='my-4'>
                                        <TextField
                                            type='number'
                                            autoComplete="otp"
                                            name="user_code"
                                            fullWidth
                                            id="user_code"
                                            label="OTP"
                                            onChange={otpChangeHandler}
                                            value={otp}
                                        />
                                        <small className='text-muted'>*The code will expire after <b className='text-danger'><Countdown date={countdown} /></b>.</small>
                                    </Grid>
                                    <Button
                                        type="button"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={registerSubmitHandler}
                                    >
                                        Register
                                    </Button>
                                    <Button
                                        type="button"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 1, mb: 2 }}
                                        onClick={tryAgainHandler}
                                    >
                                        Go Back
                                    </Button>
                                </div>
                            )}
                            {isLoaded && formStep === 3 && (
                                <div>
                                    <div className='text-center mb-4'>
                                        <img src="/Images/check.png" alt="SUCCESS_SIGN" width={100} />
                                    </div>
                                    <Typography variant="h5">
                                        You are successfully registered.
                                    </Typography>
                                    <Button
                                        type="button"
                                        fullWidth
                                        variant="contained"
                                        color='success'
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={registerSubmitHandler}
                                    >
                                        <Link to="/login">
                                            Login Now
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </Box>
                    </Container>
                </Grid>
            </Grid>
        </ThemeProvider >
    );
}