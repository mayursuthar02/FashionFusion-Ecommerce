import React, { useEffect, useState } from 'react'
import {Text, Grid, Box, Flex, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Image, Link, Badge} from '@chakra-ui/react';

import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { BsBoxSeam } from "react-icons/bs";
import { FiInbox } from "react-icons/fi";
import { useRecoilState } from 'recoil';
import venderProductAtom from '../atoms/venderProductAtom';
import useShowToast from '../hooks/useShowToast';
import FetchVenderProductsData from '../helpers/FetchVenderProductsData';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';

const Dashboard = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useRecoilState(venderProductAtom);
  const showToast = useShowToast();
  const fetchVenderProducts = FetchVenderProductsData();
  
  // Fetch Orders
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
  

  // Fetch vendor products
  useEffect(()=>{
      setLoading(true);
      try {
        fetchVenderProducts();
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
  },[showToast]);

  return (
    <Box px={10} py={3}>
      <Text fontSize={'20px'} fontWeight={'600'} letterSpacing={1} textTransform={'uppercase'}>Analytics</Text>

      <Grid templateColumns={'repeat(3,1fr)'} h={'100px'} gap={10} mt={10}>
        <Flex align={'center'} borderRadius={'md'} border={'1px solid'} borderColor={'gray.100'} p={3} gap={4}>
          <Flex align={'center'} justify={'center'} borderRadius={'md'} bg={'gray.100'} w={'90px'} h={'full'} color={'#222'}>
            <RiMoneyRupeeCircleLine fontSize={'30px'}/>
          </Flex>
          <Box>
            <Text fontSize={'15px'} color={'gray.500'}>Total Sales</Text>
            <Text fontSize={'20px'} mt={1} fontWeight={'600'}>Rs. {totalAmountAllOrders.toFixed(2)}</Text>
          </Box>
        </Flex>

        <Flex align={'center'} borderRadius={'md'} border={'1px solid'} borderColor={'gray.100'} p={3} gap={4}>
          <Flex align={'center'} justify={'center'} borderRadius={'md'} bg={'gray.100'} w={'90px'} h={'full'} color={'#222'}>
            <BsBoxSeam fontSize={'30px'}/>
          </Flex>
          <Box>
            <Text fontSize={'15px'} color={'gray.500'}>Total Orders</Text>
            <Text fontSize={'20px'} mt={1} fontWeight={'600'}>{totalProductsOrdered}</Text>
          </Box>
        </Flex>

        <Flex align={'center'} borderRadius={'md'} border={'1px solid'} borderColor={'gray.100'} p={3} gap={4}>
          <Flex align={'center'} justify={'center'} borderRadius={'md'} bg={'gray.100'} w={'90px'} h={'full'} color={'#222'}>
            <FiInbox fontSize={'30px'}/>
          </Flex>
          <Box>
            <Text fontSize={'15px'} color={'gray.500'}>Total Products</Text>
            <Text fontSize={'20px'} mt={1} fontWeight={'600'}>{products.length}</Text>
          </Box>
        </Flex>
      </Grid>


      <Box borderRadius={'md'} border={'1px solid'} borderColor={'gray.100'} p={5} py={3} mt={10}>
        <Text fontSize={'20px'} fontWeight={'600'}>Recent Orders</Text>
        <Text fontSize={'14px'} color={'gray.500'}>Delivery Status and Receipt</Text>

        <TableContainer mt={5} mb={5}>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Products</Th>
                <Th>Receipt</Th>
                <Th>Pirce</Th>
                <Th>Selling Price</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ordersData.slice(0,5).map((order, i) => (
                <React.Fragment key={i}>
                  {order.productDetails.map((product, j) => (
                    <Tr key={`${i}-${j}`}>
                      <Td fontSize={'13px'}>{format(new Date(order.createdAt), "EEE, do yy")}</Td>
                      <Td>
                        <Flex align={'center'} gap={4}>
                          <Box w={'40px'} h={'40px'} borderRadius={'md'} bgColor={'gray.200'} overflow={'hidden'}>
                            <Image src={product.image} alt={product.name} w={'full'} h={'full'} objectFit={'cover'}/>
                          </Box>
                          <Flex flexDir={'column'}>
                            <Text fontSize={'15px'} fontWeight={'500'}>{product.name}</Text>
                            <Text fontSize={'13px'} color={'gray.500'} textTransform={'capitalize'}>{product.category}</Text>
                          </Flex>
                        </Flex>
                      </Td>
                      <Td fontSize={'13px'} fontWeight={'500'}>
                        <Link as={RouterLink} to={order.receipt} bg={'gray.100'} py={1} px={3} borderRadius={'md'} color={'blue.500'}>#{order._id.slice(-4)}</Link>
                      </Td>
                      <Td fontSize={'13px'}>Rs. {product.price.toFixed(2)} x {product.quantity}</Td>
                      <Td fontSize={'13px'}>Rs. {(product.price * product.quantity).toFixed(2)}</Td>
                      <Td fontSize={'13px'} textTransform={'capitalize'}><Badge>{order.status}</Badge></Td>
                    </Tr>
                  ))}
                </React.Fragment>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Text as={RouterLink} to={'/dashboard/orders'} fontSize={'15px'} color={'blue.500'} px={5}>See more</Text>
      </Box>

    </Box>
  )
}

export default Dashboard