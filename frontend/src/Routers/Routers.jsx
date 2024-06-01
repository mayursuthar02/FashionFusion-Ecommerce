import { Routes, Route } from 'react-router-dom';
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

const Routers = () => {
  return (
    <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/wishlist' element={<WishlistPage/>}/>

        <Route path='/dashboard/*' element={<DashboardPage/>}>
          <Route path=":name" element={<Dashboard/>}/>
          <Route path="profile" element={<ProfilePage/>}/>
          <Route path="products" element={<DashboardProductPage/>}/>
          <Route path="orders" element={<DashboardOrders/>}/>
          <Route path="reviews" element={<DashboardReviews/>}/>
        </Route>

    </Routes>
  )
}

export default Routers