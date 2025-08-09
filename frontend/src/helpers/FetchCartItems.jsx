import { useRecoilState } from "recoil";
import cartAtom from "../atoms/cartAtom";
import useShowToast from '../hooks/useShowToast';
import { baseURL as BASEURL } from "../config/baseURL";

const FetchCartItems = () => {
   const [cartItems, setCartItems] = useRecoilState(cartAtom); 
    const showToast = useShowToast();
    
   const fetchCartItemsFunc = async() => {
    try {
      const res = await fetch(`${BASEURL}/api/carts/get-cart-items`);
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
