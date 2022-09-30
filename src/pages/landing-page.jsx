import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/loader";
import MostLikedBookCard from "../components/most-liked-book-card";
import PrimaryBtn1 from "../UI/primary-btn";
const BOOKS_TO_SHOW = 3;
const LandingPage = () => {
    const [mostLikedBooks, setMostLikedBooks] = useState([]);
    const [isBooksLoaded, setIsBooksLoaded] = useState(false)
    const fetchTopBooks = async () => {
        let response;
        try {

            response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/books/fetch-top-books/${BOOKS_TO_SHOW}/`);
        }
        catch (err) {
            console.log(err)
        }
        if (response.ok) {
            let respData = await response.json()
            setMostLikedBooks([...respData]);
            setIsBooksLoaded(true)
        }
        else {
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
                        <h1>Find the book that you need at an affordable prices @<br />
                            THE BOOK SPOT
                        </h1>
                        <Link to='/books'><PrimaryBtn1 className='w-25'>Find Now</PrimaryBtn1></Link>
                    </div>
                    <div className="col-md-5"></div>
                </div>
            </div>

            <div className="my-5">
                <h1 className="text-center">OUR MOST LIKED BOOKS</h1>
                {!isBooksLoaded && <div>
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