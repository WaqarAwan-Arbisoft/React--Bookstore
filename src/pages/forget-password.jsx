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
import { useState } from 'react';
import ErrorAlert from '../components/error-alert';


const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState({ status: false, message: "" });

    //* Helper functions for this page
    const emailChangeHandler = (e) => {
        setEmail(e.target.value);
    }
    function validateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return true;
        }
        return false;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError({ status: true, message: "Invalid email entered." })
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/recover-password-link/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        })
        if (response.ok) {
            setError({ ...error, status: false });
            setIsSent(true)
        }
        else {
            let respData = await response.json()
            setError({ status: true, message: respData.error.detail })
        }
    }
    //* Helper functions for this page

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
                    {isSent && (
                        <div className='text-center'>
                            <img src="/Images/check.png" alt="EMAIL_SENT_SUCCESSFULLY" width={125} />
                            <div className='mt-3 fw-bold'>
                                Email has been sent to your email address. Please update password with the link provided in the mail.
                            </div>
                        </div>
                    )}
                    {!isSent && (
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
        </Grid >

    )
}

export default ForgetPassword;