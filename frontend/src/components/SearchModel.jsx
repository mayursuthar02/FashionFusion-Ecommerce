import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormControl, IconButton, Image, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Text } from "@chakra-ui/react"
import { useState } from "react";
import {Link as RouterLink} from 'react-router-dom';
import { baseURL as BASEURL } from "../config/baseURL";

const SearchModel = ({isOpen, onClose}) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  
  const handleSearch = async(e) => {
    const value = e.target.value;
    setSearchValue(value);
    setLoading(true);
    if (value) {
      try {
        const res = await fetch(`${BASEURL}/api/products/v1/search/${value}`);
        const data = await res.json();
        if (data.error) {
          console.log(data.error);
          return;
        }
        setSearchResults(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }else {
      setSearchResults([]);
    }
  }
 
 
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset='slideInBottom'
        size={'xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search your product</ModalHeader>

          <ModalCloseButton _hover={{bgColor: "blue.50"}}/>
          
          <ModalBody pb={6}>
            <FormControl>
                <Box position={'relative'}>
                  <Input type="text" height={'45px'} placeholder="search..." value={searchValue} onChange={handleSearch} pr={10}/>
                  <IconButton position={'absolute'} top={'7%'} bg={'transparent'} _hover={{bg: 'transparent'}} right={1} aria-label='Search database' icon={<SearchIcon />} />
                </Box>
            </FormControl>
          </ModalBody>

          {searchResults.length > 0 && (
          <Box px={6} pb={6} maxH={'420px'} overflowY={'scroll'} className="scroll-hide">
                 
            {loading && [1,2,3,4].map((_,i) => (
              <Link key={i} display={'flex'} justifyContent={'start'} alignItems={'center'} borderRadius={'md'} p={3} gap={5}>
                <Skeleton w={'80px'} h={'80px'} borderRadius={'md'} />
                <Box>
                  <Skeleton h={6} w={'400px'} borderRadius={'md'}/>
                  <Flex align={'center'} gap={2} mt={2}>
                    <Skeleton h={5} w={'100px'} borderRadius={'md'}/>
                    <Skeleton h={5} w={'100px'} borderRadius={'md'}/>
                  </Flex>
                </Box>
              </Link>
            ))}

            {!loading && searchResults.slice(0,8).map(product => (
              <Link 
              key={product._id} 
              as={RouterLink} 
              to={`/${product.category}/${product.subCategory}/${product.name.split(" ").join("-")}/${product._id}`} 
              display={'flex'} 
              justifyContent={'start'} 
              alignItems={'center'} 
              _hover={{ bgColor: "gray.50" }} 
              borderRadius={'md'} 
              p={3} 
              gap={5} 
              onClick={onClose}>
                <Box w={'80px'} h={'80px'} borderRadius={'md'} overflow={'hidden'} bgColor={'gray.200'}>
                  <Image src={product.images[0]} w={'full'} h={'full'} objectFit={'cover'} />
                </Box>
                <Box>
                  <Text fontSize={'15px'} fontWeight={'500'}>{product.name}</Text>
                  <Flex align={'center'} gap={2} mt={2}>
                    <Text fontSize={'15px'} fontWeight={'500'}>Rs. {(product.price - (product.price * product.discount) / 100).toFixed(2)}</Text>
                    <Text style={{ textDecoration: "line-through" }} fontSize={'13px'} fontWeight={'500'} color={'gray.500'}>Rs. {product.price.toFixed(2)}</Text>
                  </Flex>
                </Box>
              </Link>
            ))}
            {searchResults.length > 8 && (
              <Text px={3} fontSize={'15px'} color={'gray.500'} mt={3}>{searchResults.length - 8} More result!</Text>
            )}
          </Box>
        )}
          

          {searchResults.length > 0 && <ModalFooter>
            <Button as={RouterLink} to={`/search?q=${searchValue}`} w={'full'} py={6} color={'white'} bgColor={'#111'} _hover={{bgColor: "#222"}} onClick={onClose}>VIEW ALL RESULTS</Button>
          </ModalFooter>}
        </ModalContent>
      </Modal>
  )
}

export default SearchModel