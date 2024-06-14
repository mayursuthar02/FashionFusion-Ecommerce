import React, { useEffect, useState } from 'react'
import { Link  as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import cartAtom from '../atoms/cartAtom';
import { useRecoilState } from 'recoil';
import { Box, Button, Divider, Flex, Spinner, Text } from '@chakra-ui/react';
import { MdOutlineCheck } from "react-icons/md";

const PaymentSuccess = () => {
  const query = useLocation();
  const sessionId = new URLSearchParams(query.search).get('session_id');
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useRecoilState(cartAtom);
  const [loadingData, setLoadingData] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // If sessionId is null and you access the success route then it redirect to home page
  if (!sessionId) {
    navigate('/');
  }
  
  // Delete cart items
  const deleteCartItems = async() => {
    try {
      const res = await fetch('/api/carts/delete-user-carts', {
        method: "DELETE",
        headers: {"Content-Type":"application/json"},
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
        return;
      }
      setCartItems([]);
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch order details
  useEffect(()=>{
    const fetchOrder = async() => {
      try {
        const res = await fetch(`/api/orders/sessionId/${sessionId}`);
        const data = await res.json();
        if (data.error) {
          console.log(data.error);
          return;
        }
        setOrderData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingData(false);
      }
    };

    setLoadingData(true);

    const fetchTimeout = setTimeout(() => {
      fetchOrder();
    }, 2000);

    // if cartiems lenght is not equal to 0 then then call removeCart function
    if (cartItems.length > 0) {
      deleteCartItems();
    }

    // After 15s it automatically navigate to home
    const navigateTimeout = setTimeout(() => {
      navigate('/');
    }, 15000);
    
    // Cleanup function to clear timeouts on unmount
    return () => {
      clearTimeout(fetchTimeout);
      clearTimeout(navigateTimeout);
    }

  },[cartItems.length, sessionId, navigate]);
  
  if (!orderData) {
    return (
      <Box minH={'90vh'} position={'relative'}>
        <Box w={'full'} h={'90vh'} bgColor={'gray.100'}></Box>
        <Spinner position={'absolute'} left={'48%'} top={'45%'} color='gray.500' size={'xl'}/>
      </Box>
    )
  }
  return (
    <>
      <Flex minH={'90vh'} align={'center'} justify={'center'} bgColor={'gray.100'}>
        <Box w={'550px'} h={'fit-content'} p={10} bgColor={'white'} borderRadius={'md'} boxShadow={'sm'}>
          <Flex flexDir={'column'} align={'center'} justify={'center'}>
            <Box bgColor={'blue.50'} borderRadius={'full'} p={4}>
              <Flex align={'center'} justify={'center'} bgColor={'blue.500'} w={'30px'} h={'30px'} borderRadius={'full'}>
                <MdOutlineCheck color='white'/>
              </Flex>
            </Box>
            <Text mt={2} fontSize={'16px'} fontWeight={'500'}>Payment Success!</Text>
            <Text fontSize={'20px'} fontWeight={'600'} textTransform={'uppercase'}>{orderData.paymentDetails.brand} - {orderData.paymentDetails.last4Digit}</Text>
          </Flex>

          <Divider borderColor={'gray.300'} my={5}/>
          
          {orderData.productDetails.map((product,i) => (
            <Flex align={'center'} justify={'space-between'} mb={3} key={i}>
              <Text fontSize={'15px'} color={'gray.500'}>{product.name} x {product.quantity}</Text>
              <Text fontSize={'15px'} fontWeight={'600'}>Rs. {(product.price * product.quantity).toFixed(2)}</Text>
            </Flex>
          ))}

          <Divider borderColor={'gray.300'} my={2}/>

          <Flex align={'center'} justify={'space-between'}>
            <Text fontSize={'15px'} color={'gray.500'}>Total Amount: </Text>
            <Text mt={3} fontSize={'20px'} fontWeight={'600'}>Rs. {orderData.totalAmount.toFixed(2)}</Text>
          </Flex>

          <Flex align={'center'} justify={'center'} gap={3} mt={10}>
            <Button as={RouterLink} to={'/'} colorScheme='blue' fontWeight={'500'}>Back Home</Button>
            <Button as={RouterLink} to={'/my-order'} colorScheme='blue' fontWeight={'500'}>My Order</Button>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

export default PaymentSuccess