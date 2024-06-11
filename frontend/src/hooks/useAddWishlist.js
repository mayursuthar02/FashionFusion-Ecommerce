import React from 'react'
import useShowToast from './useShowToast';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';

const useAddWishlist = () => {
    const showToast = useShowToast();
    const [,setUser] = useRecoilState(userAtom);
    
    const addWishlist = async(id) => {
        try {
            const res = await fetch('/api/users/add-wishlist', {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({productId: id})
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            };
            localStorage.setItem('user-details', JSON.stringify(data));
            setUser(data);
        } catch (error) {
            console.log(error);
            showToast("Error", error, "error");
        }
    }

    return addWishlist;
}

export default useAddWishlist