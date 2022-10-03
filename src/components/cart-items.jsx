import { useState } from "react";
import PrimaryBtn1 from "../UI/primary-btn";
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from "react-redux";

const CartItems = (props) => {
    const authStates = useSelector(state => state.auth)
    const updateQuantity = async (newQty, bookId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/cart-item/update-quantity/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token,
            },
            body: JSON.stringify({
                "book": bookId,
                "quantity": newQty
            })
        })
        if (response.ok) {
            props.fetchCartItems()
            props.fetchCartInfo()
        }
    }
    const decreaseQuantityHandler = async (bookId) => {
        if (props.item.quantity === 1) return;
        updateQuantity(props.item.quantity - 1, bookId);

    }
    const increaseQuantityHandler = async (bookId) => {
        updateQuantity(props.item.quantity + 1, bookId);
    }
    const removeItemHandler = async (bookId) => {
        if (authStates.isAuthenticated) {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/cart-item/remove-item/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + authStates.token,
                },
                body: JSON.stringify({
                    "book": bookId,
                })
            })
            if (response.ok) {
                props.fetchCartItems()
                props.fetchCartInfo()
            }
        }
        else {
            let items = sessionStorage.getItem('cartItems').split('%')
            for (let i = 0; i < items.length; i++) {
                let item = JSON.parse(items[i]);
                if (item.bookId === bookId) {
                    items.pop(i)
                }
            }
            items = items.join('%')
            sessionStorage.setItem('cartItems', items);
            props.fetchCartItems()
            props.fetchCartInfo()
        }

    }
    return (
        <div className="d-flex mb-4 cart-item-container align-items-center">
            <div className="text-center mx-4">
                <img src={props.item.book.image} alt="BOOK_IMAGE" width={150} />
            </div>
            <div className="d-flex flex-column justify-content-between">
                <div>
                    <div className="mb-3"><b>Name: </b>{props.item.book.name}</div>
                    <div className="mb-3"><b>Price: </b>${props.item.book.price}</div>
                    <div className="mb-3"><b>Quantity: </b>{props.item.quantity}</div>
                    <div className="mb-3"><b>Total Price: </b>${props.item.quantity * props.item.book.price}</div>
                </div>
                <div>
                    {authStates.isAuthenticated && (
                        <div className="mb-3"><b>Quantity:</b> <span className='btn mx-2 border-2 border-primary rounded-3 pe-1 ps-1'>
                            <span role='button' className='px-3' onClick={() => { decreaseQuantityHandler(props.item.book.id) }}>-</span>
                            <span className='quantity'>{props.item.quantity}</span>
                            <span role='button' className='px-3' onClick={() => { increaseQuantityHandler(props.item.book.id) }}>+</span>
                        </span></div>

                    )}
                    <div className="mt-3">
                        <PrimaryBtn1 color='error' onClick={() => { removeItemHandler(props.item.book.id) }}><DeleteIcon /> Remove Item</PrimaryBtn1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItems;