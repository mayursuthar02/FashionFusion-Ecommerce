import { useRecoilState } from "recoil";
import cartAtom from "../atoms/cartAtom";
import useShowToast from '../hooks/useShowToast';

const FetchCartItems = () => {
   const [cartItems, setCartItems] = useRecoilState(cartAtom); 
    const showToast = useShowToast();
    
   const fetchCartItemsFunc = async() => {
    try {
      const res = await fetch('/api/carts/get-cart-items');
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setCartItems(data);
    } catch (error) {
      console.log(error);
    }
  };

  return fetchCartItemsFunc;
};

export default FetchCartItems;
