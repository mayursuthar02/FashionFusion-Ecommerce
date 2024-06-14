import { Box, Flex, Text } from '@chakra-ui/react'
import { IoIosCloseCircle } from "react-icons/io";
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentCancle = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(()=>{
    if(!location.search) {
      navigate('/');
    }
  },[]);
  
  return (
    <>
      <Flex minH={'90vh'} align={'center'} justify={'center'} bgColor={'gray.100'}>
        <Flex flexDir={'column'} bg={'white'} w={'500px'} p={10} borderRadius={'md'} align={'center'} justify={'center'} gap={3}>
            <Box borderRadius={'full'} bgColor={'red.100'} p={5}>
              <Box color={'red.500'} fontSize={'40px'}>
                <IoIosCloseCircle/>
              </Box>
            </Box>

            <Text fontSize={'15px'} fontWeight={'500'}>Payment Cancelled!</Text>
        </Flex>
      </Flex>
    </>
  )
}

export default PaymentCancle