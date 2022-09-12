import { Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Loader from "../components/loader";

const BookDetails = () => {
    let id = useParams().id
    console.log(id)
    const [book, setBook] = useState(null)
    const [isBookLoaded, setIsBookLoaded] = useState(false)
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
    return (
        <div className="container mx-auto">
            {isBookLoaded ?
                book == null ? (
                    <h1 className="text-center my-3">No book found</h1>
                ) : (
                    <>
                        < div className="row my-3">
                            <div className="col-md-6 d-flex align-items-center justify-content-center">
                                <img src={book.image ? book.image : 'https://via.placeholder.com/300x350'} alt="BOOK_IMAGE" />
                            </div>
                            <div className="col-md-6">
                                <div className="my-2">Name: <h3 className="d-inline">{book.name}</h3></div>
                                <div className="my-2">Price: <h3 className="d-inline">${book.price}</h3></div>
                                <div className="my-2">Pages: <h3 className="d-inline">{book.noOfPages}</h3></div>
                                <div className="my-2">Written by: <h3 className="d-inline">{book.author}</h3></div>
                            </div>
                        </div>
                        <div>
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