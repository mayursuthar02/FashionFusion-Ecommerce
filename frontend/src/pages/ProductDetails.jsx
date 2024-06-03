import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, Flex, IconButton, Image, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { IoShareSocialSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import { MdKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { PiCoatHangerBold } from "react-icons/pi";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { MdForwardToInbox } from "react-icons/md";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FaRegHeart } from "react-icons/fa6";
import { TbMessage2 } from "react-icons/tb";
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
  const showToast = useShowToast();
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  let splideRef = null;

  useEffect(() => {
    const getProductDetails = async() => {
      const res = await fetch(`/api/products/get-product-details/${productId}`);
      const data = await res.json();
      if (data.error) {
        showToast("Error",data.error,"error");
        return;
      }
      setProduct(data);
    };
    
    getProductDetails();
  },[productId]);
  
  const handleUp = () => {
    if (splideRef) {
      splideRef.go('<');
    }
  };

  const handleDown = () => {
    if (splideRef) {
      splideRef.go('>');
    }
  };
  
  if (!product) {
    return (
      <p>Product not found</p>
    )
  }
  
  return (
    <>
      <Box bg={'gray.100'} px={'50px'} py={5}>
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <Flex align={'center'} gap={1} fontSize={'15px'} color={'gray.500'}>
            <Link as={RouterLink} >{category}</Link>
            <span>/</span>
            <Link as={RouterLink} >{subCategory}</Link>
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
              <FaStar/>
              <FaStar/>
              <FaStar/>
              <FaStar/>
              <FaStar/>
            </Flex>
            <Text color={'gray.500'} fontSize={'15px'}>{product.reviews.length} reviews</Text>
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
          <Text fontSize={'30px'} fontWeight={'500'} mb={2}>{product.name}</Text>

          <Flex alignItems={'center'} gap={1} mb={2}>
                <Text fontSize={'15px'} fontWeight={'400'} color={'gray.500'}>Color:</Text>
                <Text fontSize={'15px'} fontWeight={'500'}>{product.color}</Text>
          </Flex>
          <Flex mb={5}>
            <Box width={'70px'} height={'70px'} overflow={'hidden'}>
              <Image src={product.images[0]} w={'full'} h={'full'} objectFit={'cover'} borderRadius={'md'} cursor={'pointer'}/>
            </Box>
          </Flex>

          <Flex alignItems={'center'} gap={1} mb={2}>
                <Text fontSize={'15px'} fontWeight={'400'} color={'gray.500'}>Sizes:</Text>
                <Text fontSize={'15px'} fontWeight={'500'}>S</Text>
          </Flex>
          <Flex alignItems={'center'} gap={2} mb={3}>
            {product.sizes.map((size,i)=> (
              <Button key={i} borderRadius={'md'} color={'gray.700'} fontWeight={'500'} w={'45px'} h={'40px'} alignItems={'center'} justifyContent={'center'} cursor={'pointer'}>{size}</Button>
            ))}
          </Flex>
          <Flex alignItems={'center'} gap={1} mb={6} fontSize={'13px'} fontWeight={'400'} color={'gray.500'}>
            <PiCoatHangerBold/>  
            <Text>Size guide</Text>
          </Flex>

          <Divider borderColor={'gray.300'}/>

          <Flex my={7} alignItems={'center'} gap={8}>
            <Flex alignItems={'center'} gap={2}>
              <Text fontSize={'25px'} fontWeight={'600'}>Rs. {Math.floor(product.price - (product.price * product.discount) / 100)}</Text>
              <Text style={{ textDecoration: "line-through" }} fontSize={'15px'} color={'gray.500'}>Rs. {product.price}</Text>
              <Text color={"blue.500"} fontSize={"17px"}>({product.discount}% OFF)</Text>
            </Flex>

            <Flex align={'center'} gap={2}>
              <Button bg={'black'} _hover={{bg: '#333'}} borderRadius={'4px'} color={'white'} px={10} py={6} isDisabled={product.stock === 0 ? true : false}>ADD TO CART</Button>
              <Button bg={'black'} _hover={{bg: '#333'}} borderRadius={'4px'} color={'white'} px={10} py={6} display={'flex'} alignItems={'center'} gap={3} letterSpacing={2}>
                <FaRegHeart fontSize={'20px'}/>
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

          <Text color={'gray.500'} fontSize={'15px'} mb={2}>DESCRIPTION</Text>
          <Text color={'gray.600'} fontSize={'13px'} mb={6}>{product.description}</Text>

          <Divider borderColor={'gray.300'} mb={6}/>

          <Text fontSize={'15px'} fontWeight={'500'} mb={5}>ADDITIONAL INFORMATION</Text>
          
          <Flex alignItems={'center'} gap={1} mb={2}>
                <Text fontSize={'15px'} fontWeight={'500'}>Color:</Text>
                <Text fontSize={'15px'} fontWeight={'400'} color={'gray.500'}>{product.color}</Text>
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
          
          <Flex alignItems={'center'} justifyContent={'space-between'}>
            <Text>REVIEWS</Text>
            <Button color={'gray.500'} display={'flex'} alignItems={'center'} gap={2} fontWeight={'500'} fontSize={'15px'}>
              <TbMessage2/>
              Write a review
            </Button>
          </Flex>

          {product.reviews.length !== 0 ? (
            <Box>gfgg</Box>
          ):(
            <Text color={'gray.500'} fontSize={'15px'}>0 reviews</Text>
          )}
          
          <Divider borderColor={'gray.300'} my={6}/>
          
        </Box>
      </Box>
    </>
  )
}

export default ProductDetails