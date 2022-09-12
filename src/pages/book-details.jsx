import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Loader from "../components/loader";

const BookDetails = () => {
    let bookName = useParams().slug
    const [book, setBook] = useState(null)
    const [isBookLoaded, setIsBookLoaded] = useState(false)
    useEffect(() => {
        const fetchBookByName = async () => {
            let response;
            try {
                response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/books/fetch-all/?search=${bookName}`);
            }
            catch (err) {
                console.log("server is offline")
            }
            let respData;
            if (response.ok) {
                respData = await response.json();
                setBook(respData[0])
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
                    < div className="row my-3">
                        <div className="col-md-6">
                            {book.name}
                        </div>
                        <div className="col-md-6">
                            {book.description}
                        </div>
                    </div>
                )
                : <Loader />
            }
        </div >
    );
}

export default BookDetails;