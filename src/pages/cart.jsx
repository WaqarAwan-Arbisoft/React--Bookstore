import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItems from "../components/cart-items";
import FullPageLoader from "../components/full-page-loader";
import Loader from "../components/loader";
import Summary from "../components/summary";
import PrimaryBtn1 from "../UI/primary-btn";
import { tempActions } from "../store/temp-reducers";
import { Alert, Snackbar } from "@mui/material";

const Cart = () => {
    const authStates = useSelector(state => state.auth)
    const [cartItems, setCartItems] = useState([])
    const [cartItemsData, setCartItemsData] = useState([])
    const [cartData, setCartData] = useState();
    const [isItemsLoaded, setIsItemsLoaded] = useState(false);
    const [isSummaryLoaded, setIsSummaryLoaded] = useState(false);

    const dispatch = useDispatch();
    const fetchCartItems = async () => {
        if (authStates.isAuthenticated) {
            let response;
            if (sessionStorage.getItem('cartItems')) {
                let items = sessionStorage.getItem('cartItems').split('%')
                for (let i = 0; i < items.length; i++) {
                    let item = JSON.parse(items[i]);
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/add-to-cart/`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Token ' + authStates.token,
                        },
                        body: JSON.stringify({
                            "book": item['bookId'],
                            "quantity": 1
                        })
                    })
                    if (!response.ok) {
                        console.log(response.statusText)
                    }
                }
                sessionStorage.removeItem('cartItems');
            }
            try {
                response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/fetch-items/`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Token ' + authStates.token
                    }
                });
            }
            catch (err) {
                console.log("Server is offline");
            }
            let respData;
            if (response.ok) {
                respData = await response.json();
                maintainCartItemData(respData);
                setCartItems(respData.length == 0 ? [] : [...respData]);
                setIsItemsLoaded(true);
                dispatch(tempActions.setTotalCartItems(respData.length))
                fetchCartInfo();
            }
        }
    }
    const maintainCartItemData = (data) => {
        let booksData = []
        for (let item of data) {
            booksData.push({ "book": item.book.id, "quantity": item.quantity })
        }
        setCartItemsData(booksData)
    }
    const fetchCartInfo = async () => {
        if (authStates.isAuthenticated) {
            let response;
            try {
                response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/get-update-delete-cart/`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Token ' + authStates.token
                    }
                });
            }
            catch (err) {
                console.log("Server is offline");
            }
            let respData;
            if (response.ok) {
                respData = await response.json();
                setCartData(respData);
                setIsSummaryLoaded(true);
            }
            else {
                setCartItems([])
                setIsSummaryLoaded(true);
            }
        }
        else {
            setIsSummaryLoaded(true)
        }
    }
    const checkStock = () => {

        return fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/check-stock/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            },
            body: JSON.stringify({
                "items": cartItemsData
            })
        })
    }
    const updateStockAfterPurchase = async () => {
        let response;
        response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/purchase-from-stock/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            },
            body: JSON.stringify({
                "items": cartItemsData
            })
        })

        if (response.ok) {
            setCartItemsData([])
            fetchCartItems()
            fetchCartInfo()
        }
        else {
            console.log("An error occurred")
        }
    }
    useEffect(() => {
        setIsItemsLoaded(false);
        setIsSummaryLoaded(false);
        fetchCartItems();
    }, [])

    return (
        <>
            <div className="px-5 my-5 mx-auto">
                <h1 className="text-center">Cart Items</h1>
                {authStates.isAuthenticated && cartItems.length == 0 && (
                    <h3 className="text-center my-4">No Item added to the cart.</h3>
                )}
                {!authStates.isAuthenticated && (
                    <h3 className="text-center">Please login to see cart items and initiate purchasing.</h3>
                )}
                <div className="row mt-5">
                    <div className="col-lg-8">
                        {authStates.isAuthenticated && isItemsLoaded && (
                            <>

                                {cartItems.length !== 0 && cartItems.map((item, index) => (
                                    <CartItems key={index} fetchCartItems={fetchCartItems} fetchCartInfo={fetchCartInfo} item={item} />
                                ))}
                            </>
                        )}
                        {authStates.isAuthenticated && !isItemsLoaded && (
                            <div className="text-center my-4">
                                <Loader width='100' height='100' />
                            </div>
                        )}

                    </div>
                    <div className="col-lg-4">
                        {authStates.isAuthenticated && !isSummaryLoaded && (
                            <div className="text-center my-4">
                                <Loader width='80' height='80' />
                            </div>
                        )}
                        {isSummaryLoaded && isItemsLoaded && authStates.isAuthenticated && (
                            <>
                                {cartItems.length !== 0 && (
                                    <Summary data={cartData} checkStock={checkStock} fetchCartItems={fetchCartItems} fetchCartInfo={fetchCartInfo} updateCart={updateStockAfterPurchase} />
                                )
                                }
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart;