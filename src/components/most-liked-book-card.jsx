import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const MostLikedBookCard = (props) => {
    const { book } = props;
    return (
        <Card sx={{ width: 250 }} className="m-4 shadow-self">
            <Link to={'books/' + book.id + '/' + book.name}>
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
                </CardContent>
            </Link>
        </Card>
    )
}

export default MostLikedBookCard;