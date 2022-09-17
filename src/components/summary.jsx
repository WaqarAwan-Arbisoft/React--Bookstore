import PrimaryBtn1 from "../UI/primary-btn";

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
            <div className="text-center mt-5">
                <PrimaryBtn1 color='success'>Process to Checkout</PrimaryBtn1>
            </div>
        </div>
    )
}

export default Summary;