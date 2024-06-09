import React, { useEffect, useState } from 'react'
import { Link  as RouterLink, useLocation } from 'react-router-dom'
import FetchCartItems from '../helpers/FetchCartItems';
import useShowToast from '../hooks/useShowToast';
import cartAtom from '../atoms/cartAtom';
import { useRecoilState } from 'recoil';
import { Box, Button, Divider, Flex, Grid, Image, Spinner, Text, Link } from '@chakra-ui/react';
import { MdOutlineCheck } from "react-icons/md";
import {format} from 'date-fns';
import { RiVisaLine } from "react-icons/ri";

const PaymentSuccess = () => {
  const query = useLocation();
  const sessionId = new URLSearchParams(query.search).get('session_id');
  const fetchCartItemsFunc = FetchCartItems();
  const showToast = useShowToast();

  const [cartItems, setCartItems] = useRecoilState(cartAtom);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [orderData, setOrderData] = useState(null);
  
  // // Fetch order details
  // const fetchOrder = async(orderId) => {
  //   try {
  //     const res = await fetch(`/api/orders/${orderId}`);
  //     const data = await res.json();
  //     if (data.error) {
  //       console.log(data.error);
  //       return;
  //     }
  //     setOrderData(data);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoadingData(false);
  //   }
  // }

  // // Delete cart items
  // const deleteCartItems = async() => {
  //   try {
  //     const res = await fetch('/api/carts/delete-user-carts', {
  //       method: "DELETE",
  //       headers: {"Content-Type":"application/json"},
  //     });
  //     const data = await res.json();
  //     if (data.error) {
  //       console.log(data.error);
  //       return;
  //     }
  //     setCartItems([]);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // // Create order
  // const createOrder = async()=> {
  //   try {
  //     const res = await fetch(`/api/orders/create-order`, {
  //       method: "POST",
  //       headers: {"Content-Type":"application/json"},
  //       body: JSON.stringify({sessionId, products: cartItems})
  //     });
  //     const data = await res.json();
  //     if (data.error) {
  //       console.log(data.error);
  //       return;
  //     }
  //     fetchOrder(data._id);
  //     deleteCartItems();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // // Fetch cartitem Data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoadingData(true);
  //     try {
  //       setLoading(true);
  //       await fetchCartItemsFunc();
  //       setLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchData();
  // }, []);

  // // Call create order Func
  // useEffect(() => {
  //   if (!loading) {
  //     createOrder();
  //   }
  // }, [loading]);
  
  // if (!orderData) {
  //   return (
  //     <Box minH={'90vh'} position={'relative'}>
  //       <Box w={'full'} h={'90vh'} bgColor={'gray.100'}></Box>
  //       <Spinner position={'absolute'} left={'48%'} top={'45%'} color='gray.500' size={'xl'}/>
  //     </Box>
  //   )
  // }
  return (
    <>
      {/* {loadingData && !orderData ? (
        <Box minH={'90vh'} position={'relative'}>
          <Box w={'full'} h={'90vh'} bgColor={'black'} opacity={.5}></Box>
          <Spinner position={'absolute'} left={'48%'} top={'50%'} color='gray.300' size={'xl'}/>
        </Box>
      ) : (
        <Flex minH={'100vh'} bgColor={'gray.100'} alignItems={'center'} justifyContent={'center'}>
          <Box w={'600px'} padding={10} borderRadius={'md'} bg={'white'} overflow={'hidden'} zIndex={1}>

            <Flex flexDirection={'column'} align={'center'} justify={'center'} gap={2}>
              <Box bg={'green.50'} borderRadius={'full'} p={5}>
                <Box color={'white'} bg={'green.400'} borderRadius={'full'} p={2}>
                  <MdOutlineCheck fontSize={'17px'}/>
                </Box>
              </Box>
              <Text fontSize={'16px'} fontWeight={'500'}>Payment Success!</Text>
            </Flex>

            <Flex align={'center'} justify={'center'} fontSize={'14px'} color={'gray.500'} mt={2} fontWeight={'400'}>Order Id # {orderData?._id.slice(-4)}-{orderData._id.slice(-8, -4)}</Flex>

            <Grid templateColumns={'.6fr 1fr .6fr'} mt={9}>
              <Box>
                <Text fontSize={'13px'} fontWeight={'600'} color={'gray.500'}>AMOUNT PAID</Text>
                <Text fontSize={'14px'} color={'gray.700'} fontWeight={'400'}>Rs. {orderData?.totalPrice.toFixed(2)}</Text>
              </Box>
              <Box>
                <Text fontSize={'13px'} fontWeight={'600'} color={'gray.500'}>DATE PAID</Text>
                <Text fontSize={'14px'} color={'gray.700'} fontWeight={'400'}>Rs. {format(orderData?.createdAt, "MMM d, yyyy, h:mm:ss a")}</Text>
              </Box>
              <Box>
                <Text fontSize={'13px'} fontWeight={'600'} color={'gray.500'}>PAYMENT METHOD</Text>
                <Box fontSize={'50px'} mt={-3} color={'gray.700'}>
                  <RiVisaLine/>
                </Box>
              </Box>
            </Grid>

            <Text fontSize={'14px'} fontWeight={'600'} color={'gray.700'} mb={5}>SUMMARY</Text>

            <Box width={'full'} bg={'gray.50'} p={5} borderRadius={'md'}> 
              <Box>
                {orderData.products.map((product) => {
                  return (
                    <Flex align="start" justify="space-between" key={product.productId._id} gap={3} mb={2} color={'gray.700'}>
                      <Flex align="center" fontSize={'15px'}>{product.productId.name} x {product.quantity}</Flex>
                      <Flex minW={'100px'} justifyContent={'right'}>Rs. {((product.productId.price - ((product.productId.price * product.productId.discount) / 100)) * product.quantity).toFixed(2)}</Flex>
                    </Flex>
                  );
                })}
                <Divider borderColor={'gray.300'} my={3}/>
                <Flex align={'center'} justifyContent={'space-between'} color={'gray.600'} fontWeight={'600'}  fontSize={'15px'}>
                  <Text>Amount charged</Text>
                  <Text>Rs. {orderData?.totalPrice.toFixed(2)}</Text>
                </Flex>
              </Box>
            </Box>

            <Divider borderColor={'gray.200'} my={5}/>

            <Flex align={'center'} fontSize={'15px'} fontWeight={'500'} color={'gray.600'} gap={1}>
              <Text>If you have any questions, contact us at</Text>
              <Text color={'blue.500'}>fashionfusion@gmail.com</Text>
            </Flex>
            
            <Link as={RouterLink} to={'/'} display={'flex'} alignItems={'center'} justifyContent={'center'} bgColor={'blue.500'} _hover={{bgColor: 'blue.600'}} color={'white'} py={2} borderRadius={'md'} fontWeight={'500'} w={'full'} mt={6}>BACK HOME</Link>
          </Box>
        </Flex>
      )} */}
      Success
    </>
  )
}

export default PaymentSuccess