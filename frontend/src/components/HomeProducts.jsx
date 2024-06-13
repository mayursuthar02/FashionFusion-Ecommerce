import { useEffect, useState } from "react";
import { Box, Button, Grid, Skeleton, Text } from "@chakra-ui/react"
import {Link as RouterLink} from 'react-router-dom';

import useShowToast from "../hooks/useShowToast";

import ProductCard from "./ProductCard";


const HomeProducts = ({title, category, subCategory}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    const loadingList = new Array(10).fill(null);
    
    // Fetch All Products
    useEffect(()=>{
      const fetchAllProducts = async() => {
        setLoading(true);
        try {
          const res = await fetch('/api/products/get-all-product');
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          setProducts(data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAllProducts();
    },[]);
    
  return (
    <Box px={'80px'} mt={10} mb={10}>
    <Text mb={10} fontSize={'40px'} textAlign={'center'} fontWeight={'500'} textTransform={'uppercase'}>{title}</Text>
    <Grid templateColumns={'repeat(5,1fr)'} gap={5} mb={10}>
      {loading && loadingList.map((_,i) => (
        <Box key={i}>
          <Skeleton height={'370px'} borderRadius={'md'}/>
          <Skeleton height={'19px'} width={'150px'} mt={2} borderRadius={'md'}/>
          <Skeleton height={'19px'} width={'120px'} mt={2} borderRadius={'md'}/>
          <Skeleton height={'19px'} width={'200px'} mt={2} borderRadius={'md'}/>
        </Box>
      ))}
      
      {!loading && products
      .filter((product) => subCategory ? product.category === category && product.subCategory === subCategory : product.category === category) 
      .slice(0,10)
      .map((product) => (
        <ProductCard key={product._id} product={product}/>
      ))}
    </Grid>
    <Button as={RouterLink} to={`/${category}`} w={'full'} fontWeight={'500'} letterSpacing={2} py={6} borderRadius={'1px'}>SEE ALL</Button>
  </Box>
  )
}

export default HomeProducts