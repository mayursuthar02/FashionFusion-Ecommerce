import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Badge, Box, Divider, Flex, Grid, Image, Spinner, Step, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useSteps } from "@chakra-ui/react";
import { MdOutlinePayments } from "react-icons/md";
import { format } from "date-fns";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

import BASEURL from "../config/baseURL";

const steps = [
    { title: 'received'},
    { title: 'at depot'},
    { title: 'in transit'},
    { title: 'out of delivery'},
    { title: 'delivered'},
]

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  const user = useRecoilValue(userAtom);

// Mapping order status to step index
  const statusToIndex = {
      'pending': 0,
      'received': 1,
      'at depot': 2,
      'in transit': 3,
      'out of delivery': 4,
      'delivered': 5,
  };
  const stepIndex = statusToIndex[order?.status] || 0;
  
//   Scroll Top
  useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top when component mounts or updates
  }, []);

//   Fetch order
  useEffect(() => {
    const fetchOrder = async () => {
        setLoading(true);
      try {
        const res = await fetch(`${BASEURL}/api/orders/${orderId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setOrder(data);
      } catch (error) {
        console.log(error);
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, showToast]);

  return (
    <>
        {loading && !order && (
            <Flex align={'center'} justify={'center'} minH={'90vh'} bgColor={'gray.100'}>
                <Spinner color="gray.300" size={'xl'}/>
            </Flex>
        )}

        {order && !loading && (
            <Box px={10} py={10} minH={'100vh'}>
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

                <Flex>
                    <Box p={3} px={6} borderRight={'1px solid'} borderColor={'gray.200'}>
                        <Text fontSize={'14px'} color={'gray.500'}>Last updated</Text>
                        <Text fontSize={'15px'} mt={1}>{format(order.updatedAt, "MMM d, h:mm a")}</Text>
                    </Box>
                    <Box p={3} px={6} borderRight={'1px solid'} borderColor={'gray.200'}>
                        <Text fontSize={'14px'} color={'gray.500'}>Customer</Text>
                        <Text fontSize={'15px'} mt={1}>{user.fullName ? user.fullName : user.businessName}</Text>
                    </Box>
                    <Box p={3} px={6}>
                        <Text fontSize={'14px'} color={'gray.500'}>Payment method</Text>
                        <Flex fontSize={'15px'} align={'center'} gap={2}>
                            <Text textTransform={'uppercase'} fontWeight={'700'} mt={1}>{order.paymentDetails.brand}</Text>
                            <Text fontSize={'15px'} mt={1}>{order.paymentDetails.last4Digit}</Text>
                        </Flex>
                    </Box>
                </Flex>

                <Divider borderColor={'gray.200'} my={5}/>

                <Box>
                    <Text fontSize={'15px'} fontWeight={'600'} textTransform={'uppercase'} pb={4} borderBottom={'1px solid'} borderColor={'gray.200'}>Track Order</Text>

                    <Stepper index={stepIndex} scolorScheme='blue' gap='0' mt={10} px={10}>
                        {steps.map((step, index) => (
                            <Step key={index}>
                                <StepIndicator>
                                    <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
                                    </StepIndicator>
                    
                                    <Box flexShrink='0' fontSize={'15px'} ml={3} textTransform={'capitalize'}>
                                        <StepTitle>{step.title}</StepTitle>
                                    </Box>
                    
                                    <StepSeparator />
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Divider borderColor={'gray.200'} mb={5} mt={10}/>

                <Grid templateColumns={'.5fr 1fr'} gap={'40px'} mt={10}>
                    <Box>
                        <Text fontSize={'15px'} fontWeight={'600'} textTransform={'uppercase'} pb={3} borderBottom={'1px solid'} borderColor={'gray.200'}>Customer Details</Text>
                        
                        <Box mt={3}>
                            <Flex w={'400px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>Name</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>{user.fullName ? user.fullName : user.businessName}</Text>
                            </Flex>
                            <Flex w={'400px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>Address Line 1</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>{order.billing_details.address?.line1}</Text>
                            </Flex>
                            <Flex w={'400px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>Address Line 2</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>{order.billing_details.address?.line2}</Text>
                            </Flex>
                            <Flex w={'400px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>City</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>{order.billing_details.address?.city}</Text>
                            </Flex>
                            <Flex w={'400px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>State</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>{order.billing_details.address?.state}</Text>
                            </Flex>
                            <Flex w={'400px'} align={'center'} justify={'space-between'} mb={2}>
                                <Text fontSize={'16px'} fontWeight={'500'}>PinCode</Text>
                                <Text fontSize={'16px'} color={'gray.500'}>{order.billing_details.address?.postal_code}</Text>
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
  );
};

export default OrderDetailsPage;
