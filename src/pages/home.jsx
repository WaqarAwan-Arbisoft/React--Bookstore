import { AccountCircle } from "@mui/icons-material";
import { IconButton, InputAdornment, Pagination, TextField } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import BookSaleCard from "../components/book-sale-card";
import SearchIcon from '@mui/icons-material/Search';
import { HOME_SCREEN_BOOKS } from "../constant/paginations";

const Home = () => {
    const [count, setCount] = useState(0);
    const [booksList, setBooksList] = useState([])
    useEffect(() => {
        const fetchAllBooks = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/books/fetch-all/?limit=${HOME_SCREEN_BOOKS}`)
            let respData;
            if (response.ok) {
                respData = await response.json();
                if (respData.results.length > 0) {
                    setBooksList(respData.results)
                    setCount(Math.ceil(respData.count / HOME_SCREEN_BOOKS))
                }
                else {
                    setBooksList([])
                    setCount(0)
                }
            }
        }
        try {
            fetchAllBooks()
        }
        catch (err) {
            console.log(err)
        }
    }, [])
    const searchBookHandler = async (e) => {

        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/books/fetch-all/?search=${e.target.value}&limit=${HOME_SCREEN_BOOKS}`)
        let respData;
        if (response.ok) {
            respData = await response.json();
            if (respData.results.length > 0) {
                setBooksList(respData.results)
                setCount(Math.ceil(respData.count / HOME_SCREEN_BOOKS))
            }
            else {
                setBooksList([])
                setCount(0)
            }
        }
    }
    const paginationHandler = async (e) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/books/fetch-all/?limit=${HOME_SCREEN_BOOKS}&offset=${HOME_SCREEN_BOOKS * (parseInt(e.target.innerText) - 1)}`)
        let respData;
        if (response.ok) {
            respData = await response.json();
            setBooksList(respData.results)

        }
    }

    return (
        <div >
            <h2 className="text-center my-5">Find the books that you need...!!!</h2>
            <div className="container mb-5">
                <TextField
                    id="input-with-icon-textfield"
                    fullWidth
                    InputProps={{
                        placeholder: "Search book by name...",
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    variant="standard"
                    onChange={searchBookHandler}
                />
            </div>

            <div className="container-fluid d-flex flex-wrap justify-content-center">
                {booksList.length !== 0 && booksList.map((book, index) => (
                    <BookSaleCard data={book} key={index} />
                ))}
                {booksList.length === 0 && (
                    <h1>No Book added yet.</h1>
                )}

            </div>
            <div className="d-flex justify-content-center my-4">
                {count !== 0 && <Pagination hideNextButton={true} hidePrevButton={true} count={count} onClick={paginationHandler} />}
            </div>

        </div>

    )
}

export default Home;