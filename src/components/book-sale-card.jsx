import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';

const BookSaleCard = (props) => {
    return (
        <Card sx={{ maxWidth: 345 }} className="m-3">
            <Link to={'books/' + props.data.id + '/' + props.data.name}>
                <CardMedia
                    component="img"
                    height="350"
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