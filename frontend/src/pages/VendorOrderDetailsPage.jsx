import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Badge, Box, Divider, Flex, Grid, Image, Select, Spinner, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from "@chakra-ui/react";
import { format } from "date-fns";

import { MdOutlinePayments } from "react-icons/md";

import useShowToast from "../hooks/useShowToast";

import { baseURL as BASEURL } from "../config/baseURL";

const VendorOrderDetailsPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
    const showToast = useShowToast();

    // Status object
    const statusObj = [
        { title: 'Pending', value: 'pending'},
        { title: 'Received', value: 'received'},
        { title: 'At Depot', value: 'at depot'},
        { title: 'In Transit', value: 'in transit'},
        { title: 'Out of Delivery', value: 'out of delivery'},
        { title: 'Delivered', value: 'delivered'},
    ]
    
    // Scroll top
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top when component mounts or updates
    }, []);
    
    // Fetch order data
    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
          try {
            const res = await fetch(`${BASEURL}/api/orders/vendor/${orderId}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (data.error) {
              showToast("Error", data.error, "error");
              return;
            }
            setOrder(data);
            setStatus(data.status);
          } catch (error) {
            console.log(error);
            showToast("Error", error, "error");
          } finally {
            setLoading(false);
          }
        };
        fetchOrder();
    }, [status]);

    // Handle Order status
    const handleOrderStatus = async(e) => {
        const value = e.target.value;
        setUpdateStatusLoading(true);
        
        try {
            const res = await fetch(`${BASEURL}/api/orders/update-status/${orderId}`, {
                method: "PUT",
                headers: {"Content-Type":"application/json"},
                credentials: 'include',
                body: JSON.stringify({status: value})
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", "Status updated", "success");
        } catch (error) {
            console.log(error);    
            showToast("Error", error, "error");
        } finally {
            setUpdateStatusLoading(false);
            setStatus(value);
        }
    }
    
    // Order status
    const orderStatus = [
        {status: 'pending', color: 'yellow'},
        {status: 'received', color: 'orange'},
        {status: 'at depot', color: 'red'},
        {status: 'in transit', color: 'purple'},
        {status: 'out of delivery', color: 'blue'},
        {status: 'delivered', color: 'green'},
    ];
    
  return (
    <>
        {loading || !order && (
            <Flex align={'center'} justify={'center'} minH={'90vh'} bgColor={'gray.100'}>
                <Spinner color="gray.300" size={'xl'}/>
            </Flex>
        )}

        {order && !loading && (
            <Box px={10} py={10} minH={'100vh'}>
                <Flex align={'center'} justify={'space-between'}> 
                    <Flex align={'center'} gap={3}>
                      <Avatar src={order.userId.profilePic}/>
                      <Text fontSize={'20px'} fontWeight={'500'}>{order.userId.fullName ? order.userId.fullName : order.userId.businessName}</Text>
                    </Flex>
                    
                    {orderStatus.map((orderS) => (
                        order.status === orderS.status && <Badge key={orderS.status} colorScheme={orderS.color} fontSize={'15px'}>{order.status}</Badge>
                    ))}
                </Flex>

                <Divider borderColor={'gray.200'} my={6}/>

                <Flex align={'center'} justify={'space-between'}>
                    <Box>
                        <Flex align={'center'} gap={2} fontSize={'15px'} fontWeight={'500'} color={'gray.500'}><MdOutlinePayments/> PAYMENT</Flex>
                        <Text fontSize={'25px'} fontWeight={'500'}>Rs. {order.totalAmount.toFixed(2)} INR</Text>
                    </Box>
                    <Flex flexDir={'column'} align={'end'} gap={2}>
                        <Text color={'gray.500'} fontSize={'13px'}>{order.paymentDetails.paymentId}</Text>
                        <Badge colorScheme="green">{order.paymentDetails.payment_status}</Badge>
                    </Flex>
                </Flex>

                <Divider borderColor={'gray.200'} my={5}/>

                <Grid templateColumns={'1fr .1fr .2fr'} gap={'40px'} mt={10} px={10}>
                    <Box>
                        <Flex>
                            <Box p={3} pr={6} borderRight={'1px solid'} borderColor={'gray.200'} h={'fit-content'}>
                                <Text fontSize={'14px'} color={'gray.500'}>Last updated</Text>
                                <Text fontSize={'15px'} mt={1}>{format(order.updatedAt, "MMM d, h:mm a")}</Text>
                            </Box>
                            <Box p={3} px={6} borderRight={'1px solid'} borderColor={'gray.200'} h={'fit-content'}>
                                <Text fontSize={'14px'} color={'gray.500'}>Customer</Text>
                                <Text fontSize={'15px'} mt={1}>{order.userId.fullName ? order.userId.fullName : order.userId.businessName}</Text>
                            </Box>
                            <Box p={3} px={6} h={'fit-content'}>
                                <Text fontSize={'14px'} color={'gray.500'}>Payment method</Text>
                                <Flex fontSize={'15px'} align={'center'} gap={2}>
                                    <Text textTransform={'uppercase'} fontWeight={'700'} mt={1}>{order.paymentDetails.brand}</Text>
                                    <Text fontSize={'15px'} mt={1}>{order.paymentDetails.last4Digit}</Text>
                                </Flex>
                            </Box>
                        </Flex>

                        <Text fontSize={'15px'} fontWeight={'600'} textTransform={'uppercase'} pb={3} borderBottom={'1px solid'} borderColor={'gray.200'} mt={10}>Update Status</Text>
                        <Box w={'250px'} position={'relative'}>
                            <Box  position={'absolute'} top={'25%'} left={'45%'} >
                                {updateStatusLoading && <Spinner size={'sm'} color="gray.500"/>}
                            </Box>
                            <Select mt={5} value={status} onChange={e=> handleOrderStatus(e)} cursor={'pointer'} isDisabled={updateStatusLoading}> 
                                {statusObj.map((el) => (
                                    <option key={el.value} value={el.value}>{el.title}</option>
                                ))}
                            </Select>
                        </Box>
                    </Box>
                    
                    <Box>
                        <Text fontSize={'15px'} fontWeight={'600'} textTransform={'uppercase'} pb={3} borderBottom={'1px solid'} borderColor={'gray.200'}>Payment Details</Text>
                        
                        <Box mt={3}>
                            <Flex w={'430px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>Payment Id</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>{order.paymentDetails.paymentId}</Text>
                            </Flex>
                            <Flex w={'430px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>Payment Method</Text>
                                <Text fontSize={'16px'} color={'gray.500'} textTransform={'capitalize'}>{order.paymentDetails.payment_method_type}</Text>
                            </Flex>
                            <Flex w={'430px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>Brand</Text>
                                <Text fontSize={'16px'} color={'gray.500'} textTransform={'capitalize'}>{order.paymentDetails.brand}</Text>
                            </Flex>
                            <Flex w={'430px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>Card Number</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>****{order.paymentDetails.last4Digit}</Text>
                            </Flex>
                            <Flex w={'430px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>Payment Status</Text>
                                <Text fontSize={'16px'} color={'gray.500'}textTransform={'capitalize'}>{order.paymentDetails.payment_status}</Text>
                            </Flex>
                        </Box>
                    </Box>

                    <Box>
                        <Text fontSize={'15px'} fontWeight={'600'} textTransform={'uppercase'} pb={3} borderBottom={'1px solid'} borderColor={'gray.200'}>Customer Details</Text>
                        
                        <Box mt={3}>
                            <Flex w={'350px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>Name</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>{order.userId.fullName ? order.userId.fullName : order.userId.businessName}</Text>
                            </Flex>
                            <Flex w={'350px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>Email</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>{order.email}</Text>
                            </Flex>
                            <Flex w={'350px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>Address Line 1</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>{order.billing_details?.address?.line1 || ""}</Text>
                            </Flex>
                            <Flex w={'350px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>Address Line 2</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>{order.billing_details?.address?.line2 || ""}</Text>
                            </Flex>
                            <Flex w={'350px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>City</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>{order.billing_details?.address?.city || ""}</Text>
                            </Flex>
                            <Flex w={'350px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>State</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>{order.billing_details?.address?.state || ""}</Text>
                            </Flex>
                            <Flex w={'350px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>PinCode</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>{order.billing_details?.address?.postal_code || ""}</Text>
                            </Flex>
                        </Box>
                    </Box>
                </Grid>

                <Divider borderColor={'gray.200'} my={10}/>

                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th color={'black'} width={'1100px'}>ITEMS</Th>
                                <Th color={'black'}>QTY</Th>
                                <Th color={'black'}>UNIT PRICE</Th>
                                <Th color={'black'}>AMOUNT</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {order.productDetails.map((product,i) => (
                                <Tr key={i}>
                                    <Td>
                                        <Flex align={'center'} gap={5}>
                                            <Box w={'60px'} h={'60px'} borderRadius={'md'} overflow={'hidden'} bgColor={'gray.100'}>
                                                <Image src={product.image} w={'full'} h={'full'} objectFit={'cover'}/>
                                            </Box>
                                            <Text fontSize={'15px'} color={'gray.500'}>{product.name}</Text>
                                        </Flex>
                                    </Td>
                                    <Td>{product.quantity}</Td>
                                    <Td>Rs. {product.price.toFixed(2)}</Td>
                                    <Td>Rs. {(product.price * product.quantity).toFixed(2)}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th></Th>
                                <Th></Th>
                                <Th fontSize={'15px'} color={'black'}>Total</Th>
                                <Th fontSize={'15px'} color={'black'}>Rs. {order.totalAmount.toFixed(2)}</Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>

                <Divider borderColor={'gray.200'} mt={1} mb={5}/>
                
            </Box>
        )}
    </>
  )
}

export default VendorOrderDetailsPage