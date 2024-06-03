import {Badge, Box, Button, Divider, Flex, IconButton, Image, Input, Skeleton, Text, grid, useDisclosure} from '@chakra-ui/react';
import {Search2Icon} from '@chakra-ui/icons';
import { FiPlusSquare } from "react-icons/fi";
import CreateProduct from '../components/CreateProduct';
import { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import DashboardProductCard from '../components/DashboardProductCard';
import FetchVenderProductsData from '../helpers/FetchVenderProductsData';
import venderProductAtom from '../atoms/venderProductAtom';
import { useRecoilState } from 'recoil';

const DashboardProductPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useRecoilState(venderProductAtom);
  const showToast = useShowToast();
  const fetchVenderProducts = FetchVenderProductsData();
  const loadingList = new Array(8).fill(null);


  useEffect(()=>{
    fetchVenderProducts();
  },[showToast]);


  return (
    <>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Box position={'relative'} w={'350px'}>
          <Input placeholder='search products' pr={10}/>
          <IconButton aria-label='Search' icon={<Search2Icon size={'1.5rem'}/>} color={'gray.500'} bgColor={'transparent'} _hover={{bgColor: "transparent"}} position={'absolute'} right={0} translateY='-50%'/>
        </Box>
        <Button display={'flex'} alignItems={'center'} gap={2} colorScheme='blue' borderRadius={'md'} onClick={onOpen}>
          <FiPlusSquare size={'17px'}/>
          Add Product
        </Button>
      </Flex>

      <Divider borderColor={'#e5e5e5'} my={5}/>

      {/* Loading skeleton */}
      {products.length == 0 && (
        <Box display={'grid'} gridTemplateColumns={'repeat(4, 1fr)'} gap={5} my={5}>
          {loadingList.map((_,i) => (
            <Box>
              <Skeleton height={'370px'} borderRadius={'md'}/>
              <Skeleton height={'19px'} mt={2} borderRadius={'md'}/>
              <Skeleton height={'19px'} mt={2} borderRadius={'md'}/>
              <Skeleton height={'19px'} mt={2} borderRadius={'md'}/>
            </Box>
          ))}
        </Box>
      )}

      {/* Show proudct */}
      {products.length > 0 ? (
        <Box display={'grid'} gridTemplateColumns={'repeat(4, 1fr)'} gap={5} my={5}>
          {products.map((product) => (
            <DashboardProductCard key={product._id} product={product} />
          ))}
        </Box>
      ) : (
        <Flex alignItems={'center'} justifyContent={'center'} mt={60}>
          <Text color={'gray.500'}>You haven't created any products yet.</Text>
        </Flex>
      )}
      

      <CreateProduct isOpen={isOpen} onClose={onClose}/>
    </>
  )
}

export default DashboardProductPage