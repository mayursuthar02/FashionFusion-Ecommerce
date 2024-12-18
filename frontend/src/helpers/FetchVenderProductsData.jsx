import React from 'react'
import { useRecoilState } from 'recoil';
import venderProductAtom from '../atoms/venderProductAtom';

const FetchVenderProductsData = () => {
    const [products, setProducts] = useRecoilState(venderProductAtom);
    
    const fetchVenderProducts = async() => {
        try {
          const res = await fetch('/api/products/vendor');
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          setProducts(data);
        } catch (error) {
          console.log(error);
        }
      };
      
      return fetchVenderProducts;
}

export default FetchVenderProductsData