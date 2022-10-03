import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActions, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import PrimaryBtn1 from '../UI/primary-btn';


const BookSaleCard = (props) => {
    const { book } = props;
    return (
        <>
            <Card sx={{ width: 345 }} className="m-3 shadow-self">
                <Link to={book.id + '/' + book.name}>
                    <CardMedia
                        component="img"
                        height="400"
                        image={book.image === null ? 'https://via.placeholder.com/300x350' : book.image}
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {book.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <b>Price: </b>${book.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className='mt-1'>
                            {book.stock > 0 && book.stock < 10 && <small className='text-muted text-danger d-block'>Only {book.stock} left in stock.</small>}
                        </Typography>
                    </CardContent>
                </Link>
                <CardActions>
                    {book.stock === 0 ? <Chip label="OUT OF STOCK" color="error" /> : <PrimaryBtn1 size="small" color="primary" onClick={(e) => { props.addToCart(book.id) }}>
                        Add to Cart
                    </PrimaryBtn1>}
                </CardActions>
            </Card>
        </>
    )
}

export default BookSaleCard;