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
import Loader from '../loader';
import { useDispatch } from 'react-redux';
import ErrorAlert from '../error-alert';
import Countdown from 'react-countdown';

const theme = createTheme();

export default function EnterEmail() {
    const dispatch = useDispatch();
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
    const [countDownTime, setCountDownTime] = useState(Date.now() + 180000)

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
            // dispatch(tempActions.setCredentials({ email: email, password: password }))
            setFormStep(2);
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
            method: "POST",
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
    const tryAgainHandler = () => {
        setError({ ...error, status: false })
        setFormStep(1);
        setIsLoaded(true);
    }
    return (

        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid item xs={12} sm={12} md={12} component={Paper} elevation={6} square>

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
                                Forgot Password
                            </Typography>
                            {error.status ? (
                                <ErrorAlert message={error.message} />
                            ) : ''}

                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>


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


                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Recover
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>

            </Grid>
        </Grid>

    );
}