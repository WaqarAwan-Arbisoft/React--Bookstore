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
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import Loader from '../components/loader';
import { useDispatch } from 'react-redux';
import ErrorAlert from '../components/error-alert';
import Countdown from 'react-countdown';
import { useEffect } from 'react';

const theme = createTheme();

const NewPassword = () => {
    const user_token = useParams().token;
    const navigate = useNavigate()
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('')
    const [isLoaded, setIsLoaded] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [error, setError] = useState({ status: false, message: "" });


    //* Helper functions for this page
    const isTokenValid = async () => {
        let response;
        try {
            response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/recovery/${user_token}/`)
        }
        catch (err) {
            return false;
        }
        if (response.ok) {
            let respData = await response.json();
            setEmail(respData.email);
            setIsLoaded(true);
        }
        else {
            navigate('/pageNotFound');
        }
    }
    const passwordChangeHandler = (e) => {
        setPassword(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 5) {
            setError({ status: true, message: "Password should be 5 characters long." })
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/update-password/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: password,
                email: email
            })
        })
        if (response.ok) {
            setError({ ...error, status: false });
            setIsUpdated(true)
        }
        else {
            let respData = await response.json()
            setError({ status: true, message: respData.error.detail })
        }
    }
    //* Helper functions for this page

    useEffect(() => {
        isTokenValid()
    }, [])
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
                    {isLoaded ? (
                        <>
                            {isUpdated ? (
                                <div className='text-center'>
                                    <img src="/Images/check.png" alt="EMAIL_SENT_SUCCESSFULLY" width={125} />
                                    <div className='mt-3 fw-bold'>
                                        Your password has been updated. Please <Link className='text-primary' to='/login'>Login</Link> with the new password.
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                        <LockOutlinedIcon />
                                    </Avatar>
                                    <Typography component="h1" variant="h5">
                                        New Password
                                    </Typography>
                                    {error.status ? (
                                        <ErrorAlert message={error.message} />
                                    ) : ''}

                                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>


                                        <TextField
                                            type='password'
                                            required
                                            fullWidth
                                            id="password"
                                            label="Password"
                                            name="password"
                                            onChange={passwordChangeHandler}
                                            value={password}
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
                        </>
                    ) : <div className='text-center '>
                        <Loader width={150} height={150} />
                    </div>}
                </Box>
            </Grid>
        </Grid >
    );
}

export default NewPassword;