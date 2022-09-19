import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import PrimaryBtn1 from '../UI/primary-btn';
import { useState } from 'react';
import ErrorAlert from './error-alert';
import Loader from './loader';
import { useSelector } from 'react-redux';

const CheckoutForm = (props) => {
    const authStates = useSelector(states => states.auth)
    const [isLoaded, setIsLoaded] = useState(true)
    const [paymentError, setPaymentError] = useState({ status: false, message: '' })
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const stripe = useStripe();
    const elements = useElements();
    const checkoutSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoaded(false)
        const card = elements.getElement(CardElement);

        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: card
        });
        let response;
        console.log(paymentMethod)
        console.log(error)
        if (!error) {
            try {
                response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/save-stripe-info/`, {
                    method: "POST",
                    headers: {
                        'Content-type': "application/json",
                        'Authorization': `Token ${authStates.token}`
                    },
                    body: JSON.stringify({
                        email: email,
                        payment_method_id: paymentMethod.id,
                        amount: parseInt(props.amount * 100)
                    })
                });
            }
            catch (err) {
                setPaymentError({ status: true, message: "An error occurred while making the payment." });
                setIsLoaded(true);
            }
            if (response.ok) {
                let respData = await response.json()
                setError(null)
                setPaymentError({ ...paymentError, status: false })
                setIsLoaded(true);
                response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/get-update-delete-cart/`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Token ${authStates.token}`
                    }
                });
                if (response.ok) {
                    props.reloadItems()
                    props.reloadCartInfo()
                }
            }
            else {
                let respData = await response.json()
                console.log(respData)
                setPaymentError({ status: true, message: "An error occurred while making the payment." });
                setIsLoaded(true);
            }
        }
        else {
            setError(error.message);
            setIsLoaded(true);
        }
    }
    const handleCardChange = (event) => {
        if (event.error) {
            setError(event.error.message);
        } else {
            setError(null);
        }
    }
    const emailChangeHandler = (e) => {
        setEmail(e.target.value);
    }
    return (
        <form onSubmit={checkoutSubmitHandler} className='mt-3'>

            <Typography variant="h5" gutterBottom textAlign={'center'}>
                <img src="/Images/Logo/stripe.png" alt="STRIPE_PAYMENTS" width={150} />
            </Typography>
            {isLoaded && paymentError.status &&
                <div className='my-3'>
                    <ErrorAlert message={paymentError.message} />
                </div>}
            <Grid spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        type='email'
                        required
                        id="email"
                        label="Email Address"
                        fullWidth
                        autoComplete="cc-name"
                        variant="standard"
                        value={email}
                        onChange={emailChangeHandler}
                    />
                </Grid>
            </Grid>
            <Grid spacing={3} marginTop={3} marginBottom={3}>
                <Grid item xs={12} md={6}>
                    <CardElement id="card-element" onChange={handleCardChange} />
                    <div className="error" role="alert">{error}</div>
                </Grid>
            </Grid>
            {isLoaded ?
                <Grid item xs={12} textAlign={'center'} marginTop={3}>
                    <PrimaryBtn1 color='success' type="submit">Make Payment</PrimaryBtn1>
                </Grid>
                : (
                    <div className='text-center'>
                        <Loader width={50} height={50} />
                    </div>
                )}
        </form>
    );
}

export default CheckoutForm;