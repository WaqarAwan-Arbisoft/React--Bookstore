import { Pagination } from "@mui/material";
import { useState, useEffect } from "react";
import BookSaleCard from "../components/book-sale-card";
import { HOME_SCREEN_BOOKS } from "../constant/paginations";
import { useDispatch, useSelector } from "react-redux";
import { tempActions } from '../store/temp-reducers';
import SearchField from "../UI/search-field";
import AppToast from "../UI/app-toast";

const Home = () => {
    const [count, setCount] = useState(0);
    const [booksList, setBooksList] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [showToast, setShowToast] = useState(false);
    const dispatch = useDispatch()
    const authState = useSelector(states => states.auth)

    //* Helper functions for the page
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
        else {
            dispatch(tempActions.addErrorToast({ message: "Failed to load books." }))
            setBooksList([])
            setCount(0)
        }
    }
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
        else {
            dispatch(tempActions.addErrorToast({ message: "Unable to perform search operation." }))
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
                    "quantity": 1
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
    //* Helper functions for the page


    useEffect(() => {
        fetchAllBooks()
    }, [])
    return (
        <div >
            <h2 className="text-center my-5">Find the books that you need...!!!</h2>
            <div className="container mb-5">
                <SearchField placeholder='Search book by name...' onChange={searchBookHandler} />
            </div>
            <div className="container-fluid d-flex flex-wrap justify-content-center">
                {booksList.length !== 0 && booksList.map((book, index) => (
                    <BookSaleCard book={book} key={index} addToCart={addToCartHandler} />
                ))}
                {booksList.length === 0 && (
                    <h1>No Book added yet.</h1>
                )}
            </div>
            <div className="d-flex justify-content-center my-4">
                {count !== 0 && <Pagination hideNextButton={true} hidePrevButton={true} count={count} onClick={paginationHandler} />}
            </div>
            <AppToast open={showToast} onClose={handleToastClose} message={"Item successfully added to cart!"} />
        </div>
    )
}

export default Home;