import { Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Loader from "../components/loader";
import PrimaryBtn1 from "../UI/primary-btn";

const BookDetails = () => {
    let id = useParams().id
    const [book, setBook] = useState(null)
    const [isBookLoaded, setIsBookLoaded] = useState(false)
    const [quantity, setQuantity] = useState(1)
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
    const increaseQuantityHandler = (e) => {
        setQuantity(quantity + 1);
    }
    const decreaseQuantityHandler = (e) => {
        if (quantity === 1) return;

        setQuantity(quantity - 1);
    }
    return (
        <div className="container mx-auto">
            {isBookLoaded ?
                book == null ? (
                    <h1 className="text-center my-3">No book found</h1>
                ) : (
                    <>
                        <h1 className="text-center my-3">{book.name}</h1>
                        < div className="row my-5">
                            <div className="col-md-6 d-flex align-items-center justify-content-center">
                                <img src={book.image ? book.image : 'https://via.placeholder.com/300x350'} alt="BOOK_IMAGE" />
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex flex-column justify-content-between h-100">
                                    <div>
                                        <div className="my-2">Price: <h3 className="d-inline">${book.price}</h3></div>
                                        <div className="my-2">Pages: <h3 className="d-inline">{book.noOfPages}</h3></div>
                                        <div className="my-2">Written by: <h3 className="d-inline">{book.author}</h3></div>
                                    </div>
                                    <div>
                                        <PrimaryBtn1>Add to Cart</PrimaryBtn1>
                                        <span className='btn mx-2 border-2 border-primary rounded-3 pe-1 ps-1'>
                                            <span role='button' className='px-3' onClick={decreaseQuantityHandler}>-</span>
                                            <span className='quantity'>{quantity}</span>
                                            <span role='button' className='px-3' onClick={increaseQuantityHandler}>+</span>
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="mt-5">
                            <Typography variant="body1" gutterBottom>
                                {book.description}
                            </Typography>
                        </div>
                    </>

                )
                : <Loader />
            }
        </div >
    );
}

export default BookDetails;