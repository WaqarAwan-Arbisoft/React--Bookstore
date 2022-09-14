import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import PrimaryBtn1 from '../UI/primary-btn';


const BookSaleCard = (props) => {
    const [quantity, setQuantity] = useState(1)
    const increaseQuantityHandler = (e) => {
        setQuantity(quantity + 1);
    }
    const decreaseQuantityHandler = (e) => {
        if (quantity === 1) return;

        setQuantity(quantity - 1);
    }
    const addToCartHandler = (bookId) => {
        if (sessionStorage.getItem('cartItems')) {
            let items = sessionStorage.getItem('cartItems');
            items = items + "%" + JSON.stringify({ bookId: bookId, quantity: quantity })
            sessionStorage.setItem('cartItems', items)
        }
        else {
            sessionStorage.setItem('cartItems', JSON.stringify({ bookId: bookId, quantity: quantity }))
        }
    }
    return (
        <Card sx={{ width: 345 }} className="m-3 shadow-self">
            <Link to={'books/' + props.data.id + '/' + props.data.name}>
                <CardMedia
                    component="img"
                    height="450"
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
                <span className='btn mx-2 border-2 border-primary rounded-3 pe-1 ps-1'>
                    <span role='button' className='px-3' onClick={decreaseQuantityHandler}>-</span>
                    <span className='quantity'>{quantity}</span>
                    <span role='button' className='px-3' onClick={increaseQuantityHandler}>+</span>
                </span>
            </CardActions>
        </Card>
    )
}

export default BookSaleCard;