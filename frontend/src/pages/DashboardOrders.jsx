import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast';
import { Box, Flex, Grid, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Text, Link, Divider, Button, Image, Avatar } from '@chakra-ui/react';
import { format } from 'date-fns';
import {Link as RouterLink} from 'react-router-dom';
import { TiLocationArrow } from "react-icons/ti";

const DashboardOrders = () => {
  const showToast = useShowToast();
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when component mounts or updates
  }, []);

  useEffect(()=> {
    const fetchOrders = async() => {
      setLoading(true);
      try {
        const res = await fetch('/api/orders/vendor-orders');
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setOrdersData(data);
      } catch (error) {
        console.log(error);
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  },[]);

  const totalAmountAllOrders = ordersData.reduce((total, order) => {
    let orderTotal = 0;
    order.productDetails.forEach((product) => {
        orderTotal += product.price * product.quantity;
    });
    return total + orderTotal;
  }, 0);

  const totalProductsOrdered = ordersData.reduce((total, order) => {
    return total + order.productDetails.reduce((orderTotal, product) => {
        return orderTotal + product.quantity;
    }, 0);
  }, 0);
  
  return (
    <Box minH={'100vh'}>
      <Text fontSize={'30px'} fontWeight={'500'} mb={5}>Orders</Text>

      <Grid templateColumns={'repeat(2,1fr)'} px={'50px'} gap={20} mb={5}>
        <Stat borderRight={'1px solid #e5e5e5'} p={5}>
          <StatLabel fontSize={'20px'} fontWeight={'600'} mb={3}>Total Orders</StatLabel>
          <Flex align={'center'} gap={5}>
            <StatNumber>{totalProductsOrdered}</StatNumber>
            <StatHelpText>
              <StatArrow type='increase' />
              0%
            </StatHelpText>
          </Flex>
          <Text color={'gray.500'} fontSize={'12px'} mt={2}>Order Growth (This Year)</Text>
        </Stat>

        <Stat p={5}>
          <StatLabel fontSize={'20px'} fontWeight={'600'} mb={3}>Total Revenue</StatLabel>
          <Flex align={'center'} gap={5}>
            <StatNumber>{totalAmountAllOrders}</StatNumber>
            <StatHelpText>
              <StatArrow type='increase' />
              0%
            </StatHelpText>
          </Flex>
          <Text color={'gray.500'} fontSize={'12px'} mt={2}>Total Earning (This Year)</Text>
        </Stat>
      </Grid>


      {ordersData && !loading && (
        <Grid templateColumns={'1fr'} gap={10} maxH={'400vh'} overflowY={'scroll'} className="order-list">
        {ordersData.map((order) => (
            <Box key={order._id} bg={'white'} height={'fit-content'} border={'1px solid'} borderColor={'gray.200'} p={7} borderRadius={'md'}>
                <Flex align={'center'} justify={'space-between'} mb={5}>
                  <Flex align={'center'} gap={3}>
                    <Avatar src={order.userDetails.profilePic}/>
                    <Text fontSize={'20px'} fontWeight={'500'}>{order.userDetails.fullName ? order.userDetails.fullName : order.userDetails.businessName}</Text>
                  </Flex>
                  <Button as={RouterLink} to={`/dashboard/orders/${order._id}`} fontWeight={'400'} colorScheme='blue'>See Details</Button>
                </Flex>
              
                <Flex align={'center'} justify={'space-between'}>
                    <Flex align={'center'} gap={5}>
                        <Flex align={'center'} gap={2} fontSize={'16px'} fontWeight={'500'} bgColor={'gray.100'} py={2} px={4} borderRadius={'full'}>
                            <Text>Order</Text>
                            <Text color={'blue.400'}>#{order._id.slice(-4)} - {order._id.slice(-8, -4)}</Text>
                        </Flex>

                        <Flex align={'center'} gap={2} fontSize={'15px'} fontWeight={'400'} color={'gray.500'}>
                            <Text>Order Placed:</Text>
                            <Text>{format(order.createdAt, "EEE, do MMM yy")}</Text>
                        </Flex>
                    </Flex>

                    <Link as={RouterLink} target="_blank" to={order.receipt_url} bgColor={'gray.100'} py={2} px={4} borderRadius={'md'} cursor={'pointer'} _hover={{bg: 'gray.200'}}>Receipt</Link>
                </Flex>
                <Flex gap={2} fontSize={'14px'} color={'gray.500'} ml={4} mt={2}>
                    Status: 
                    {order.status === 'pending' && <Text color={'yellow.400'} fontWeight={'500'}>{order.status}</Text>}
                    {order.status === 'received' && <Text color={'orange.500'} fontWeight={'500'}>{order.status}</Text>}
                    {order.status === 'at depot' && <Text color={'red.500'} fontWeight={'500'}>{order.status}</Text>}
                    {order.status === 'in transit' && <Text color={'purple.500'} fontWeight={'500'}>{order.status}</Text>}
                    {order.status === 'out of delivery' && <Text color={'blue.500'} fontWeight={'500'}>{order.status}</Text>}
                    {order.status === 'delivered' && <Text color={'green.500'} fontWeight={'500'}>{order.status}</Text>}
                </Flex>

                <Text fontSize={'14px'} color={'gray.500'} ml={4} my={2}>Item : {order.productDetails.length}</Text>

                <Divider borderColor={'gray.200'}/>

                {order.productDetails.map((product) => (
                    <Flex justify={'space-between'} borderBottom={'1px solid '} borderColor={'gray.200'} py={5} gap={5}>
                        <Box bg={'gray.200'} w={'80px'} height={'115px'} overflow={'hidden'} borderRadius={'md'}>
                            <Image src={product.image} w={'full'} h={'full'} objectFit={'cover'}/>
                        </Box>

                        <Flex flexDir={'column'} justify={'center'} gap={1} w={'850px'}>
                            <Text fontSize={'17px'} fontWeight={'600'}>{product.brandName}</Text>
                            <Text fontSize={'15px'} fontWeight={'400'} color={'gray.500'}>{product.name}</Text>
                            <Flex align={'center'} gap={3}>
                                <Flex align={'center'} gap={2} fontSize={'15px'} fontWeight={'400'} color={'gray.500'}>Color: <Text color={'black'}>{product.color}</Text></Flex>
                                <Flex align={'center'} gap={2} fontSize={'15px'} fontWeight={'400'} color={'gray.500'}>Size: <Text color={'black'}>{product.size}</Text></Flex>
                                <Flex align={'center'} gap={2} fontSize={'15px'} fontWeight={'400'} color={'gray.500'}>Qty: <Text color={'black'}>{product.quantity}</Text></Flex>
                            </Flex>
                        </Flex>
                        
                        <Box>
                            <Text w={'100px'} fontWeight={'500'} fontSize={'13px'} color={'gray.500'} textAlign={'right'}>Rs. {product.price.toFixed(2)} x {product.quantity}</Text>
                            <Text w={'100px'} fontWeight={'600'} fontSize={'15px'} textAlign={'right'}>Rs. {(product.price * product.quantity).toFixed(2)}</Text>
                            <Text w={'100px'} fontWeight={'500'} fontSize={'13px'} textAlign={'right'} color={'orange'}>{product.discount}%</Text>
                        </Box>
                    </Flex>
                ))}

                <Flex mt={4} gap={5} align={'center'} justify={'space-between'}>
                    <Button cursor={'pointer'} fontSize={'15px'} fontWeight={'500'}>CANCLE ORDER</Button>
                    <Flex align={'center'} justify={'space-between'} w={'440px'}>
                        <Text fontSize={'15px'} fontWeight={'500'}>Total Amount:</Text>
                        <Text fontWeight={'600'} fontSize={'15px'}>Rs. {order.totalAmount.toFixed(2)}</Text>
                    </Flex>
                </Flex>
            </Box>
        ))}
    </Grid>
      )}
    </Box>
  )
}

export default DashboardOrders