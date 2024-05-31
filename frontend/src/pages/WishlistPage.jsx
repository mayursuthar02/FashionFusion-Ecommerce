import { Box, Flex, Link, Heading, Image, Text, Button } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import img1 from '../assets/img.jpg';

const WishlistPage = () => {
  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'}>
        <Flex align={'center'} justifyContent={'center'} flexDirection={'column'}>
            <Heading color={'#121212'} fontSize={'2xl'} mb={2}>PLEASE LOG IN</Heading>
            <Text color={'gray.500'} mb={4}>Login to view items in your wishlist.</Text>
            <Box width={'500px'} height={'300px'} mb={5}>
                <Image src={img1}/>
            </Box>
            <Link as={RouterLink} to={'/login'}>
                <Button colorScheme="blue" mt={6}>Login</Button>
            </Link>
        </Flex>
    </Flex>
  )
}

export default WishlistPage