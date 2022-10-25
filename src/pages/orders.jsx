import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderTable from "../components/order-table";
import { tempActions } from "../store/temp-reducers";


const Orders = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [orders, setOrders] = useState([])
    const authStates = useSelector(states => states.auth)
    const dispatch = useDispatch()

    const fetchOrders = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/fetch-orders/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authStates.token
            }
        })
        if (response.ok) {
            let respData = await response.json()
            setOrders([...respData])
            setIsLoaded(true)
        }
        else {
            console.log(response)
            dispatch(tempActions.addErrorToast({ message: "An error occurred while fetching the orders data." }))
        }
    }
    useEffect(() => {
        fetchOrders();
    }, [])
    return (
        <div className="container my-5">
            <h1 className="text-center mb-5">Orders</h1>
            {isLoaded && orders.length > 0 && <OrderTable orders={orders} />}
            {isLoaded && orders.length === 0 && (
                <h2 className="m-5 text-center text-muted">
                    No Order placed yet.
                </h2>
            )}
        </div>

    );
}

export default Orders;