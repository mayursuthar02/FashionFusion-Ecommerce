import React, { useEffect, useState } from 'react'
import { Avatar, Box, Button, Divider, Flex, IconButton, Image, Link, Skeleton, Text, filter, useDisclosure } from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import useShowToast from '../hooks/useShowToast';
import useAddWishlist from '../hooks/useAddWishlist';
import FetchCartItems from '../helpers/FetchCartItems';
import WriteReview from '../components/WriteReview';
import userAtom from '../atoms/userAtom';
import { useRecoilValue } from 'recoil';

import { IoShareSocialSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import { MdKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { PiCoatHangerBold } from "react-icons/pi";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { MdForwardToInbox } from "react-icons/md";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { TbMessage2 } from "react-icons/tb";

import { formatDistanceToNow } from 'date-fns'

import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';

// Image Import
import img1 from '../assets/Logo Payment Method/1.png'
import img2 from '../assets/Logo Payment Method/2.png'
import img3 from '../assets/Logo Payment Method/3.png'
import img4 from '../assets/Logo Payment Method/4.png'
import img5 from '../assets/Logo Payment Method/5.png'
import img6 from '../assets/Logo Payment Method/6.png'
import img7 from '../assets/Logo Payment Method/7.png'
import img8 from '../assets/Logo Payment Method/8.png'

const paymentImg = [img1, img2, img3, img4, img5, img6, img7, img8];

const ProductDetails = () => {
  const {productId,category,subCategory,name} = useParams();
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);
  const [similerProducts, setSimilerProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [callBackFunction, setCallBackFunction] = useState(false);
  const [seeReviews, setSeeReviews] = useState(2);
  const [loading, setLoading] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [addToWishlistLoading, setAddToWishlistLoading] = useState(false);
  const [heartIcon, setHeartIcon] = useState(<FaRegHeart/>);
  const user = useRecoilValue(userAtom);
  const addWishlist = useAddWishlist();
  // Input 
  const [size, setSize] = useState('Select size');
  
  let splideRef = null;
  const showToast = useShowToast();
  const fetchCartItemsFunc = FetchCartItems();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Scroll top
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when component mounts or updates
  }, []);

  // Check if product add in whishlist or not and change icon
  useEffect(()=>{
    if (user?.wishlist.includes(productId)) {
      setHeartIcon(<FaHeart fontSize={'20px'}/>);
    }else {
      setHeartIcon(<FaRegHeart fontSize={'20px'}/>);
    }
  },[user]);

  // Fetch product Details data
  useEffect(() => {
    const getProductDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/get-product-details/${productId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setProduct(data);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };
  
    getProductDetails();
  }, [productId]);

  // Fetch similer product by name
  useEffect(() => {
    const getProductsByName = async () => {
      if (!product) return; // Ensure product is loaded first
      try {
        const res = await fetch(`/api/products/get-product/${product.name}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        const filterProduct = data.filter((d) => d._id !== product._id);
        setSimilerProducts(filterProduct);
      } catch (error) {
        console.log(error);
      }
    };
  
    getProductsByName();
  }, [product]);
  
  // Fetch all reviews data
  useEffect(() => {
    const getAllProductReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/by-product/${productId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setReviews(data);
      } catch (error) {
        console.log(error);
      }
    };
  
    getAllProductReviews();
  }, [productId, callBackFunction]);
    
  
  // For slider image
  const handleUp = () => {
    if (splideRef) {
      splideRef.go('<');
    }
  };
  
  // For slider image
  const handleDown = () => {
    if (splideRef) {
      splideRef.go('>');
    }
  };

  // Add to cart
  const addToCartFunc = async() => {
    if (size == 'Select size') {
      showToast("Error", "Please select size", "error");
      return;
    }
    if (!productId) {
      showToast("Error", "Something wrong", "error");
      return;
    }

    setAddToCartLoading(true);    
    try {
      const res = await fetch('/api/carts/add-to-cart', {
        method: 'POST',
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({productId,size})
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Product add to cart", "success");
    } catch (error) {
      console.log(error);
    } finally {
      setAddToCartLoading(false);
      fetchCartItemsFunc();
    }
  }

  // Add to wishlist
  const handleAddToWishlist = () => {
    setAddToWishlistLoading(true);
    addWishlist(productId);
    
    setTimeout(() => {
      setAddToWishlistLoading(false);
    }, 500);
  }
  
  if (!product || loading) {
    return (
      <>
        <Box bg={'gray.100'} px={'50px'} py={5}>
          <Flex align={'center'} justifyContent={'space-between'}>
            <Skeleton h={5} w={'400px'} borderRadius={'10px'}/>
            <Skeleton h={5} w={'60px'} borderRadius={'10px'}/>
          </Flex>
          <Flex align={'center'} justifyContent={'center'} my={4}>
            <Skeleton h={9} w={'300px'} borderRadius={'10px'}/>
          </Flex>
          <Flex align={'center'} justifyContent={'space-between'}>
            <Skeleton h={5} w={'200px'} borderRadius={'10px'}/>
            <Skeleton h={5} w={'70px'} borderRadius={'10px'}/>
          </Flex>
        </Box>

        <Box display={'grid'} gridTemplateColumns={'1fr 1fr'} gap={1} minH={'100vh'} px={'50px'}>
          <Flex mt={10} gap={5} px={10}>
            <Flex flexDir={'column'} gap={3}>
              {[1,2,3,4].map((_,i) =>(
                <Skeleton width={'110px'} height={'150px'} borderRadius={'md'}/>
              ))}
            </Flex>

            <Skeleton width={'510px'} height={'700px'} borderRadius={'md'}/>
          </Flex>
          
          <Box py={'50px'}>
            <Skeleton h={8}/>
            <Skeleton h={4} w={'100px'} mt={5}/>
            <Flex align={'center'} mt={3} gap={2}>
              <Skeleton h={'70px'} w={'70px'} borderRadius={'md'}/>
            </Flex>
            
            <Skeleton h={4} w={'100px'} mt={5}/>

            <Flex align={'center'} mt={3} gap={2}>
              {[1,2,3,4,5].map((_,i) => (
                <Skeleton key={i} h={'40px'} w={'45px'} borderRadius={'md'}/>
              ))}
            </Flex>

            <Skeleton h={3} w={'80px'} mt={5}/>

            <Flex align={'center'} gap={3} mt={'60px'}>
              <Skeleton w={'250px'} h={'45px'} borderRadius={'md'}/>
              <Skeleton w={'190px'} h={'45px'} borderRadius={'md'}/>
              <Skeleton w={'190px'} h={'45px'} borderRadius={'md'}/>
            </Flex>
            <Flex align={'center'} gap={3} mt={'60px'}>
              {[1,2,3].map((_,i) => (
                <Skeleton key={i} w={'200px'} h={'45px'} borderRadius={'md'}/>
              ))}
            </Flex>
            
            <Skeleton w={'250px'} mt={5} h={6} borderRadius={'md'}/>

            <Box display={'grid'} gridTemplateColumns={'repeat(8,1fr)'} mt={5} gap={2}>
              {[1,2,3,4,5,6,7,8].map((_,i) => (
                <Skeleton key={i} h={'60px'} borderRadius={'md'}/>
              ))}
            </Box>

            <Skeleton w={'100px'} mt={10} h={6} borderRadius={'md'}/>

            <Skeleton mt={5} h={'100px'} borderRadius={'md'}/>
            
          </Box>
        </Box>
      </>
    )
  }
  
  return (
    <>
      <Box bg={'gray.100'} px={'50px'} py={5}>
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <Flex align={'center'} gap={1} fontSize={'15px'} color={'gray.500'}>
            <Link as={RouterLink} to={`/${category}`}>{category}</Link>
            <span>/</span>
            <Link as={RouterLink} to={`/${category}/${subCategory}`} >{subCategory}</Link>
            <span>/</span>
            <Link as={RouterLink} color={'gray.900'}>{name}</Link>
          </Flex>
          
          <Flex alignItems={'center'} gap={1} color={'gray.500'} fontSize={'15px'}>
            <IoShareSocialSharp/>
            <Text>Share</Text>
          </Flex>
        </Flex>

        <Text my={2} fontSize={'30px'} fontWeight={'600'} textTransform={'uppercase'} textAlign={'center'} letterSpacing={2}>{product.brandName}</Text>

        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <Flex alignItems={'center'} gap={2} fontSize={'15px'}>
            <Flex alignItems={'center'} color={'orange'} gap={1}>
              {[1,2,3,4,5].map((_,i) => (
                <FaStar key={i}/>
              ))}
            </Flex>
            <Text color={'gray.500'} fontSize={'15px'}>{reviews.length} reviews</Text>
          </Flex>

          <Flex color={'gray.500'} fontSize={'15px'} alignItems={'center'} gap={1}>
            <Text>Stock: </Text>
            <Text>{product.stock === 0 ? "Out of stock" : product.stock}</Text>
          </Flex>
        </Flex>
      </Box>

      <Box display={'grid'} gridTemplateColumns={'1fr 1fr'} gap={1} minH={'100vh'} px={'50px'}>
        {/* Images */}
        <Box padding={10}>
          <Flex gap={5}>
            <Flex maxH={'700px'} width={'110px'} overflow={'hidden'} flexDirection={'column'} gap={3}>
              <Flex alignItems={'center'} justifyContent={'space-between'} mt={2}>
                <IconButton colorScheme='gray' aria-label='Up arrow' fontSize={'30px'} color={'gray.500'} borderRadius={'4px'} px={2} onClick={handleUp} icon={<MdOutlineKeyboardArrowUp />}/>
                <IconButton colorScheme='gray' aria-label='Down arrow' fontSize={'30px'} color={'#888'} borderRadius={'4px'} px={2} onClick={handleDown} icon={<MdKeyboardArrowDown />}/>
              </Flex>

              <Box overflow={'hidden'} flexGrow={1} borderRadius={'md'}>
                <Splide style={{width: '110px'}} options={{direction: 'ttb', height: `${(4*150)+32}px`, perPage: 4, gap: '10px', omitEnd: true, pagination: false, arrows: false, wheel: false, releaseWheel: true}} ref={(splide) => splideRef = splide}>
                  {product.images.map((img, index) => (
                    <SplideSlide key={index} style={{border: '1px solid #fff', maxHeight: '150px', width: '110px'}}>
                      <Box height={'150px'} onClick={() => setCurrentIndex(index)} cursor={'pointer'} _hover={{ opacity: 0.8 }}>
                        <Image src={img} w={'full'} h={'full'} objectFit={'cover'} borderRadius={'md'} />
                      </Box>
                    </SplideSlide>
                  ))}
                </Splide>
              </Box>
            </Flex>

            <Flex maxH={'700px'} maxW={'510px'} overflow={'hidden'} borderRadius={'md'}>
              <Flex transform={`translateX(-${currentIndex * 510}px)`} transition={'.5s ease'}>
                {product.images.map((img, index) => (
                  <Box key={index} minW={'510px'} height={'full'}>
                    <Image src={img} w={'full'} h={'full'} objectFit={'cover'} borderRadius={'md'}/>
                  </Box>
                ))}
              </Flex>  
            </Flex>
            
          </Flex>
        </Box>
    
        {/* Details */}
        <Box py={10}>
          <Text fontSize={'35px'} fontWeight={'500'} mb={2}>{product.name}</Text>

          <Flex alignItems={'center'} gap={1} mb={2}>
                <Text fontSize={'15px'} fontWeight={'400'} color={'gray.500'}>Color:</Text>
                <Text fontSize={'15px'} fontWeight={'500'}>{product.color}</Text>
          </Flex>
          <Flex mb={5} gap={3}>
            <Link as={RouterLink} width={'70px'} height={'70px'} overflow={'hidden'} to={`/${product.category}/${product.subCategory}/${product.name.split(" ").join("-")}/${product._id}`} _hover={{opacity: .8}}>
              <Image src={product?.images[0]} w={'full'} h={'full'} objectFit={'cover'} borderRadius={'md'}/>
            </Link>
            {similerProducts.length > 0 && similerProducts.map((p)=> (
              <Link key={p._id} as={RouterLink} width={'70px'} height={'70px'} overflow={'hidden'} to={`/${p.category}/${p.subCategory}/${p.name.split(" ").join("-")}/${p._id}`} _hover={{opacity: .8}}>
                <Image src={p.images[0]} w={'full'} h={'full'} objectFit={'cover'} borderRadius={'md'}/>
              </Link>
            ))}
          </Flex>

          <Flex alignItems={'center'} gap={1} mb={2}>
                <Text fontSize={'15px'} fontWeight={'400'} color={'gray.500'}>Sizes:</Text>
                <Text fontSize={'15px'} fontWeight={'500'}>{size}</Text>
          </Flex>
          <Flex alignItems={'center'} gap={2} mb={3}>
            {product.sizes.map((mapSize,i)=> (
              <Button key={i} borderRadius={'md'} color={'gray.700'} fontWeight={'500'} w={'45px'} h={'40px'} alignItems={'center'} justifyContent={'center'} cursor={'pointer'} onClick={() => setSize(mapSize)}>{mapSize}</Button>
            ))}
          </Flex>
          <Flex alignItems={'center'} gap={1} mb={6} fontSize={'13px'} fontWeight={'400'} color={'gray.500'}>
            <PiCoatHangerBold/>  
            <Text>Size guide</Text>
          </Flex>

          {product.stock <= 5 && product.stock > 0 && <Flex color={'red.500'} fontSize={'15px'} mb={6}>Only {product.stock} product left</Flex>}

          <Divider borderColor={'gray.300'}/>

          <Flex my={7} alignItems={'center'} gap={8}>
            <Flex alignItems={'center'} gap={2}>
              <Text fontSize={'25px'} fontWeight={'600'}>Rs. {(product.price - (product.price * product.discount) / 100).toFixed(2)}</Text>
              <Text style={{ textDecoration: "line-through" }} fontSize={'15px'} color={'gray.500'}>Rs. {product.price}</Text>
              <Text color={"blue.500"} fontSize={"17px"}>({product.discount}% OFF)</Text>
            </Flex>

            <Flex align={'center'} gap={2}>
              <Button bg={'black'} _hover={{bg: '#333'}} borderRadius={'4px'} color={'white'} w={'150px'} h={'45px'} isDisabled={product.stock === 0 ? true : false} letterSpacing={1} onClick={addToCartFunc} isLoading={addToCartLoading} fontWeight={'600'}>ADD TO CART</Button>
              <Button bg={'black'} _hover={{bg: '#333'}} borderRadius={'4px'} color={'white'} w={'150px'} h={'45px'} display={'flex'} alignItems={'center'} gap={2} letterSpacing={2} onClick={handleAddToWishlist} isLoading={addToWishlistLoading}>
                {heartIcon}
                WISHLIST
              </Button>
            </Flex>
          </Flex>
          
          <Divider borderColor={'gray.300'} mb={8}/>
          
          <Flex align={'center'} justifyContent={'space-around'} mb={8}>
            <Flex alignItems={'center'} gap={3} fontSize={'15px'} color={'gray.500'}>
              <LiaShippingFastSolid fontSize={'20px'}/>
              <Text>Shipping & Delivery</Text>
            </Flex>
            <Flex alignItems={'center'} gap={3} fontSize={'15px'} color={'gray.500'}>
              <MdOutlinePublishedWithChanges fontSize={'20px'}/>
              <Text>Returns & Exchanges</Text>
            </Flex>
            <Flex alignItems={'center'} gap={3} fontSize={'15px'} color={'gray.500'}>
              <MdForwardToInbox fontSize={'20px'}/>
              <Text>Ask a question</Text>
            </Flex>
          </Flex>

          <Flex alignItems={'center'} gap={5} mb={3}>
            <Text w={'400px'} fontWeight={'500'}>GUARANTEED SAFE CHECKOUT</Text>
            <Divider borderColor={'gray.300'}/>
          </Flex>

          <Box display={'grid'} gridTemplateColumns={'repeat(8,1fr)'} gap={2} mb={6}>
            {paymentImg.map((img,i) => (
              <Flex alignItems={'center'} justifyContent={'center'} key={i} height={'60px'} border={'1px solid'} borderColor={'gray.300'} borderRadius={'md'}>
                <Image src={img} width={'60px'}/>
              </Flex>
            ))}
          </Box>

          <Divider borderColor={'gray.300'} mb={6}/>

          <Text color={'gray.500'} fontSize={'15px'} mb={2} fontWeight={'500'}>DESCRIPTION</Text>
          <Text color={'gray.600'} fontSize={'13px'} mb={6}>{product.description}</Text>

          <Divider borderColor={'gray.300'} mb={6}/>

          <Text fontSize={'15px'} fontWeight={'600'} mb={5}>ADDITIONAL INFORMATION</Text>
          
          <Flex alignItems={'center'} gap={1} mb={2}>
                <Text fontSize={'15px'} fontWeight={'500'}>Color:</Text>
                <Flex align={'center'}>
                  <Text fontSize={'15px'} fontWeight={'400'} color={'gray.500'}>{product.color}</Text>
                  {similerProducts.map((p) => (
                    <Text key={p._id} fontSize={'15px'} fontWeight={'400'} color={'gray.500'}>, {p.color}</Text>
                  ))}
                </Flex>
          </Flex>
          
          <Flex alignItems={'center'} gap={1} mb={2}>
                <Text fontSize={'15px'} fontWeight={'500'}>Size:</Text>
                <Text fontSize={'15px'} fontWeight={'400'} color={'gray.500'}>{product.sizes.join(', ')}</Text>
          </Flex>
          
          <Flex alignItems={'center'} gap={1}>
                <Text fontSize={'15px'} fontWeight={'500'}>Material:</Text>
                <Text fontSize={'15px'} fontWeight={'400'} color={'gray.500'}>{product.material}</Text>
          </Flex>
          
          <Divider borderColor={'gray.300'} my={6}/>
          
          <Box>
            <Text fontSize={'15px'} fontWeight={'600'}>REVIEWS</Text>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Text fontSize={'15px'} color={'gray.500'}>{reviews.length} Reviews</Text>
              <Button color={'gray.500'} display={'flex'} alignItems={'center'} gap={2} fontWeight={'500'} fontSize={'15px'} onClick={onOpen}>
                <TbMessage2/>
                Write a review
              </Button>
            </Flex>

            {reviews.length > 0 && (
              reviews.slice(0,seeReviews).map((review) => (
                <Box key={review.id} p={4} mb={4}>
                  <Flex alignItems={'center'} justifyContent={'space-between'}>
                    <Flex align={'center'} gap={2}>
                      <Avatar src={review.userId.profilePic} size={'sm'}/>
                      <Text fontSize={'15px'} fontWeight={'600'}>{review.userId.fullName ? review.userId.fullName : review.userId.businessName}</Text>
                    </Flex>

                    <Flex alignItems={'center'} gap={4}>
                      <Text fontSize={'12px'} color={'gray.500'}>{formatDistanceToNow(new Date(review.createdAt))} ago</Text>
                      <Flex fontSize={'12px'} gap={1}>
                      {[1, 2, 3, 4, 5].map((starValue) => (
                          <FaStar
                            key={starValue}
                            color={starValue <= review.rating ? "orange" : "#748298"}
                          />
                      ))}
                      </Flex>
                    </Flex>
                  </Flex>

                  <Text color={'gray.500'} fontSize={'15px'} mt={2}>{review.text}</Text>
                </Box>
              ))
            )}

            {reviews.length > seeReviews && <Link color={'gray.500'} fontSize={'15px'} _hover={{color: "blue.500", textDecoration: 'underline'}} onClick={() => setSeeReviews(10)}>see reviews</Link>}
            {reviews.length < seeReviews && reviews.length > 2 && <Link color={'gray.500'} fontSize={'15px'} _hover={{color: "blue.500", textDecoration: 'underline'}} onClick={() => setSeeReviews(2)}>see less</Link>}
          </Box>
          <Divider borderColor={'gray.300'} my={6}/>
          
        </Box>
      </Box>

      <WriteReview isOpen={isOpen} onClose={onClose} product={product} setCallBackFunction={setCallBackFunction}/>
    </>
  )
}

export default ProductDetails