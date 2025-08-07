import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import WishlistPage from '../pages/WishlistPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import DashboardProductPage from '../pages/DashboardProductPage';
import Dashboard from '../pages/Dashboard';
import DashboardOrders from '../pages/DashboardOrders';
import DashboardReviews from '../pages/DashboardReviews';
import ProductDetails from '../pages/ProductDetails';
import ProductsPage from '../pages/ProductsPage';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentCancle from '../pages/PaymentCancle';
import MyOrders from '../pages/MyOrders';
import OrderDetailsPage from '../pages/OrderDetailsPage';
import VendorOrderDetailsPage from '../pages/VendorOrderDetailsPage';
import SearchProduct from '../pages/SearchProduct';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const Routers = () => {
  const user = useRecoilValue(userAtom);
  
  return (
    <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={!user ? <LoginPage/> : <Navigate to={"/"}/>}/>
        <Route path='/signup' element={!user ? <SignupPage/> : <Navigate to={"/"}/>}/>
        <Route path='/wishlist' element={<WishlistPage/>}/>
        <Route path='/:category/:subCategory/:name/:productId' element={<ProductDetails/>}/>
        <Route path='/:category' element={<ProductsPage/>}/>
        <Route path='/:category/:subCategory' element={<ProductsPage/>}/> 
        <Route path='/order/success' element={<PaymentSuccess/>}/>
        <Route path='/order/cancelled' element={<PaymentCancle/>}/>
        <Route path='/my-order' element={user ? <MyOrders/> : <Navigate to={"/login"}/>}/>
        <Route path='/my-order/:orderId' element={<OrderDetailsPage/>}/>
        <Route path='/dashboard/orders/:orderId' element={user?.isBusinessAccount === true ? <VendorOrderDetailsPage/> : <Navigate to={"/"}/>}/>
        <Route path='/search' element={<SearchProduct/>}/>

        <Route path='/dashboard/*' element={<DashboardPage/>} >
          <Route path=":name" element={user?.isBusinessAccount === true ? <Dashboard/> : <Navigate to={"/"}/>}/>
          <Route path="profile" element={<ProfilePage/>}/>
          <Route path="products" element={user?.isBusinessAccount === true ? <DashboardProductPage/> : <Navigate to={"/"}/>}/>
          <Route path="orders" element={user?.isBusinessAccount === true ? <DashboardOrders/> : <Navigate to={"/"}/>}/>
          <Route path="reviews" element={user?.isBusinessAccount === true ? <DashboardReviews/> : <Navigate to={"/"}/>}/>
        </Route>

    </Routes>
  )
}

export default Routers