import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActions, Snackbar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import PrimaryBtn1 from '../UI/primary-btn';
import MuiAlert from '@mui/material/Alert';
import { useSelector } from 'react-redux';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BookSaleCard = (props) => {
    const [quantity, setQuantity] = useState(1)
    const [showToast, setShowToast] = useState(false)
    const authState = useSelector(state => state.auth)

    const addToCartHandler = async (bookId) => {
        if (authState.isAuthenticated) {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/add-to-cart/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + authState.token,
                },
                body: JSON.stringify({
                    "book": bookId,
                    "quantity": 1
                })
            })
            if (response.ok) {
                openToast();
            }
            else {
                console.log(await response.json())
            }
        }
        else {
            if (sessionStorage.getItem('cartItems')) {
                let items = sessionStorage.getItem('cartItems');
                items = items + "%" + JSON.stringify({ bookId: bookId, quantity: quantity })
                sessionStorage.setItem('cartItems', items)
                openToast();
            }
            else {
                sessionStorage.setItem('cartItems', JSON.stringify({ bookId: bookId, quantity: quantity }))
                openToast();
            }
        }
    }
    const openToast = () => {
        setShowToast(true);
    };

    const handleToastClose = () => {
        setShowToast(false)
    }
    return (
        <>
            <Card sx={{ width: 345 }} className="m-3 shadow-self">
                <Link to={'books/' + props.data.id + '/' + props.data.name}>
                    <CardMedia
                        component="img"
                        height="400"
                        image={props.data.image === null ? 'https://via.placeholder.com/300x350' : props.data.image}
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {props.data.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <b>Price: </b>${props.data.price}
                        </Typography>
                    </CardContent>
                </Link>
                <CardActions>

                    <PrimaryBtn1 size="small" color="primary" onClick={(e) => { addToCartHandler(props.data.id) }}>
                        Add to Cart
                    </PrimaryBtn1>

                </CardActions>
            </Card>
            <Snackbar open={showToast} autoHideDuration={800} onClose={handleToastClose}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    Item successfully added to the cart.
                </Alert>
            </Snackbar>
        </>

    )
}

export default BookSaleCard;