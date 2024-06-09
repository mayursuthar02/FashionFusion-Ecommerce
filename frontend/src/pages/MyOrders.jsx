import { useEffect, useState } from "react"
import useShowToast from "../hooks/useShowToast";

const MyOrders = () => {
    const showToast = useShowToast();
    const [orderData, setOrderData] = useState([]);
    
    useEffect(()=>{
        const fetchOrders = async() => {
            try {
                const res = await fetch('/api/orders/get-orders');
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                console.log(data);
            } catch (error) {
                console.log(error);
                showToast("Error", error, "error");
            }
        };
        fetchOrders();
    },[]);
    
  return (
    <div>MyOrders</div>
  )
}

export default MyOrders