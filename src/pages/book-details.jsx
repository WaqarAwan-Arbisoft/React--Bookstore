import { Chip, Divider, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../components/loader";
import PrimaryBtn1 from "../UI/primary-btn";
import React from "react";
import Review from "../components/review";
import NewReview from "../components/new-review";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AppToast from "../UI/app-toast";
import { tempActions } from "../store/temp-reducers";

const BookDetails = () => {
    let id = useParams().id
    const [book, setBook] = useState(null)
    const [isBookLoaded, setIsBookLoaded] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [showToast, setShowToast] = useState(false)
    const [isReviewsLoaded, setIsReviewsLoaded] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);

    //* Helper functions for this page
    const openToast = () => {
        setShowToast(true);
    };
    const fetchBookById = async () => {
        let response;
        try {
            response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/books/fetch-book/${id}/`);
        }
        catch (err) {
            dispatch(tempActions.addErrorToast({ message: "Server offline." }))
        }
        let respData;
        if (response.ok) {
            respData = await response.json();
            setBook(respData)
            setIsBookLoaded(true)
        }
        else {
            setBook(null)
            setIsBookLoaded(true)
        }
    }
    const fetchReviews = async () => {
        let response;
        response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/fetch-reviews/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

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
                'Authorization': 'Bearer ' + authState.token,
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
                'Authorization': 'Bearer ' + authState.token,
            }
        })
        if (response.ok) {
            setIsLiked(true)
        }
    }
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
                    'Authorization': 'Bearer ' + authState.token,
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
                dispatch(tempActions.addErrorToast({ message: "Item not added to cart due to some technical issue." }))
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

    const handleToastClose = () => {
        setShowToast(false)
    }

    const addToFavoriteHandler = async (bookId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/add-to-favorite/${bookId}/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authState.token,
            }
        })
        if (response.ok) {
            setIsFavorite(true)
        }
        else {
            dispatch(tempActions.addErrorToast({ message: "An error occurred." }))
        }
    }
    const removeFromFavoriteHandler = async (bookId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/remove-favorite/${bookId}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authState.token,
            }
        })
        if (response.ok) {
            setIsFavorite(false)
        }
        else {
            dispatch(tempActions.addErrorToast({ message: "An error occurred." }))
        }
    }
    const likeBookHandler = async (bookId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/like-book/${bookId}/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authState.token,
            }
        })
        if (response.ok) {
            setIsLiked(true)
        }
        else {
            dispatch(tempActions.addErrorToast({ message: "An error occurred." }))
        }
    }
    const unlikeBookHandler = async (bookId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/remove-like/${bookId}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authState.token,
            }
        })
        if (response.ok) {
            setIsLiked(false)
        }
        else {
            dispatch(tempActions.addErrorToast({ message: "An error occurred." }))
        }
    }
    //* Helper functions for this page

    useEffect(() => {
        fetchBookById();
    }, [])

    useEffect(() => {
        try {
            fetchReviews();
            if (authState.isAuthenticated) {
                checkIsFavorite();
                checkIsLiked();
            }
        }
        catch (err) {
            dispatch(tempActions.addErrorToast({ message: "An error occurred." }))
            console.log(err)
        }
    }, [])
    return (
        <div className="container mx-auto">
            {isBookLoaded ?
                book == null ? (
                    <h1 className="text-center my-5">No book found</h1>
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
                        <div className="my-5 rounded-3 p-3 shadow">
                            <h3 className="text-center mb-3">Description</h3>
                            <Divider color="black" />
                            <Typography variant="body1" gutterBottom className="py-3">
                                {book.description}
                            </Typography>
                        </div>
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
                    </>
                )
                : <Loader />
            }
            <AppToast open={showToast} autoHideDuration={1000} onClose={handleToastClose} message="Item successfully added to the cart." />
        </div >
    );
}

export default BookDetails;