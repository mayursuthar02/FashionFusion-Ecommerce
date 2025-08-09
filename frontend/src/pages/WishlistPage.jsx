import { useEffect, useState } from "react";
import { Box, Flex, Link, Heading, Image, Text, Button, Skeleton, Grid } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

import img1 from '../assets/img.jpg';

import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

import useShowToast from '../hooks/useShowToast';
import ProductCard from "../components/ProductCard";

import BASEURL from "../config/baseURL";

const WishlistPage = () => {
  const user = useRecoilValue(userAtom);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  const loadingList = new Array(10).fill(null);

  // Fetch product
  useEffect(() => {
    const getWishlist = async() => {
      setLoading(true);
      try {
        const res = await fetch(`${BASEURL}/api/users/get-wishlist`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setProducts(data);
      } catch (error) {
          console.log(error);
          showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      getWishlist();
    }
  },[user]);
  
  // User check
  if (!user) {
    return (
      <Flex minH={'100vh'} align={'center'} justify={'center'}>
          <Flex align={'center'} justifyContent={'center'} flexDirection={'column'}>
              <Heading color={'#121212'} fontSize={'2xl'} mb={2}>PLEASE LOG IN</Heading>
              <Text color={'gray.500'} mb={4}>Login to view items in your wishlist.</Text>
              <Box width={'500px'} height={'300px'} mb={5}>
                  <Image src={img1}/>
              </Box>
              <Link as={RouterLink} to={'/login'}>
                  <Button colorScheme="blue" mt={6}>Login</Button>
              </Link>
          </Flex>
      </Flex>
    )
  }

  return (
    <Box minW={'100vh'} py={10} px={'50px'}>
      {products.length === 0 && (
        <Flex minH={'100vh'} align={'center'} justify={'center'}>
          <Text color={'gray.400'} fontSize={'30px'} textTransform={'capitalize'}>Add product in your wishlist</Text>
        </Flex>
      )}

      <Grid templateColumns={'repeat(5,1fr)'} gap={10}>
        {loading && loadingList.map((_,i) => (
          <Box key={i}>
            <Skeleton height={'370px'} borderRadius={'md'}/>
            <Skeleton height={'19px'} width={'150px'} mt={2} borderRadius={'md'}/>
            <Skeleton height={'19px'} width={'120px'} mt={2} borderRadius={'md'}/>
            <Skeleton height={'19px'} width={'200px'} mt={2} borderRadius={'md'}/>
          </Box>
        ))}

        {products.length > 0 && !loading && (
          products.map((product) => (
            <ProductCard key={product._id} product={product}/>
          ))
        )}
      </Grid>
    </Box>
  )
}

export default WishlistPage