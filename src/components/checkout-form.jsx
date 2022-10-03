import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import PrimaryBtn1 from '../UI/primary-btn';
import { useState } from 'react';
import ErrorAlert from './error-alert';
import Loader from './loader';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { tempActions } from '../store/temp-reducers';
import AppToast from '../UI/app-toast';

const CheckoutForm = (props) => {
    const authStates = useSelector(states => states.auth)
    const [isLoaded, setIsLoaded] = useState(true)
    const [paymentError, setPaymentError] = useState({ status: false, message: '' })
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [isStockAvailable, setIsStockAvailable] = useState({ status: true, message: '' })
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch()
    const checkoutSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoaded(false)
        let stResp;
        let response;
        props.checkStockAvailability().then(async (stockResponse) => {
            stResp = stockResponse;
            return stResp.json()
        }).then(async (data) => {
            if (!data.detail) {
                const card = elements.getElement(CardElement);
                const { paymentMethod, error } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: card
                });
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
                        dispatch(tempActions.addSuccessToast({ message: "You have successfully placed the order." }))
                        navigate('/orders');
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
                            props.updateAfterPurchase();
                        }
                    }
                    else {
                        setPaymentError({ status: true, message: "An error occurred while making the payment." });
                        setIsLoaded(true);
                    }
                }
                else {
                    setError(error.message);
                    setIsLoaded(true);
                }
            }
            else {
                setIsStockAvailable({ status: false, message: data.detail })
                setIsLoaded(true)
            }
        }).catch(err => {
            console.log(err)
            setIsLoaded(true);
        })
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
    const handleToastClose = () => {
        setIsStockAvailable({ ...isStockAvailable, status: true })
    }
    return (
        <>
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
            {!isStockAvailable.status && <AppToast open={!isStockAvailable.status} onClose={handleToastClose} autoHideDuration={4000} message={isStockAvailable.message} severity={'error'} />}
        </>
    );
}

export default CheckoutForm;