import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/loader";
import MostLikedBookCard from "../components/most-liked-book-card";
import PrimaryBtn1 from "../UI/primary-btn";
import { TOP_BOOKS_LIMIT } from "../constant/paginations";
import { useDispatch } from "react-redux";
import { tempActions } from "../store/temp-reducers";

const LandingPage = () => {
    const [mostLikedBooks, setMostLikedBooks] = useState([]);
    const [isBooksLoaded, setIsBooksLoaded] = useState(false)
    const dispatch = useDispatch()
    const fetchTopBooks = async () => {
        let response;
        response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/books/fetch-top-books/${TOP_BOOKS_LIMIT}/`);
        if (response.ok) {
            let respData = await response.json()
            setMostLikedBooks([...respData]);
            setIsBooksLoaded(true)
        }
        else {
            dispatch(tempActions.addErrorToast({ message: "An error occurred." }))
            setMostLikedBooks([]);
            setIsBooksLoaded(true)
        }
    }
    useEffect(() => {
        fetchTopBooks();
    }, [])
    return (
        <>
            <div className="hero-image">
                <div className="container mx-auto row align-items-center h-60vh">
                    <div className="col-md-7">
                        <h1>Find the books that you need at affordable prices @<br />
                            THE BOOK SPOT
                        </h1>
                        <Link to='/books'><PrimaryBtn1 className='w-25'>Find Now</PrimaryBtn1></Link>
                    </div>
                    <div className="col-md-5"></div>
                </div>
            </div>

            <div className="my-5">
                <h1 className="text-center">OUR MOST LIKED BOOKS</h1>
                {!isBooksLoaded && <div className="text-center">
                    <Loader width='100' height='100' />
                </div>}
                {isBooksLoaded && mostLikedBooks.length > 0 && <div className="d-flex justify-content-center">
                    {mostLikedBooks.map((book) => (
                        <MostLikedBookCard key={book.id} book={book} />
                    ))}
                </div>}
                {isBooksLoaded && mostLikedBooks.length === 0 && <h2 className="text-center my-4 text-muted">
                    This data will be available soon.
                </h2>}
            </div>
        </>
    )
}

export default LandingPage;