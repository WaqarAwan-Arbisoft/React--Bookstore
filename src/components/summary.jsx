import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PrimaryBtn1 from "../UI/primary-btn";
import CheckoutForm from "./checkout-form";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PROMISE_KEY);
const Summary = (props) => {
    return (
        <div className="px-4 py-2">
            <h2 className="text-center">Cart Summary</h2>
            <div className="d-flex justify-content-between m-4">
                <b>Total Price</b>
                <div>$ {props.data.totalPrice}</div>
            </div>
            <div className="d-flex justify-content-between m-4">
                <b>Total Quantity</b>
                <div>{props.data.totalQty} Books</div>
            </div>
            <Elements stripe={stripePromise}>
                <CheckoutForm amount={props.data.totalPrice} reloadItems={props.fetchCartItems} reloadCartInfo={props.fetchCartInfo} checkStockAvailability={props.checkStock} updateAfterPurchase={props.updateCart} />
            </Elements>
        </div>
    )
}

export default Summary;