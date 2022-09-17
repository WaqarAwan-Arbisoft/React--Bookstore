import { useState } from "react";
import { useEffect } from "react";
import BookSaleCard from "../components/book-sale-card";

const Home = () => {
    const [booksList, setBooksList] = useState([])
    useEffect(() => {
        const fetchAllBooks = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/books/fetch-all/`)
            let respData;
            if (response.ok) {
                respData = await response.json();
                setBooksList(respData)
            }
        }
        try {
            fetchAllBooks()
        }
        catch (err) {
            console.log(err)
        }
    }, [])
    return (
        <div >
            <h2 className="text-center my-5">Find the books that you need...!!!</h2>
            <div className="container-fluid d-flex flex-wrap justify-content-center">
                {booksList.map((book, index) => (
                    <BookSaleCard data={book} key={index} />
                ))}
                {booksList.length === 0 && (
                    <h1>No Book added yet.</h1>
                )}

            </div>

        </div>

    )
}

export default Home;