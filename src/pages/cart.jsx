import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItems from "../components/cart-items";
import FullPageLoader from "../components/full-page-loader";
import Loader from "../components/loader";
import Summary from "../components/summary";
import PrimaryBtn1 from "../UI/primary-btn";
import { tempActions } from "../store/temp-reducers";

const Cart = () => {
    const authStates = useSelector(state => state.auth)
    const [cartItems, setCartItems] = useState([])
    const [cartData, setCartData] = useState();
    const [isItemsLoaded, setIsItemsLoaded] = useState(false);
    const [isSummaryLoaded, setIsSummaryLoaded] = useState(false);
    const dispatch = useDispatch();
    const fetchCartItems = async () => {
        if (authStates.isAuthenticated) {
            let response;
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
                setCartItems(respData.length == 0 ? [] : [...respData]);
                setIsItemsLoaded(true);
                dispatch(tempActions.setTotalCartItems(respData.length))
            }
        }
        else {
            if (sessionStorage.getItem('cartItems')) {
                let items = sessionStorage.getItem('cartItems').split('%')
                let allItems = []
                for (let i = 0; i < items.length; i++) {
                    let item = JSON.parse(items[i])
                    let index = -1;
                    for (let j = 0; j < allItems.length; j++) {
                        if (allItems[j].book.id == item.bookId) {
                            index = j;
                        }
                    }
                    if (index !== -1) {
                        let data = allItems.pop(index)
                        allItems.push({ "book": data.book, "quantity": data.quantity + item.quantity })
                    }
                    else {
                        let response;
                        try {
                            response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/books/fetch-book/${item.bookId}`);
                        }
                        catch (err) {
                            console.log("Server is offline");
                        }
                        let respData;
                        if (response.ok) {
                            respData = await response.json();
                            allItems.push({ "book": respData, "quantity": item.quantity })
                            index = -1;
                        }
                    }
                }
                if (allItems.length > 0) {
                    setCartItems([...allItems])
                }
                else {
                    setCartItems([])
                }

                setIsItemsLoaded(true);
            }
            else {
                setCartItems([])
                setIsItemsLoaded(true);
            }

        }
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
    useEffect(() => {
        setIsItemsLoaded(false);
        setIsSummaryLoaded(false);
        fetchCartItems();
        fetchCartInfo();
    }, [])
    return (
        <>
            <div className="px-5 my-5 mx-auto">
                <h1 className="text-center">Cart Items</h1>
                {cartItems.length == 0 && (
                    <h3 className="text-center my-4">No Item added to the cart.</h3>
                )}
                <div className="row mt-5">
                    <div className="col-md-8">
                        {isItemsLoaded ? (
                            <>

                                {cartItems.length !== 0 && cartItems.map((item) => (
                                    <CartItems fetchCartItems={fetchCartItems} fetchCartInfo={fetchCartInfo} item={item} />
                                ))}
                            </>
                        ) : (
                            <div className="text-center my-4">
                                <Loader width='100' height='100' />
                            </div>
                        )}

                    </div>
                    <div className="col-md-4">
                        {!isSummaryLoaded && (
                            <div className="text-center my-4">
                                <Loader width='80' height='80' />
                            </div>
                        )}
                        {isSummaryLoaded && authStates.isAuthenticated && (
                            <>
                                {cartItems.length !== 0 && (
                                    <Summary data={cartData} />
                                )
                                }
                            </>
                        )}
                        {(isSummaryLoaded && !authStates.isAuthenticated) && (
                            <h3>Please login for checkout summary and purchasing.</h3>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart;