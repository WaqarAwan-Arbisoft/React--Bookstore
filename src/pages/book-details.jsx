import { Chip, Divider, Snackbar, Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import Loader from "../components/loader";
import PrimaryBtn1 from "../UI/primary-btn";
import MuiAlert from '@mui/material/Alert';
import React from "react";
import Review from "../components/review";
import NewReview from "../components/new-review";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const BookDetails = () => {
    let id = useParams().id
    const [book, setBook] = useState(null)
    const [isBookLoaded, setIsBookLoaded] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [showToast, setShowToast] = useState(false)
    const authState = useSelector(state => state.auth)
    const [isReviewsLoaded, setIsReviewsLoaded] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    useEffect(() => {
        const fetchBookByName = async () => {
            let response;
            try {
                response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/books/fetch-book/${id}`);
            }
            catch (err) {
                console.log("server is offline")
            }
            let respData;
            if (response.ok) {
                respData = await response.json();
                setBook(respData)
                setIsBookLoaded(true)
            }
        }
        try {
            fetchBookByName();
        }
        catch (err) {
            console.log(err)
        }
    }, [])
    const fetchReviews = async () => {
        let response;
        try {
            response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/fetch-reviews/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        catch (err) {
            console.log("server is offline")
        }
        let respData;
        if (response.ok) {
            respData = await response.json();
            setReviews([...respData]);
            setIsReviewsLoaded(true)
        }
        else {
            setReviews([]);
            setIsReviewsLoaded(true)
        }
    }
    const checkIsFavorite = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/is-favorite/${id}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authState.token,
            }
        })
        if (response.ok) {
            setIsFavorite(true)
        }
    }
    const checkIsLiked = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/is-liked/${id}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authState.token,
            }
        })
        if (response.ok) {
            setIsLiked(true)
        }
    }
    useEffect(() => {
        try {
            fetchReviews();
            if (authState.isAuthenticated) {
                checkIsFavorite();
                checkIsLiked();
            }
        }
        catch (err) {
            console.log(err)
        }
    }, [])
    const increaseQuantityHandler = (e) => {
        setQuantity(quantity + 1);
    }
    const decreaseQuantityHandler = (e) => {
        if (quantity === 1) return;

        setQuantity(quantity - 1);
    }

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
                    "quantity": quantity
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

    const addToFavoriteHandler = async (bookId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/add-to-favorite/${bookId}/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authState.token,
            }
        })
        if (response.ok) {
            setIsFavorite(true)
        }

    }
    const removeFromFavoriteHandler = async (bookId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/remove-favorite/${bookId}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authState.token,
            }
        })
        if (response.ok) {
            setIsFavorite(false)
        }
    }
    const likeBookHandler = async (bookId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/like-book/${bookId}/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authState.token,
            }
        })
        if (response.ok) {
            setIsLiked(true)
        }
    }
    const unlikeBookHandler = async (bookId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/remove-like/${bookId}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authState.token,
            }
        })
        if (response.ok) {
            setIsLiked(false)
        }
    }
    return (
        <div className="container mx-auto">
            {isBookLoaded ?
                book == null ? (
                    <h1 className="text-center my-3">No book found</h1>
                ) : (
                    <>
                        <h1 className="text-center my-5">{book.name}</h1>
                        < div className="row my-5">
                            <div className="col-md-6 d-flex align-items-center justify-content-center">
                                <img src={book.image ? book.image : 'https://via.placeholder.com/300x350'} alt="BOOK_IMAGE" width={300} />

                            </div>
                            <div className="col-md-6">

                                <div className="d-flex flex-column justify-content-between h-100">
                                    <div>
                                        <div className="my-2">Price: <h3 className="d-inline">${book.price}</h3></div>
                                        <div className="my-2">Pages: <h3 className="d-inline">{book.noOfPages}</h3></div>
                                        <div className="my-2">Written by: <h3 className="d-inline">{book.author}</h3></div>
                                        <div>
                                            {book.stock > 0 && book.stock < 10 && <small className='text-muted text-danger d-block'>Only {book.stock} left in stock.</small>}
                                        </div>
                                        {authState.isAuthenticated && (
                                            <>
                                                <div className="my-3">
                                                    {!isFavorite && <PrimaryBtn1 color="success" onClick={() => { addToFavoriteHandler(book.id) }}>Add To Favorite&nbsp;<CheckCircleOutlinedIcon /></PrimaryBtn1>}
                                                    {isFavorite && <PrimaryBtn1 color="error" onClick={() => { removeFromFavoriteHandler(book.id) }}>Remove from favorite&nbsp;<HighlightOffIcon /></PrimaryBtn1>}

                                                </div>
                                                <div className="my-3 d-flex">
                                                    {!isLiked && <PrimaryBtn1 color="success" onClick={() => { likeBookHandler(book.id) }}>Like&nbsp;<ThumbUpIcon fontSize="40" /></PrimaryBtn1>}
                                                    {isLiked && <PrimaryBtn1 color="error" onClick={() => { unlikeBookHandler(book.id) }}>Unlike&nbsp;<ThumbDownIcon fontSize="40" /></PrimaryBtn1>}

                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {book.stock !== 0 ? <div>
                                        <PrimaryBtn1 onClick={() => { addToCartHandler(book.id) }}>Add to Cart</PrimaryBtn1>
                                        <span className='btn mx-2 border-2 border-primary rounded-3 pe-1 ps-1'>
                                            <span role='button' className='px-3' onClick={decreaseQuantityHandler}>-</span>
                                            <span className='quantity'>{quantity}</span>
                                            <span role='button' className='px-3' onClick={increaseQuantityHandler}>+</span>
                                        </span>
                                    </div> : <Chip className="w-25" label="OUT OF STOCK" color="error" />}
                                </div>

                            </div>
                        </div>
                        <div className="mt-5">
                            <h3 className="text-center mb-3">Description</h3>
                            <Typography variant="body1" gutterBottom>
                                {book.description}
                            </Typography>
                        </div>
                    </>

                )
                : <Loader />
            }
            <Snackbar open={showToast} autoHideDuration={800} onClose={handleToastClose}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    Item successfully added to the cart.
                </Alert>
            </Snackbar>
            {!authState.isAuthenticated && <h2 className="text-center my-2">
                Please login first to give review.
            </h2>}
            {authState.isAuthenticated && !isReviewsLoaded ?
                <div className="my-4 text-center">
                    <Loader width={100} height={100} />
                </div> :
                <div className="my-4">
                    {authState.isAuthenticated && <NewReview loadReviews={fetchReviews} bookId={id} />}
                    <h3 className="text-center my-3">Reviews</h3>
                    {reviews.length === 0 && <h2 className="text-center">No reviews available.</h2>}
                    {reviews.length !== 0 && reviews.map((review, index) => (
                        <Review key={index} review={review} />
                    ))}
                </div>}
        </div >
    );
}

export default BookDetails;