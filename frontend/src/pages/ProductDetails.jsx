import React from 'react'
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const {productId} = useParams();

  
  
  return (
    <div>ProductDetails</div>
  )
}

export default ProductDetails