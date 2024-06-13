import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Flex,
  Box,
  Text,
  Image,
  Grid,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {loadStripe} from '@stripe/stripe-js';

import { MdOutlineDeleteOutline } from "react-icons/md";

import cartAtom from "../atoms/cartAtom";
import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";

import FetchCartItems from "../helpers/FetchCartItems";
import useShowToast from "../hooks/useShowToast";


const CartDrawer = ({ isOpenCart, onCloseCart }) => {
  const [cartItems, setCartItems] = useRecoilState(cartAtom);
  const user = useRecoilValue(userAtom);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const showToast = useShowToast();

  const fetchCartItemsFunc = FetchCartItems();

  // Fetch cart items
  useEffect(() => {
    setLoading(true);
    try {
      if (user) {
        fetchCartItemsFunc();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update Qty
  const updateQty = async (cartId, quantity) => {
    try {
      const res = await fetch("/api/carts/update-quantity", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, quantity }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // + Qty
  const increaseQty = async (cartId, qty) => {
    const newQty = qty + 1;
    const updatedItemsQty = cartItems.map((prevItem) => {
      if (prevItem._id === cartId) {
        return {
          ...prevItem,
          quantity: newQty,
        };
      }
      return prevItem;
    });
    setCartItems(updatedItemsQty);
    updateQty(cartId, newQty);
  };
  
  
  // - Qty
  const decreaseQty = async (cartId, qty) => {
    let newQty = qty - 1;
    if (newQty < 1) {
      newQty = 1;
    }
    const updatedItemsQty = cartItems.map((prevItem) => {
      if (prevItem._id === cartId) {
        return {
          ...prevItem,
          quantity: newQty,
        };
      }
      return prevItem;
    });
    setCartItems(updatedItemsQty);
    updateQty(cartId, newQty);
  };
  

  // Remove cart item
  const RemoveCartItem = async(cartId) => {
    setRemoveLoading(true);
    try {
      const res = await fetch('/api/carts/delete-cart', {
        method: "DELETE",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({cartId})
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      fetchCartItemsFunc();
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setRemoveLoading(false);
      }, 200);
    }
  }

  // For Total Price, color, qty and size
  const processCartItems = (items) => {
    const uniqueColors = new Set();
    const uniqueSizes = new Set();
    let totalPrice = 0;
    let totalDiscount = 0;
    let totalQuantity = 0;

    items.forEach((item) => {
      uniqueColors.add(item.productId.color);
      uniqueSizes.add(item.size);
      
      const discountedPrice = item.productId.price * (1 - item.productId.discount / 100);
      totalPrice += discountedPrice * item.quantity;
      totalDiscount += item.productId.discount;
      totalQuantity += item.quantity;
    });

    return {
      colors: Array.from(uniqueColors),
      sizes: Array.from(uniqueSizes),
      totalPrice,
      totalDiscount,
      totalQuantity
    };
  };
  const { colors, sizes, totalPrice, totalQuantity } = processCartItems(cartItems);


  const handleStripePayment = async() => {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    const stripe = await loadStripe(publishableKey);
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/payments/stripe/checkout', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({products: cartItems})
      });
      const session = await res.json();
      if (session.error) {
        showToast("Error", session.error, "error");
        console.log(session.error);
        return;
      };
      console.log(session)
      
      const result = stripe.redirectToCheckout({
        sessionId: session.id
      });
      if (result.error) {
        showToast("Error", result.error, "error");
        console.log(result.error);
        alert(result.error);
      }
      console.log(session)
    } catch (error) {
      console.log(error);
    } finally {
      setCheckoutLoading(false);
    }
  }
  

  return (
    <>
      <Drawer
        isOpen={isOpenCart}
        placement="right"
        onClose={onCloseCart}
        size={"sm"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton color={"white"} mt={1} />
          <DrawerHeader
            color={"white"}
            bgColor={"black"}
            fontWeight={"400"}
            letterSpacing={2}
            fontSize={"16px"}
          >
            SHPPING CART
          </DrawerHeader>

          {removeLoading && (
            <>
              <Box position={'absolute'} w={'full'} h={'full'} bgColor={'black'} zIndex={1} opacity={.5}></Box>
              <Box position={'absolute'} top={'40%'} left={'50%'} zIndex={2}>
                <Spinner size={'xl'} color="gray.100"/>
              </Box>
            </>
          )}

          <DrawerBody>
            <Box mt={2} position={'relative'} h={'50vh'}>
              {cartItems.map((item) => (
                <Flex
                  key={item._id}
                  align={"center"}
                  gap={4}
                  borderBottom={"1px solid"}
                  borderColor={"gray.200"}
                  py={4}
                >
                  <Box
                    width={"105px"}
                    h={"110px"}
                    borderRadius={"4px"}
                    bgColor={"gray.200"}
                    overflow={"hidden"}
                  >
                    <Image
                      src={item.productId.images[0]}
                      w={"full"}
                      h={"full"}
                      objectFit={"cover"}
                    />
                  </Box>
                  <Flex flexDir={"column"} gap={2} w={"full"}>
                    <Flex justify={"space-between"}>
                      <Box>
                        <Text color={"gray.500"} fontSize={"15px"}>
                          {item.productId.name}
                        </Text>
                        <Text mt={1} fontSize={"14px"} fontWeight={"600"} >
                          {item.productId.color}, {item.size}
                        </Text>
                      </Box>
                      <Grid
                        height={"30px"}
                        w={"30px"}
                        placeContent={"center"}
                        borderRadius={"md"}
                        cursor={"pointer"}
                        bgColor={"white"}
                        color={"gray.500"}
                        fontSize={"20px"}
                        _hover={{ bgColor: "gray.100" }}
                        onClick={()=> RemoveCartItem(item._id)}
                      >
                        <MdOutlineDeleteOutline />
                      </Grid>
                    </Flex>

                    <Flex align={"end"} justify={"space-between"} w={"full"}>
                      <Flex align={"center"}>
                        <Flex
                          align={"center"}
                          justify={"center"}
                          bgColor={"gray.100"}
                          w={"31px"}
                          h={"31px"}
                          color={"gray.500"}
                          cursor={"pointer"}
                          _hover={{ bgColor: "gray.200" }}
                          onClick={() => decreaseQty(item._id, item.quantity)}
                        >
                          -
                        </Flex>
                        <Flex
                          align={"center"}
                          justify={"center"}
                          bgColor={"gray.100"}
                          w={"31px"}
                          h={"31px"}
                          fontSize={"14px"}
                          fontWeight={600}
                        >
                          {item.quantity}
                        </Flex>
                        <Flex
                          align={"center"}
                          justify={"center"}
                          bgColor={"gray.100"}
                          w={"31px"}
                          h={"31px"}
                          color={"gray.500"}
                          cursor={"pointer"}
                          _hover={{ bgColor: "gray.200" }}
                          onClick={() => increaseQty(item._id, item.quantity)}
                        >
                          +
                        </Flex>
                      </Flex>
                      <Box>
                        <Text
                          style={{ textDecoration: "line-through" }}
                          fontSize={"12px"}
                          color={"gray.500"}
                        >
                          Rs. {item.productId.price}.00
                        </Text>
                        <Text fontSize={"15px"} fontWeight={"600"}>
                          Rs.{" "}
                          {Math.floor(
                            item.productId.price -
                              (item.productId.price * item.productId.discount) /
                                100
                          )}
                          .00
                        </Text>
                      </Box>
                    </Flex>
                  </Flex>
                </Flex>
              ))}

              {cartItems.length === 0 && (
              <Flex align={'center'} justify={'center'}>
                <Text mt={'200px'} fontSize={'20px'} color={'gray.500'}>No Cart Items</Text>
              </Flex>
              )}
            </Box>
          </DrawerBody>

          <DrawerFooter py={5} borderTop={"1px solid"} borderColor={"gray.200"}>
            <Flex flexDirection={"column"} w={"full"}>
              <Box mb={5}>
                <Flex gap={2} align={"center"} mt={1} justify={"space-between"}>
                  <Text fontSize={"15px"} fontWeight={"500"}>
                    Color
                  </Text>
                  <Text fontSize={"16px"} fontWeight={"500"} textTransform={'capitalize'}>
                    {colors.join(', ')}
                  </Text>
                </Flex>
                <Flex gap={2} align={"center"} mt={2} justify={"space-between"}>
                  <Text fontSize={"15px"} fontWeight={"500"}>
                    Size
                  </Text>
                  <Text fontSize={"16px"} fontWeight={"500"}>
                    {sizes.join(', ')}
                  </Text>
                </Flex>
                <Flex gap={2} align={"center"} justify={"space-between"} mt={2}>
                  <Text fontSize={"15px"} fontWeight={"500"}>
                    Qty
                  </Text>
                  <Text fontSize={"16px"} fontWeight={"500"}>
                    {totalQuantity}
                  </Text>
                </Flex>
                <Flex align={"center"} justify={"space-between"} mt={2}>
                  <Text fontSize={"15px"} fontWeight={"500"}>
                    Total
                  </Text>
                  <Text fontSize={"18px"} fontWeight={"500"}>
                    Rs. {totalPrice.toFixed(2)}
                  </Text>
                </Flex>
              </Box>

              <Button
                borderRadius={"2px"}
                w={"full"}
                py={6}
                fontSize={"15px"}
                color={"white"}
                bgColor={"black"}
                _hover={{ bgColor: "#111" }}
                fontWeight={"400"}
                letterSpacing={2}
                onClick={handleStripePayment}
                isLoading={checkoutLoading}
              >
                CHECK OUT
              </Button>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CartDrawer;
