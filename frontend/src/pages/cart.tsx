import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cart-items";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId :"kdfaj",
    stock : 10,
    price:54990,  
    name :"MacMini", 
    photo : "https://m.media-amazon.com/images/I/21laeQrFUTL._SY445_SX342_QL70_FMwebp_.jpg",
    quantity : 1
  }
];
const subtotal = 4000;
const tax = Math.round(subtotal* 0.18);
const shippingCharges = 200;
const discount = 400;
const total = subtotal + tax + shippingCharges ;

const Cart = () => {

  const  [couponCode , setCouponCode] = useState<string> ("");
  const [isValidCouponCode , setIsValidCouponCode] = useState<boolean> (false)  ;


  useEffect(() => {
    const timeOutId = setTimeout(()=>{
      if(Math.random() > 0.5)setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
    } , 1000);

    return ()=>{
      clearTimeout(timeOutId);
      setIsValidCouponCode(false);
    }
  } , [couponCode]);

  return (
    <div className="cart">
      <main>
        {
          cartItems.length > 0 ? cartItems.map((i , idx) => (<CartItem key={idx} cartItem={i}/>)) : <h1>No Items Added</h1>
        }

      </main>
      <aside>


        <p>SubTotal : ₹{subtotal}</p>
        <p>Shipping Charges : ₹{shippingCharges}</p>
        <p>Tax : {tax}</p>
        <p> Discount : <em className="red">- ₹{discount}</em></p>
        <p>
          <b>Total: ₹{total}</b>
        </p>

        <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />

        {
          couponCode && (isValidCouponCode? (
            <span className="green"> 
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red"> 
              Invalid Coupon <VscError/>
            </span>
          )
        )
        }

        {
          cartItems.length > 0  && <Link to={"/shipping"}>Checkout</Link>
        }

      </aside>
    </div>
  )
}

export default Cart
