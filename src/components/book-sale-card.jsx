import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';

const BookSaleCard = () => {
    return (
        <Card sx={{ maxWidth: 345 }} className="m-3">
            <Link to={'books/1'}>
                <CardMedia
                    component="img"
                    height="350"
                    image="/Images/book-1.jpeg"
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <b>Price: </b>250
                    </Typography>
                </CardContent>
            </Link>
            <CardActions>
                <Button size="small" color="primary">
                    Show details
                </Button>
                <Button size="small" color="primary">
                    Add to Cart
                </Button>
                <span className='border border-2 border-primary rounded-3 pe-1 ps-1'>
                    <span role='button' className='px-2'>-</span>
                    <span>1</span>
                    <span role='button' className='px-2'>+</span>
                </span>
            </CardActions>
        </Card>
    )
}

export default BookSaleCard;