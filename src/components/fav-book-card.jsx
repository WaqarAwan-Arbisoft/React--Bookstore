import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import PrimaryBtn1 from '../UI/primary-btn';

const FavBookCard = (props) => {
    const { book } = props.book;
    console.log(props.remove)
    return (
        <Card sx={{ width: 250 }} className="m-4 shadow-self">

            <CardMedia
                component="img"
                height="200"
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
                <div className='text-center mt-3'>
                    <PrimaryBtn1 color='error' onClick={() => { props.remove(book.id) }}>Remove</PrimaryBtn1>
                </div>
            </CardContent>

        </Card>
    )
}

export default FavBookCard;