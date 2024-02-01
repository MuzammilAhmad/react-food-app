import { useContext } from "react";
import CartContext from "../store/CartContext";
import Modal from "./UI/Modal";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import UserProgressContext from "../store/UserProgressContext";
import Button from "./UI/Button";
import useHttp from "../Hooks/useHttp"
import Error from "./Error"

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

export default function Checkout(){

    const {
        data,
        isLoading : isSending,
        error,
        sendRequest,
        clearData
        } = useHttp('http://localhost:3000/orders', requestConfig);


    const cartCtx= useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext)

    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity * item.price, 0);

    function handleClose(){
        userProgressCtx.hideCheckout();
    }

    function handleFinish(){
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    function handleSubmit(event){
        event.preventDefault();

        const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());

        sendRequest(
            JSON.stringify({
            order: {
                items: cartCtx.items,
                customer: customerData
            }
        }));
    }
    

    let actions  = (
    <>
     <Button type="button" textOnly onClick={handleClose}> Close </Button>
     <Button>Submit Order</Button>
    </>
    );

    if(isSending){
        actions = <span>Sending data ...</span>
    }

    if (data && !error){
      return (  <Modal
        open={userProgressCtx.progress === "checkout"} 
        onClose={handleFinish}
        >
            <h2>Success!</h2>
            <p>Your order was submitted successfully</p>
            <p>We will get back to you with more details via email in few minutes ...</p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>Okay</Button>
            </p>


        </Modal>);
    }


    
    return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
            <div>
                <h2>Checkout</h2>
                <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

                <Input label="Full Name" type="text" id="name"></Input>
                <Input label="Email Address" type="email" id="email"></Input>
                <Input label="Street Name" type="text" id="street"></Input>

                <div className="control-row">
                <Input label="Postal Code" type="text" id="postal-code"></Input>
                <Input label="City" type="text" id="city"></Input>
                </div>

                {error && <Error title = "Failed to submit order" message ={error}></Error>}

                <p className="modal-actions">{actions}</p>
                
            </div>
        </form>
    </Modal>);
}