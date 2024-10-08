import { FaPlus } from "react-icons/fa";

type ProductsProps = {
    productId : string ;
    photo : string;
    name : string ;
    price : number ;
    stock : number ;
    handler : ()=> void ;
};

const ProductCard = ({
    productId,
    price, 
    name, 
    stock, 
    photo, 
    handler
} : ProductsProps) => {
  return (
    <div className="product-card">   
        <img src={`${import.meta.env.VITE_SERVER}/${photo}`} alt={name}/>
        <p>{name}</p>
        <span>₹{price} </span>

        <div>
            <button onClick={() => handler}> <FaPlus/> </button>
        </div>
        
    </div>


  )
}

export default ProductCard;
