import { useEffect, useState } from "react"
import useShowToast from "../hooks/useShowToast";
import { Box, Button, Divider, Flex, Grid, Image, Link, Spinner, Text } from "@chakra-ui/react";
import { TiLocationArrow } from "react-icons/ti";
import { Link as RouterLink } from "react-router-dom";
import { format } from "date-fns";

const MyOrders = () => {
    const showToast = useShowToast();
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top when component mounts or updates
    }, []);
    
    useEffect(()=>{
        const fetchOrders = async() => {
            setLoading(true);
            try {
                const res = await fetch('/api/orders/get-orders');
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setOrderData(data);
            } catch (error) {
                console.log(error);
                showToast("Error", error, "error");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    },[]);
    
  return (
    <>
    <Box p={10} bgColor={'gray.50'}>
        <Text fontSize={'20px'} fontWeight={'500'} mb={5}>MY ORDERS</Text>

        {loading && (
            <Flex align={'center'} justify={'center'} minH={'70vh'}>
                <Spinner color="gray.500" size={'xl'}/>
            </Flex>
        )}

        {orderData.length === 0 && !loading && (
            <Flex align={'center'} justify={'center'} minH={'70vh'}>
                <Text fontSize={'20px'} color={'gray.500'}>Start shopping to fill your order history!</Text>
            </Flex>
        )}
        
        {orderData.length > 0 && (
            <Grid templateColumns={'1fr 1fr'} gap={10} maxH={'400vh'} overflowY={'scroll'} className="order-list">
                {orderData.map((order) => (
                    <Box key={order._id} bg={'white'} height={'fit-content'} boxShadow={'sm'} p={7} borderRadius={'md'}>
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
                            {order.status === 'pending' && <Text color={'yellow.400'}>{order.status}</Text>}
                            {order.status === 'received' && <Text color={'orange.500'}>{order.status}</Text>}
                            {order.status === 'at depot' && <Text color={'orange'}>{order.status}</Text>}
                            {order.status === 'in transit' && <Text color={'red'}>{order.status}</Text>}
                            {order.status === 'out of delivery' && <Text color={'red.500'}>{order.status}</Text>}
                            {order.status === 'delivered' && <Text color={'green.500'}>{order.status}</Text>}
                        </Flex>

                        <Text fontSize={'14px'} color={'gray.500'} ml={4} my={2}>Item : {order.productDetails.length}</Text>

                        <Divider borderColor={'gray.200'}/>

                        {order.productDetails.map((product) => (
                            <Flex justify={'space-between'} borderBottom={'1px solid '} borderColor={'gray.200'} py={5} gap={5}>
                                <Box bg={'gray.200'} w={'80px'} height={'115px'} overflow={'hidden'} borderRadius={'md'}>
                                    <Image src={product.image} w={'full'} h={'full'} objectFit={'cover'}/>
                                </Box>

                                <Flex flexDir={'column'} justify={'center'} gap={1} w={'400px'}>
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

                        <Divider borderColor={'gray.200'} my={5}/>

                        <Flex display={'inline-block'}>
                            <Link as={RouterLink} to={`/my-order/${order._id}`} display={'flex'} alignItems={'center'} justifyItems={'center'} gap={1} bgColor={'blue.500'} color={'white'} fontSize={'15px'} py={2} px={4} borderRadius={'md'} _hover={{bgColor: 'blue.600'}}>
                                <TiLocationArrow fontSize={'17px'}/>
                                <Text>Track Order</Text>
                            </Link>
                        </Flex>
                    </Box>
                ))}
            </Grid>
        )}
    </Box>
    </>
  )
}

export default MyOrders